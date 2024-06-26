# 520_Final

## Outline:

This application allows for users to upload code snippets and have code summaries generated by multiple APIs. This site allows users to compare their review scores to get the average ratings.

## Features:

The feature list is split into two different groups, Users and Admins. Admins have elevated privileges, having all of the features of a User plus some administration features.  Admins are able to view the summaries of all of the users and get the average ratings across various groups. They also can create and delete users and change their passwords.
Users can upload code and save code summaries to their accounts. They can rate these summaries on a scale of 1-5 for various properties and give feedback on the summary. Users can also upload a file that consists of a code-summary pair to be able to add ratings to summaries they did not create. Then, users can get the average rating of those summaries.

## Architecture:

Front End:
Javascript
Svelte framework
Skeleton UI Library 
Major functionality is separated into reusable components.
Observer pattern implemented for file stores.

Back End:
Javascript
Express

Database:
MySQL hosted on an External Server

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

The backend requires an MySQL database, an OpenAI, and an Anthropic key.
A file must be created.
back_end/keys.json
{
    "OpenAI": "",
    "Anthropic": "",
    "sqlAddress": "",
    "sqlUser": "",
    "sqlPassword": ""
}

## Testing:
The back-end server and the database must be running. 

cd test
npm install
npm run test

## Endpoints:
back_end/Final Project -- Backend API Documentation.pdf

## DEMO:
https://drive.google.com/file/d/153JfR4BZkXqGjXeWAeA0S8iC7LD-QjyB/view?usp=sharing
