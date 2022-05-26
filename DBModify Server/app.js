require('dotenv').config();
const express = require('express');
const parser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const Mutex = require('async-mutex').Mutex;
const Semaphore = require('async-mutex').Semaphore;
const withTimeout = require('async-mutex').withTimeout;

const mutex = new Mutex();

// Inverts a javascript object ({key: value} -> {value: key}).
const f = obj => Object.fromEntries(Object.entries(obj).map(a => a.reverse()))

// Maps genre ids to genre names.
const genreDict = { 0: 'Casual', 1: 'Strategy', 2: 'RPG', 3: 'Photo Editing', 4: 'Valve', 5: 'Sports', 6: 'Software Training', 7: 'Accounting', 8: 'Adventure', 9: 'Indie', 10: 'Audio Production', 11: 'Animation & Modeling', 12: 'Game Development', 13: 'Simulation', 14: 'Design & Illustration', 15: 'Education', 16: 'Utilities', 17: 'Movie', 18: 'Early Access', 19: 'Racing', 20: 'Action', 21: 'Web Publishing', 22: 'Video Production', 23: 'Free to Play', 24: 'Massively Multiplayer', 25: 'Simplified Chinese', 26: 'Ukrainian', 27: 'Dutch', 28: 'Norwegian', 29: 'Japanese', 30: 'Arabic', 31: 'Finnish', 32: 'Portuguese', 33: 'Turkish', 34: '#lang_#lang_#lang_english**#lang_full_audio*#lang_full_audio', 35: 'Hungarian', 36: 'Romanian', 37: 'Korean', 38: 'Traditional Chinese', 39: 'Greek', 40: '#lang_german;', 41: 'Vietnamese', 42: 'Portuguese - Brazil', 43: 'Russian', 44: '#lang_#lang_spanish*#lang_full_audio', 45: 'Polish', 46: 'Czech', 47: '(all with full audio support)', 48: 'English', 49: 'Danish', 50: 'Thai', 51: 'Italian', 52: 'Spanish - Spain', 53: 'Slovakian', 54: 'German', 55: 'Spanish - Latin America', 56: 'Swedish', 57: 'French', 58: 'Bulgarian' };

// Maps genre names to genre ids.
const genreDictRev = f(genreDict);


// ---- DB Related work ----
const url = "mongodb+srv://user1:PasswordMongoDB@cluster0.ilunp.mongodb.net/";

const app = express();
app.use(parser.urlencoded({ extended: true }));
app.use(express.json());

// ---- User Action Count ----
const maxUACount = 500000000;
let regUserActionCount = 0;

// Returns true if recommender must be reset.
const registerUAAndQueryRecommenderReset = () => {
    regUserActionCount = regUserActionCount + 1;
    if (regUserActionCount === maxUACount) {
        regUserActionCount = 0;
        return true;
    }
    return false;
};


const newUserRecData = {
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

const newUserSysData = {
    uid: -2,
    total: 3,
    Casual: 0.34,
    Strategy: 0,
    RPG: 0.33,
    'Photo Editing': 0,
    Valve: 0,
    Sports: 0,
    'Software Training': 0,
    Accounting: 0,
    Adventure: 0.33,
    Indie: 0,
    'Audio Production': 0,
    'Animation & Modeling': 0,
    'Game Development': 0,
    Simulation: 0,
    'Design & Illustration': 0,
    Education: 0,
    Utilities: 0,
    Movie: 0,
    'Early Access': 0,
    Racing: 0,
    Action: 0,
    'Web Publishing': 0,
    'Video Production': 0,
    'Free to Play': 0,
    'Massively Multiplayer': 0,
    'Simplified Chinese': 0,
    Ukrainian: 0,
    Dutch: 0,
    Norwegian: 0,
    Japanese: 0,
    Arabic: 0,
    Finnish: 0,
    Portuguese: 0,
    Turkish: 0,
    '#lang_#lang_#lang_english**#lang_full_audio*#lang_full_audio': 0,
    Hungarian: 0,
    Romanian: 0,
    Korean: 0,
    'Traditional Chinese': 0,
    Greek: 0,
    '#lang_german;': 0,
    Vietnamese: 0,
    'Portuguese - Brazil': 0,
    Russian: 0,
    '#lang_#lang_spanish*#lang_full_audio': 0,
    Polish: 0,
    Czech: 0,
    '(all with full audio support)': 0,
    English: 0,
    Danish: 0,
    Thai: 0,
    Italian: 0,
    'Spanish - Spain': 0,
    Slovakian: 0,
    German: 0,
    'Spanish - Latin America': 0,
    Swedish: 0,
    French: 0,
    Bulgarian: 0
}

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
        console.log(res.data);
    }).catch(error => {
        console.error(error);
    });
};

