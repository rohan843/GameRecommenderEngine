require('dotenv').config();
const express = require('express');
const parser = require('body-parser');
const json = require('body-parser/lib/types/json');
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios')

// ---- DB Related work ----
const url = "mongodb+srv://user1:PasswordMongoDB@cluster0.ilunp.mongodb.net/";

const app = express();
app.use(parser.urlencoded({ extended: true }));


const newUserData = {
    "uid": -2,
    "age": 27,
    "Casual": 0.34,
    "Strategy": 0.0,
    "RPG": 0.33,
    "Photo Editing": 0.0,
    "Valve": 0.0,
    "Sports": 0.0,
    "Software Training": 0.0,
    "Accounting": 0.0,
    "Adventure": 0.33,
    "Indie": 0.0,
    "Audio Production": 0.0,
    "Animation & Modeling": 0.0,
    "Game Development": 0.0,
    "Simulation": 0.0,
    "Design & Illustration": 0.0,
    "Education": 0.0,
    "Utilities": 0.0,
    "Movie": 0.0,
    "Early Access": 0.0,
    "Racing": 0.0,
    "Action": 0.0,
    "Web Publishing": 0.0,
    "Video Production": 0.0,
    "Free to Play": 0.0,
    "Massively Multiplayer": 0.0,
    "Simplified Chinese": 0.0,
    "Ukrainian": 0.0,
    "Dutch": 0.0,
    "Norwegian": 0.0,
    "Japanese": 0.0,
    "Arabic": 0.0,
    "Finnish": 0.0,
    "Portuguese": 0.0,
    "Turkish": 0.0,
    "#lang_#lang_#lang_english**#lang_full_audio*#lang_full_audio": 0.0,
    "Hungarian": 0.0,
    "Romanian": 0.0,
    "Korean": 0.0,
    "Traditional Chinese": 0.0,
    "Greek": 0.0,
    "#lang_german;": 0.0,
    "Vietnamese": 0.0,
    "Portuguese - Brazil": 0.0,
    "Russian": 0.0,
    "#lang_#lang_spanish*#lang_full_audio": 0.0,
    "Polish": 0.0,
    "Czech": 0.0,
    "(all with full audio support)": 0.0,
    "English": 0.0,
    "Danish": 0.0,
    "Thai": 0.0,
    "Italian": 0.0,
    "Spanish - Spain": 0.0,
    "Slovakian": 0.0,
    "German": 0.0,
    "Spanish - Latin America": 0.0,
    "Swedish": 0.0,
    "French": 0.0,
    "Bulgarian": 0.0
};

// ---- Recommender API functions ----
const baseURL = 'http://127.0.0.1:5000';
const resetRecommenderData = (pw = 'qwerty') => {
    const url = baseURL + '/refresh_model_data';
    axios.post(url, {}, {
        headers: {
            pw: pw
        }
    }).then(res => {
        console.log(`statusCode: ${res.status}`);
        console.log(res);
    }).catch(error => {
        console.error(error);
    });
};


// ---- API Endpoints ----
app.post('/new_user_refresh', (req, res) => {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const dbo = db.db("recommenderDB");
        const myquery = { uid: -2 };
        const newValues = { $set: newUserData };
        dbo.collection("allUserData").updateOne(myquery, newValues, function (err, result) {
            if (err) throw err;
            res.send({ message: 'New user refreshed.' });
            resetRecommenderData();
            db.close();
        });
    });

});

app.listen(4000, () => {
    console.log("Server set up to listen on port 4000.");
});