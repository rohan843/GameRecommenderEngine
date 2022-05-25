require('dotenv').config();
const express = require('express');
const parser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

// ---- DB Related work ----
const url = "mongodb+srv://user1:PasswordMongoDB@cluster0.ilunp.mongodb.net/";

const app = express();
app.use(parser.urlencoded({ extended: true }));

// ---- API Endpoints ----
app.post('/new_user_refresh', (req, res) => {
    res.send('New user refreshed.');
});

app.listen(4000, () => {
    console.log("Server set up to listen on port 4000.");
});