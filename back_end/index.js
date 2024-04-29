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

function checkSession(username, token) {
    let index = sessions.findIndex((element) => element.token === token);
    if (index === -1) return false;
    if (sessions[index].expiry < Date.now()) {
        sessions.splice(index, 1);
        return false;
    }
    return sessions[index].username === username;
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

serverSetup().then(() => {  
});