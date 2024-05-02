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
    constructor(completions, ratings = null) {
        this.content = [];
        if(ratings === null) {
            completions.forEach((element) => {
                this.content.push({model: element.model, text: element.text, naturalRating: 0, usefulRating: 0, consistentRating: 0});
            });
        }
        else {
            completions.forEach((element, index) => {
                this.content.push({model: element.model, text: element.text, naturalRating: ratings[index].naturalRating, usefulRating: ratings[index].usefulRating, consistentRating: ratings[index].consistentRating});
            });
        }
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

async function saveContent(username, code, completions, ratings = null) {
    try {
    const connection = await pool.getConnection();
    const [results] = await connection.query("SELECT * FROM credentials WHERE username = ?", [username]);
    if(results.length === 0) {
        throw new Error("User not found in database.");
    }
    let content = new SummarizationContent(completions, ratings);
    let contentString = JSON.stringify(content);
    let query = 'INSERT INTO summarizations (username, inputCode, content) VALUES (?, ?, ?)';
    await connection.query(query, [username, code, contentString]);
    console.log("Content saved for user: ", username)
    connection.release();
    return connection.insertId;
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
    if(adminAcc.password === "jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=") {
        console.log("Admin account still has default password!! Please change it as soon as possible");
    }
    app.listen(3000, () => {
        console.log("Setup successful: server is running on port 3000");
    }); 
}

// login endpoint allows you to log in with the given username and password.
// The headers should contain the username and password.
// If the login is successful, the response will be the session token (base64 string) for the user, which needs to be attached as a header to all requests to other endpoints.
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

// createAccount endpoint allows you to create a new account with the given username and password.
// The headers should contain the new username and password.
// If the new account should be an admin account, the header newadmin should be set to "true". -- This requires an admin's session token to be provided.
// If the account is created successfully, the response will be "Account created successfully."
app.get('/createAccount', async (req, res) => {
    try {
    const newUsername = req.headers.newusername;
    const newPassword = req.headers.newpassword;
    const shouldBeAdmin = req.headers.newadmin === "true";

    if(shouldBeAdmin) {
        const token = req.headers.token;
        const username = req.headers.username;
        if(!checkSession(username, token, true)) {
            res.status(401).send("Invalid session token, or lacking privileges.");
            res.end();
            return;
        }
    }

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

// summarize endpoint allows you to summarize a given code snippet using the models provided in the body.
// The body should contain the code to be summarized, and a list of models to use for summarization, as one string, with the model names separated by commas.
// The headers should contain the username and token of the user making the request.
// The response will be formatted as follows: 
// [
//     {model: "model name", text: "completion text"},
//     {model: "model name", text: "completion text"},
//     ...
//     {id: id}
// ]
// The ID is the ID of the summarization in the database, and can be used to retrieve the summarization later, or to upload ratings for the summarization.
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
    let id = await saveContent(username, code, completions);
    console.log(completions)
    completions.push({id: id})
    res.send(completions);
    res.end();
    
    console.log("Provided " + models.length.toString() +  " completions for user: ", username);
    
    } catch (err) {
        console.log("Error in /summarize: ", err);
        res.status(500).send("Internal server error");
        res.end();
    }
});


// getSummarizations endpoint allows you to get all the summarizations that a user has uploaded.
// The headers should contain the username and token of the user making the request.
// The response will be an array of objects, each containing the ID of the summarization, the code that was summarized, and the completions provided by the models.
// Completions are of the form: {model: String, text: String, naturalRating: Int(0-10), usefulRating: Int(0-10), consistentRating: Int(0-10)}
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

// Allows you to upload a code/summarization/rating pair to the database. 
// The body should contain the code, completions, and ratings in the following format:
// {
//     code: "your code here",
//     completions: [
//         {model: "model name", text: "completion text"},
//         {model: "model name", text: "completion text"},
//         ...
//     ],
//     ratings: [
//         {naturalRating: 0, usefulRating: 0, consistentRating: 0},
//         {naturalRating: 0, usefulRating: 0, consistentRating: 0},
//         ...
//     ]
// }
app.post('/uploadSummarization', async (req, res) => {
    try {
    const username = req.headers.username;
    const token = req.headers.token;
    if(!checkSession(username, token)) {
        res.status(401).send("Invalid session token.");
        return;
    }
    const code = req.body.code;
    const completions = req.body.completions;
    const ratings = req.body.ratings;
    let id = await saveContent(username, code, completions, ratings);
    res.send("Content uploaded successfully with ID: " + id);
    res.end();
    console.log("Uploaded content for user: ", username);
    } catch (err) {
        console.log("Error in /uploadSummarization: ", err);
        res.status(500).send("Internal server error");
        res.end();
    }
});

// setRating endpoint allows you to set the ratings for a given summarization.
// The body should contain the ratings in the following format:
// {
//     ratings: [
//         {model: "model name", naturalRating: 0, usefulRating: 0, consistentRating: 0},
//         {model: "model name", naturalRating: 0, usefulRating: 0, consistentRating: 0},
//         ...
//     ]
// }
// There should only be one rating object for each model name, and there should only be ratings for models that provided summaries for the given ID. 
// The headers should contain the ID of the summarization you are rating (returned by /summarize, or /getSummaries), and the username and token of the user making the request.
app.post('/setRating', async (req, res) => {
    try {
    const username = req.headers.username;
    const token = req.headers.token;
    const ratings = req.body.ratings; // Array of ratings in the form: {model: "model name", naturalRating: 0, usefulRating: 0, consistentRating: 0}
    if(!checkSession(username, token)) {
        res.status(401).send("Invalid session token.");
        return;
    }
    const id = req.headers.id;
    const query = 'SELECT * FROM summarizations WHERE id = ?';
    const [results] = await pool.query(query, [id]);
    if(results.length === 0) {
        res.status(400).send("Invalid ID.");
        return;
    }
    let oldContent = JSON.parse(results[0].content);
    for (let rating of ratings) {
        let index = oldContent.findIndex((element) => element.model === rating.model);
        if(index === -1) {
            res.status(400).send("Invalid model name: " + rating.model);
            return;
        }
        oldContent[index].naturalRating = rating.naturalRating;
        oldContent[index].usefulRating = rating.usefulRating;
        oldContent[index].consistentRating = rating.consistentRating;
    }
    let contentString = JSON.stringify(oldContent);
    const query2 = 'UPDATE summarizations SET content = ? WHERE id = ?';
    await pool.query(query2, [contentString, id]);
    res.send("Ratings updated successfully.");
    }
    catch (err) {
        console.log("Error in /setRating: ", err);
        res.status(500).send("Internal server error");
    }
});

app.get('/stats', async (req, res) => {
    try {
    const username = req.headers.username;
    const token = req.headers.token;
    if(!checkSession(username, token, true)) {
        res.status(401).send("Invalid session token.");
        return;
    }
    const query = 'SELECT * FROM summarizations';
    const [results] = await pool.query(query);
    let content = [];
    results.forEach((element) => {
        content.push({id: element.id, username: element.username, code: element.inputCode, completions: JSON.parse(element.content).content});
    });
    console.log(content)
    let stats = {};
    stats.totalSummarizations = content.length;
    let totalNaturalRating = 0;
    let totalUsefulRating = 0;
    let totalConsistentRating = 0;
    let n = 0
    for(let summarization of content) {
        for(let completion of summarization.completions) {
            totalNaturalRating += completion.naturalRating;
            totalUsefulRating += completion.usefulRating;
            totalConsistentRating += completion.consistentRating;
            n++;
        }
    }
    stats.averageNaturalRating = totalNaturalRating / n;
    stats.averageUsefulRating = totalUsefulRating / n;
    stats.averageConsistentRating = totalConsistentRating / n;
    res.send(stats);
    console.log("Provided content for admin: ", username);
    } catch (err) {
        console.log("Error in /stats: ", err);
        res.status(500).send("Internal server error");
        res.end();
    }
});

serverSetup().then(() => {  
});