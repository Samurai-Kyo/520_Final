# 520_Final

## Outline:

This application allows for users to upload code snippets and have code summaries generated by multiple API. This site allows users to compare their review scores to get the average ratings.

## Features:

Users can rate these summaries and save them to their account. 
Users upload a file with pregenerated summaries to add ratings of other models to the database. 
Users get the average ratings of these summaries. 

Admins view the summaries of all user and get average ratings across a group of users or the entire database.
Admins create and delete user
Admins view the summaries of users and get average ratings across the database.

## Architecture:

Front End:
Javascript
Svelte framework
Major functionality separates into reusable components.
Observer pattern implemented for file stores.

Back End:
Javascript
Express

Database:
MySQL

External API:
gpt-4-turbo
gpt-3.5-turbo
claude-3-opus-20240229 
claude-3-haiku-20240307

## Setup:

Front End:
npm install
npm run dev

Back End:
npm install
node index.js

backend/keys.js
{
    "OpenAI": "",
    "Anthropic": "",
    "sqlAddress": "",
    "sqlUser": "",
    "sqlPassword": ""
}

## Endpoints:
Backend/Final Project -- Backend API Documentation.pdf