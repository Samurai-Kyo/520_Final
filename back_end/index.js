const express = require('express');
const app = express();
app.use(express.json());

const data = require('./keys.json');
const OpenAI = require('openai').default;
const openaiInstance = new OpenAI({ apiKey: data.OpenAI });

const Anthropic = require('@anthropic-ai/sdk');
const anthropicInstance = new Anthropic({"apiKey": data.Anthropic});

// MySQL Setup
const mysql = require('mysql');
var dbConnection = mysql.createConnection({
    host: data.sqlAddress,
    user: data.sqlUser,
    password: data.sqlPassword,
});
dbConnection.connect(function(err) {
    if(err) throw err;
    console.log("Connected to datbase with address " + data.sqlAddress);
});