// ---- User Action Resolvers ----
const validateUA = (userAction) => {
    return true;
};

const getValidGenreIds = (genre_ids) => {
    const lst = [];
    for (let id of genre_ids) {
        if (id in Object.keys(genreDict)) {
            lst.push(id);
        }
    }
    return lst;
};

const resolveGenreUserAction = async (userAction) => {
    const uid = userAction.uid;
    const genre_ids = getValidGenreIds(userAction.genre_ids);
    if (genre_ids.length === 0) {
        return;
    }
    console.log(uid, genre_ids);

    const client = await MongoClient.connect(url).catch(err => { console.log(err) });
    if (!client) {
        return;
    } else {
        try {
            const sysDB = client.db('sysDB');
            const collection = sysDB.collection('userGenreBehaviour');
            const query = { uid: uid };
            const res = await collection.findOne(query);
            const newTotal = res.total + genre_ids.length;
            const oldTotal = res.total;
            res.total = newTotal;
            for (let id of Object.keys(genreDict)) {
                const curValue = res[genreDict[id]] * oldTotal;
                let newValue = curValue;
                if (id in genre_ids) {
                    newValue++;
                }
                res[genreDict[id]] = newValue / newTotal;
            }
            console.log(res);
            const newSysValues = { $set: res };
            await collection.updateOne(query, newSysValues);

            

            client.close();
        } catch (e) {
            console.log(e);
            client.close();
        }
    }

    // const reset = await mutex.runExclusive(async () => {
    //     return registerUAAndQueryRecommenderReset();
    // });
    // if (reset) {
    //     resetRecommenderData();
    // }
};
const resolveGameUserAction = async (userAction) => {
    if (userAction.sub_type === 'pagevisit') {
        resolveGamePageVisit(userAction);
    } else if (userAction.sub_type === 'purchase') {
        resolveGamePurchase(userAction);
    } else if (userAction.sub_type === 'rating') {
        resolveGameRating(userAction);
    }
    // const reset = await mutex.runExclusive(async () => {
    //     return registerUAAndQueryRecommenderReset();
    // });
    // if (reset) {
    //     resetRecommenderData();
    // }
};
const resolveGamePageVisit = async (userAction) => {
    console.log(userAction);
};
const resolveGamePurchase = async (userAction) => {
    console.log(userAction);
};
const resolveGameRating = async (userAction) => {
    console.log(userAction);
};


// ---- API Endpoints ----
app.post('/new_user_refresh', (req, res) => {

    MongoClient.connect(url, async function (err, client) {
        if (err) throw err;
        const recDB = client.db("recommenderDB");
        const sysDB = client.db("sysDB");
        const query = { uid: -2 };
        const newRecValues = { $set: newUserRecData };
        const newSysValues = { $set: newUserSysData };
        try {
            await recDB.collection("allUserData").updateOne(query, newRecValues);
            await sysDB.collection("userGenreBehaviour").updateOne(query, newSysValues);
            await sysDB.collection("userGameBehaviour").deleteMany(query);
        } catch (e) {
            console.log(e);
        }
        res.send({ message: 'New user refreshed.' });
        resetRecommenderData();
        client.close();
    });

});

app.post('/store_user_actions', (req, res) => {
    for (let userAction of req.body) {
        if (!validateUA(userAction)) {
            continue;
        }
        if (userAction.type === 'genre') {
            resolveGenreUserAction(userAction);
        } else if (userAction.type === 'game') {
            resolveGameUserAction(userAction);
        }
    }
    res.send({ message: 'User actions updated.' });
});

app.listen(4000, () => {
    console.log("Server set up to listen on port 4000.");
});