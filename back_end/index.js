const express = require('express');
const app = express();
app.use(express.json());
const fs = require('fs').promises;

const data = require('./keys.json');
const OpenAI = require('openai').default;
const openaiInstance = new OpenAI({ apiKey: data.OpenAI });

const Anthropic = require('@anthropic-ai/sdk');
const anthropicInstance = new Anthropic({"apiKey": data.Anthropic});

// MySQL Setup
const mysql = require('mysql2/promise');
let pool = mysql.createPool({
    host: data.sqlAddress,
    user: data.sqlUser,
    password: data.sqlPassword,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Sessions setup
const crypto = require('crypto');
const sessions = [];
class SessionToken {
    constructor(username, isAdmin = false) {
        let array = new Uint32Array(10);
        crypto.randomFillSync(array);
        this.token = crypto.createHash('sha256').update(username + array.toString().replaceAll(",","")).digest('base64');
        this.expiry = Date.now() + 3600000;
        this.username = username;
        this.isAdmin = isAdmin;
    }
}

class SummarizationContent {
    constructor(completions) {
        this.content = [];
        completions.forEach((element) => {
            this.content.push({model: element.model, text: element.text, rating: 0});
        });
    }
}

function checkSession(username, token, adminRequired = false) {
    let index = sessions.findIndex((element) => element.token === token);
    if (index === -1) return false;
    if (sessions[index].expiry < Date.now()) {
        sessions.splice(index, 1);
        return false;
    }
    if (adminRequired && !sessions[index].isAdmin) return false;
    return sessions[index].username === username;
}

async function saveContent(username, code, completions) {
    try {
    const connection = await pool.getConnection();
    const [results] = await connection.query("SELECT * FROM credentials WHERE username = ?", [username]);
    if(results.length === 0) {
        throw new Error("User not found in database.");
    }
    let content = new SummarizationContent(completions);
    let contentString = JSON.stringify(content);
    let query = 'INSERT INTO summarizations (username, inputCode, content) VALUES (?, ?, ?)';
    await connection.query(query, [username, code, contentString]);
    console.log("Content saved for user: ", username)
    connection.release();
    }
    catch (err) {
        console.log("Error saving content: ", err);
        throw new Error("Error saving content.");
    }
}

async function serverSetup() {
    const connection = await pool.getConnection();
    const [databases] = await connection.query("SHOW DATABASES LIKE 'storage';");
    if (databases.length === 0) {
        try {
        console.log("First time setup hasn't ran yet -- running script now.");
        let setupScript = await fs.readFile('dbsetup.sql', 'utf8')
        setupScript = setupScript.replace(/(\r\n|\n|\r)/gm, "").split(";");
        for (line of setupScript) {
            if(line.length > 0)
            await connection.query(line);
        }
        console.log("Setup script ran successfully.");
        } catch (err) {
            console.log("Error running setup script: ", err);
        }
    }
    connection.release();
    pool = mysql.createPool({
        host: data.sqlAddress,
        user: data.sqlUser,
        password: data.sqlPassword,
        database: 'storage',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    let [users] = await pool.query("SELECT * FROM credentials;");
    let adminAcc = users.find((element) => element.isAdmin === 1 && element.username === "admin");
    if(adminAcc.password === "admin") {
        console.log("Admin account still has default password!! Please change it as soon as possible");
    }
    app.listen(3000, () => {
        console.log("Setup successful: server is running on port 3000");
    }); 
}

app.get('/login', async (req, res) => {
    try {
    const username = req.headers.username;
    const password = req.headers.password;
    const query = 'SELECT * FROM credentials WHERE username = ?';
    const [results] = await pool.query(query, [username]);
    if(results.length === 0) {
        res.status(401).send("User not found or incorrect password.");
        return;
    }
    const hashedPasswordActual = results[0].password;
    const hashedPasswordInput = crypto.createHash('sha256').update(password).digest('base64');
    if (hashedPasswordActual !== hashedPasswordInput) {
        res.status(401).send("User not found or incorrect password.");
        return;
    }
    if(sessions.find((element) => element.username === username)) {
        sessions.splice(sessions.findIndex((element) => element.username === username), 1);
        console.log("User logged in but already had an active session token, invalidating old one. ", username);
    }
    const token = new SessionToken(username, results[0].isAdmin === 1);
    sessions.push(token);
    res.send(token.token);
    res.end();
    console.log("User logged in: ", username);
    }
    catch (err) {
        console.log("Error in /login: ", err);
        res.status(500).send("Internal server error");
    }
});

app.get('/createAccount', async (req, res) => {
    try {
    const username = req.headers.username;
    const token = req.headers.token;
    const newUsername = req.headers.newusername;
    const newPassword = req.headers.newpassword;
    const shouldBeAdmin = req.headers.newadmin === "true";
    if(!checkSession(username, token, true)) {
        res.status(401).send("Invalid session token, or lacking privileges.");
        res.end();
        return;
    }
    const query = 'SELECT * FROM credentials WHERE username = ?';
    const [results] = await pool.query(query, [newUsername]);
    if(results.length > 0) {
        res.status(400).send("Username already exists.");
        res.end();
        return;
    }
    
    const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('base64');
    const query2 = 'INSERT INTO credentials (username, password, isAdmin) VALUES (?, ?, ?)';
    await pool.query(query2, [newUsername, hashedPassword, shouldBeAdmin ? 1 : 0]);
    res.send("Account created successfully.");
    res.end();
    console.log("Account created: ", username);
    }
    catch (err) {
        console.log("Error in /createAccount: ", err);
        res.status(500).send("Internal server error");
    }
});

app.post('/summarize', async (req, res) => {
    try {
    const username = req.headers.username;
    const token = req.headers.token;
    console.log(token)
    if(!checkSession(req.headers.username, token)) {
        console.log(sessions)
        res.status(401).send("Invalid session token.");
        return;
    }
    const code = req.body.code;
    const models = req.body.models.split(",");
    console.log(models)
    let completions = [];
    const sysPrompt = "Summarize the following code: \n" + code + "\n\n";
    for(chatModel of models) {
        if(chatModel === "gpt-4-turbo" || chatModel === "gpt-3.5-turbo"){
            console.log("Performing OpenAI completion for model: ", chatModel);
            thisSummarization = await openaiInstance.chat.completions.create({
                model: chatModel,
                messages: [{role: 'system', content: sysPrompt + code}],
                n: 1
            })
            completions.push({model: chatModel, text:thisSummarization.choices[0].message.content})
        }
        else if(chatModel === "claude-3-opus-20240229" || chatModel === "claude-3-haiku-20240307") {
            console.log("Performing Anthropic completion for model: ", chatModel);
            thisSummarization = await anthropicInstance.messages.create({
                model: chatModel,
                system: sysPrompt,
                messages: [{role: 'user', content: code}],
                max_tokens: 1000,
            })
            completions.push({model: chatModel, text: thisSummarization.content[0].text});
        }
        else {
            res.status(400).send("Invalid model name: " + chatModel);
            return;
        }
    }

    console.log(completions)
    res.send(completions);
    res.end();
    console.log("Provided " + models.length.toString() +  " completions for user: ", username);
    await saveContent(username, code, completions);
    } catch (err) {
        console.log("Error in /summarize: ", err);
        res.status(500).send("Internal server error");
        res.end();
    }
});

app.get('/getSummarizations', async (req, res) => {
    try {
    const username = req.headers.username;
    const token = req.headers.token;
    if(!checkSession(username, token)) {
        res.status(401).send("Invalid session token.");
        return;
    }
    const query = 'SELECT * FROM summarizations WHERE username = ?';
    const [results] = await pool.query(query, [username]);
    let content = [];
    results.forEach((element) => {
        content.push({id: element.id, code: element.inputCode, completions: JSON.parse(element.content)});
    });
    res.send(content);
    res.end();
    console.log("Provided content for user: ", username);
    } catch (err) {
        console.log("Error in /getSummarizations: ", err);
        res.status(500).send("Internal server error");
        res.end();
    }
});

app.get('/setRating', async (req, res) => {
    try {
    const username = req.headers.username;
    const token = req.headers.token;
    if(!checkSession(username, token)) {
        res.status(401).send("Invalid session token.");
        return;
    }
    const id = req.headers.id;
    const ratings = Array.from(req.headers.ratings);
    const query = 'SELECT * FROM summarizations WHERE id = ?';
    const [results] = await pool.query(query, [id]);
    if(results.length === 0) {
        res.status(400).send("Invalid ID.");
        return;
    }
    let content = JSON.parse(results[0].content);
    for(let i = 0; i < content.content.length; i++) {
        content.content[i].rating = ratings[i];
    }
    let contentString = JSON.stringify(content);
    const query2 = 'UPDATE summarizations SET content = ? WHERE id = ?';
    await pool.query(query2, [contentString, id]);
    res.send("Ratings updated successfully.");
    }
    catch (err) {
        console.log("Error in /setRating: ", err);
        res.status(500).send("Internal server error");
    }
});

serverSetup().then(() => {  
});