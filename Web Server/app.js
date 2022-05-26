require('dotenv').config();
const express = require('express');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieHandler = require('./Utilities/cookieHandler.js');
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');


const app = express();

// Returns a random integer between min (included) and max (excluded)
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// ---- Database Related Work ----
const url = "mongodb+srv://user1:PasswordMongoDB@cluster0.ilunp.mongodb.net/";

// Given a list of ids, it returns the mongo db query to find all those ids.
function getMongoQuery(ids, id_col = 'id') {
    let list = [];
    for (let i = 0; i < ids.length; i++) {
        let a = {};
        a[id_col] = ids[i];
        list.push(a);
    }
    return (list.length && (list && { '$or': list })) || { 'skdbgdbg': 'dhgivbedsri' };
}

// Inputs a list of game ids and returns game details of the valid games in an array in arbitrary order.
const getGameData = async (game_ids) => {
    const client = await MongoClient.connect(url).catch(err => { console.log(err) });
    if (!client) {
        return [];
    } else {
        try {
            const db = client.db('recommenderDB');
            const collection = db.collection('allGameData');
            const query = getMongoQuery(game_ids);
            const res = await collection.find(query).toArray();
            client.close();
            return res;
        } catch (e) {
            console.log(e);
            client.close();
            return [];
        }
    }
};

// Given an array of game ids, and an array of game data, it sorts the game data according to game ids.
const sortGameData = (game_ids, game_data) => {
    let id_dict = {};
    for (let i = 0; i < game_ids.length; i++) {
        id_dict[game_ids[i]] = i;
    }
    game_data.sort((a, b) => id_dict[a.id] - id_dict[b.id]);
    return game_data;
};

// Inputs a list of game ids and returns their feature details.
const getGameFeatureData = async (game_ids) => {
    const client = await MongoClient.connect(url).catch(err => { console.log(err) });
    if (!client) {
        return {};
    } else {
        try {
            const db = client.db('recommenderDB');
            const collection = db.collection('gameFeatures');
            const query = getMongoQuery(game_ids);
            const res = await collection.find(query).toArray();
            client.close();
            return res;
        } catch (e) {
            console.log(e);
            client.close();
            return {};
        }
    }
};

// Returns the number of users in the database.
const numUsers = async () => {
    const client = await MongoClient.connect(url).catch(err => { console.log(err) });
    if (!client) {
        return [];
    } else {
        try {
            const db = client.db('recommenderDB');
            const collection = db.collection('allUserData');
            const res = await collection.estimatedDocumentCount();
            client.close();
            return res;
        } catch (e) {
            console.log(e);
            client.close();
            return [];
        }
    }
};

// Returns the number of games in the database.
const numGames = async () => {
    const client = await MongoClient.connect(url).catch(err => { console.log(err) });
    if (!client) {
        return [];
    } else {
        try {
            const db = client.db('recommenderDB');
            const collection = db.collection('allGameData');
            const res = await collection.estimatedDocumentCount();
            client.close();
            return res;
        } catch (e) {
            console.log(e);
            client.close();
            return [];
        }
    }
};

// Inverts a javascript object ({key: value} -> {value: key}).
const f = obj => Object.fromEntries(Object.entries(obj).map(a => a.reverse()))

// Maps genre ids to genre names.
const genreDict = { 0: 'Casual', 1: 'Strategy', 2: 'RPG', 3: 'Photo Editing', 4: 'Valve', 5: 'Sports', 6: 'Software Training', 7: 'Accounting', 8: 'Adventure', 9: 'Indie', 10: 'Audio Production', 11: 'Animation & Modeling', 12: 'Game Development', 13: 'Simulation', 14: 'Design & Illustration', 15: 'Education', 16: 'Utilities', 17: 'Movie', 18: 'Early Access', 19: 'Racing', 20: 'Action', 21: 'Web Publishing', 22: 'Video Production', 23: 'Free to Play', 24: 'Massively Multiplayer', 25: 'Simplified Chinese', 26: 'Ukrainian', 27: 'Dutch', 28: 'Norwegian', 29: 'Japanese', 30: 'Arabic', 31: 'Finnish', 32: 'Portuguese', 33: 'Turkish', 34: '#lang_#lang_#lang_english**#lang_full_audio*#lang_full_audio', 35: 'Hungarian', 36: 'Romanian', 37: 'Korean', 38: 'Traditional Chinese', 39: 'Greek', 40: '#lang_german;', 41: 'Vietnamese', 42: 'Portuguese - Brazil', 43: 'Russian', 44: '#lang_#lang_spanish*#lang_full_audio', 45: 'Polish', 46: 'Czech', 47: '(all with full audio support)', 48: 'English', 49: 'Danish', 50: 'Thai', 51: 'Italian', 52: 'Spanish - Spain', 53: 'Slovakian', 54: 'German', 55: 'Spanish - Latin America', 56: 'Swedish', 57: 'French', 58: 'Bulgarian' };

// Maps genre names to genre ids.
const genreDictRev = f(genreDict);

const getUser3GenresAndAge = (user) => {
    let top3Genres = [];
    for (let g of Object.keys(genreDict)) {
        top3Genres.push({
            genre: genreDict[g],
            val: user[genreDict[g]]
        });
    }

    top3Genres.sort((a, b) => b.val - a.val);
    top3Genres = [top3Genres[0].genre, top3Genres[1].genre, top3Genres[2].genre];

    return {
        uid: user.uid,
        age: user.age,
        genres: top3Genres.join(', ')
    };
};

// Inputs a user object and returns the 6 favourite genres of the user.
const getTop6Genres = (user) => {
    let top6Genres = [];
    for (let g of Object.keys(genreDict)) {
        top6Genres.push({
            genre: genreDict[g],
            val: user[genreDict[g]],
            id: g,
        });
    }

    top6Genres.sort((a, b) => b.val - a.val);
    // top6Genres = [top6Genres[0].genre, top6Genres[1].genre, top6Genres[2].genre, top6Genres[3].genre, top6Genres[4].genre, top6Genres[5].genre];
    return top6Genres;
}

// Inputs a list of user ids and returns users' 3 best genres and age.
const similarUserDetails = async (uids) => {
    const client = await MongoClient.connect(url).catch(err => { console.log(err) });
    if (!client) {
        return [];
    } else {
        try {
            const db = client.db('recommenderDB');
            const collection = db.collection('allUserData');
            const query = getMongoQuery(uids, 'uid');
            const res = await collection.find(query).toArray();
            client.close();
            const result = [];
            for (let i = 0; i < res.length; i++) {
                result.push(getUser3GenresAndAge(res[i]));
            }
            return result;
        } catch (e) {
            console.log(e);
            client.close();
            return [];
        }
    }
};

// Inputs a user id and returns user's details.
const userDetails = async (uid) => {
    const client = await MongoClient.connect(url).catch(err => { console.log(err) });
    if (!client) {
        return null;
    } else {
        try {
            const db = client.db('recommenderDB');
            const collection = db.collection('allUserData');
            const query = { uid: uid };
            const res = await collection.find(query).toArray();
            client.close();
            return res[0];
        } catch (e) {
            console.log(e);
            client.close();
            return null;
        }
    }
};

// Returns an array containing ids of the featured games.
const featuredGames = async () => {
    const client = await MongoClient.connect(url).catch(err => { console.log(err) });
    if (!client) {
        return [0, 0, 0, 0];
    } else {
        try {
            const db = client.db('sysDB');
            const collection = db.collection('featuredGames');
            const query = {};
            const res = await collection.findOne(query);
            client.close();
            return res.featuredGames;
        } catch (e) {
            console.log(e);
            client.close();
            return [0, 0, 0, 0];
        }
    }
};


// ---- Constants ----
const allGenres = [];
for (let gid of Object.keys(genreDict)) {
    allGenres.push({
        title: genreDict[gid],
        genre_id: gid
    });
}
const minUID = 0;

// ---- Recommender API functions ----
const baseURL = 'http://127.0.0.1:5000';
const getUserGameRecs = async (uid, k) => {
    const url = baseURL + '/user_game_rec';
    try {
        let res = await axios.get(url, {
            params: {
                uid: uid,
                k: k
            }
        });
        return res.data;
    } catch (e) {
        console.log(e);
    }
};
const getUserUserRecs = async (uid, k) => {
    const url = baseURL + '/user_user_rec';
    try {
        let res = await axios.get(url, {
            params: {
                uid: uid,
                k: k
            }
        });
        return res.data;
    } catch (e) {
        console.log(e);
    }
};
const getGameGameRecs = async (game_id, k) => {
    const url = baseURL + '/game_game_rec';
    try {
        let res = await axios.get(url, {
            params: {
                game_id: game_id,
                k: k
            }
        });
        return res.data;
    } catch (e) {
        console.log(e);
        return null;
    }
};
const getUserGameGenreRecs = async (uid, k, genres, merge_by_and) => {
    const url = baseURL + '/genre_game_rec';
    try {
        let res = await axios.get(url, {
            params: {
                uid: uid,
                k: k,
                genres: genres.join(','),
                merge_by_and: merge_by_and
            }
        });
        return res.data;
    } catch (e) {
        console.log(e);
    }
};


// ---- Express Plugins ----
app.set('view engine', 'ejs');
app.use(parser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// ---- Server Routes ----
app.get('/', async (req, res) => {

    let uid = cookieHandler.getUid(req.cookies);
    // const user = await userDetails(uid);
    // const top6genres = getTop6Genres(user);
    // const userGameRecs = (await getUserGameRecs(uid, 5)).recommendations;
    // const featuredGamesList = await featuredGames();

    let [user, userGameRecs, featuredGamesList] = await Promise.all([userDetails(uid), getUserGameRecs(uid, 5), featuredGames()]);
    userGameRecs = userGameRecs.recommendations;
    const top6genres = getTop6Genres(user);


    const featuredGamesData = sortGameData(featuredGamesList, await getGameData(featuredGamesList));
    const featuredGamesFeatures = sortGameData(featuredGamesList, await getGameFeatureData(featuredGamesList));
    const profileBasedGames = sortGameData(userGameRecs.profile_based, await getGameData(userGameRecs.profile_based));
    const similarUserBasedGames = sortGameData(userGameRecs.similar_user_based, await getGameData(userGameRecs.similar_user_based));
    const profileBasedGameFeatures = sortGameData(userGameRecs.profile_based, await getGameFeatureData(userGameRecs.profile_based));
    const similarUserBasedGameFeatures = sortGameData(userGameRecs.similar_user_based, await getGameFeatureData(userGameRecs.similar_user_based));

    // let [
    //     featuredGamesData, 
    //     featuredGamesFeatures, 
    //     profileBasedGames, 
    //     similarUserBasedGames,
    //     profileBasedGameFeatures,
    //     similarUserBasedGameFeatures
    // ] = await Promise.all([
    //     getGameData(featuredGamesList), 
    //     getGameFeatureData(featuredGamesList), 
    //     getGameData(userGameRecs.profile_based), 
    //     getGameData(userGameRecs.similar_user_based),
    //     getGameFeatureData(userGameRecs.profile_based),
    //     getGameFeatureData(userGameRecs.similar_user_based)
    // ]);
    // featuredGamesData = sortGameData(featuredGamesList, featuredGamesData);
    // featuredGamesFeatures = sortGameData(featuredGamesList, featuredGamesFeatures);
    // profileBasedGames = sortGameData(userGameRecs.profile_based, profileBasedGames);
    // similarUserBasedGames = sortGameData(userGameRecs.similar_user_based, similarUserBasedGames);
    // profileBasedGameFeatures = sortGameData(userGameRecs.profile_based, profileBasedGameFeatures);
    // similarUserBasedGameFeatures = sortGameData(userGameRecs.similar_user_based, similarUserBasedGameFeatures);

    const userRecs = [];
    for (let i = 0; i < profileBasedGames.length; i++) {
        const num = getRndInteger(1, 10);
        userRecs.push({
            id: profileBasedGames[i].id,
            img: `assets/images/post-${num}.jpg`,
            sqImg: `assets/images/post-${num}-sm.jpg`,
            title: profileBasedGames[i].name,
            price: profileBasedGameFeatures[i].price,
            desc: profileBasedGames[i].desc_snippet || 'No description available at the moment.',
            genre: (profileBasedGames[i].genre && profileBasedGames[i].genre.split(',')[0]) || ('Genre N/A'),
            rating: profileBasedGameFeatures[i].rating
        });
    }

    const otherUserBasedRecs = [];
    for (let i = 0; i < similarUserBasedGames.length; i++) {
        otherUserBasedRecs.push({
            id: similarUserBasedGames[i].id,
            img: `assets/images/product-${getRndInteger(1, 17)}-xs.jpg`,
            title: similarUserBasedGames[i].name,
            price: similarUserBasedGameFeatures[i].price,
            rating: similarUserBasedGameFeatures[i].rating,
        });
    }


    const fourFeaturedGames = [];
    for (let i = 0; i < featuredGamesData.length; i++) {
        const num = getRndInteger(1, 17);
        fourFeaturedGames.push({
            img: `assets/images/product-${num}-xs.jpg`,
            id: featuredGamesData[i].id,
            title: featuredGamesData[i].name,
            rating: featuredGamesFeatures[i].rating,
            price: featuredGamesFeatures[i].price
        });
    }

    res.render('index', {
        bestSeller: fourFeaturedGames,
        otherUserLikes: otherUserBasedRecs,
        genres: top6genres,
        userRecs: userRecs,
        allGenres: allGenres,
        maxUID: (await numUsers()) - 2,
        minUID: minUID,
    });
});

app.get('/store-product', async (req, res) => {
    const game_id = parseInt(req.query.game_id);
    const uid = cookieHandler.getUid(req.cookies);
    const similarUserRecs = (await getUserGameRecs(uid, 4)).recommendations.similar_user_based;
    const similarGameData = sortGameData(similarUserRecs, await getGameData(similarUserRecs));
    const similarGameFeatureData = sortGameData(similarUserRecs, await getGameFeatureData(similarUserRecs));
    otherUserLikes = [];
    for (let i = 0; i < similarGameData.length; i++) {
        otherUserLikes.push({
            title: similarGameData[i].name,
            rating: similarGameFeatureData[i].rating,
            price: similarGameFeatureData[i].price.toString(),
            id: similarGameData[i].id,
            img: `assets/images/product-${getRndInteger(1, 17)}-xs.jpg`
        });
    }
    if (game_id !== 0 && !game_id) {
        res.render('store-product', {
            genreCategories: allGenres.slice(0, 7),
            otherUserLikes: otherUserLikes,
            relatedProducts: [],
            mainProductDesc: {
                id: -1,
                name: 'No Game Found',
                platformSpecs: 'N/A',
                price: 'N/A',
                desc: 'N/A',
                tags: 'N/A',
                genres: 'N/A',
                release: 'N/A',
                matureContent: 'N/A',
                rating: 0
            },
            allGenres: allGenres,
            maxUID: (await numUsers()) - 2,
            minUID: minUID,
        });
    } else {
        const gameGameRecs = await getGameGameRecs(game_id, 4);
        if (!gameGameRecs) {
            res.redirect('/404');
            return;
        }
        const relatedRecs = (gameGameRecs).recommendations;
        const relatedGameData = sortGameData(relatedRecs, await getGameData(relatedRecs));
        const relatedGameFeatureData = sortGameData(relatedRecs, await getGameFeatureData(relatedRecs));
        const relatedProducts = [];
        for (let i = 0; i < relatedGameData.length; i++) {
            relatedProducts.push({
                img: `assets/images/product-${getRndInteger(1, 17)}-xs.jpg`,
                title: relatedGameData[i].name,
                rating: relatedGameFeatureData[i].rating,
                price: relatedGameFeatureData[i].price.toString(),
                id: relatedGameFeatureData[i].id
            });
        }

        const game_ids = [game_id];
        const gameData = sortGameData(game_ids, await getGameData(game_ids));
        const gameFeatures = (await getGameFeatureData([game_id]))[0];
        res.render('store-product', {
            genreCategories: allGenres.slice(0, 7),
            otherUserLikes: otherUserLikes,
            relatedProducts: relatedProducts,
            mainProductDesc: ((gameData.length >= 1) && {
                id: gameData[0].id,
                name: gameData[0].name,
                platformSpecs: gameData[0].recommended_requirements || 'N/A',
                price: parseFloat(gameFeatures.price).toFixed(2),
                desc: (gameData[0].game_description && gameData[0].game_description.slice(0, 500) + '...') || 'Description not available.',
                tags: (gameData[0].popular_tags && gameData[0].popular_tags.slice(0, 100) + '...') || '',
                genres: (gameData[0].genre && gameData[0].genre.slice(0, 100) + '...') || '',
                release: gameData[0].release_date_y,
                matureContent: (gameData[0].mature_content && gameData[0].mature_content.slice(0, 150) + '...') || 'Suitable for people aged 12 and over.',
                rating: 0 || gameFeatures.rating,
            }) || {
                id: -1,
                name: 'No Game Found',
                platformSpecs: 'N/A',
                price: 'N/A',
                desc: 'N/A',
                tags: 'N/A',
                genres: 'N/A',
                release: 'N/A',
                matureContent: 'N/A',
                rating: 0
            },
            allGenres: allGenres,
            maxUID: (await numUsers()) - 2,
            minUID: minUID,
        });
    }
});

app.get('/store', async (req, res) => {
    const uid = cookieHandler.getUid(req.cookies);
    const user = await userDetails(uid);
    const top6genres = getTop6Genres(user);
    const userGameRecs = (await getUserGameRecs(uid, 16)).recommendations;
    const featuredGamesList = await featuredGames();
    const featuredGamesData = sortGameData(featuredGamesList, await getGameData(featuredGamesList));
    const featuredGamesFeatures = sortGameData(featuredGamesList, await getGameFeatureData(featuredGamesList));
    const profileBasedGames = sortGameData(userGameRecs.profile_based, await getGameData(userGameRecs.profile_based));
    const similarUserBasedGames = sortGameData(userGameRecs.similar_user_based, await getGameData(userGameRecs.similar_user_based));
    const profileBasedGameFeatures = sortGameData(userGameRecs.profile_based, await getGameFeatureData(userGameRecs.profile_based));
    const similarUserBasedGameFeatures = sortGameData(userGameRecs.similar_user_based, await getGameFeatureData(userGameRecs.similar_user_based));

    const top10Recs = [];
    for (let i = 5; i < profileBasedGames.length; i++) {
        top10Recs.push({
            id: profileBasedGames[i].id,
            img: `assets/images/product-${getRndInteger(1, 17)}-xs.jpg`,
            title: profileBasedGames[i].name,
            price: profileBasedGameFeatures[i].price
        });
    }

    const mostPopularGames = [];
    for (let i = 0; i < Math.min(similarUserBasedGames.length, 6); i++) {
        mostPopularGames.push({
            id: similarUserBasedGames[i].id,
            img: `assets/images/product-${getRndInteger(1, 17)}-xs.jpg`,
            title: similarUserBasedGames[i].name,
            price: similarUserBasedGameFeatures[i].price,
            rating: similarUserBasedGameFeatures[i].rating
        });
    }

    const fourFeaturedGames = [];
    for (let i = 0; i < featuredGamesData.length; i++) {
        fourFeaturedGames.push({
            img: `assets/images/product-${getRndInteger(1, 17)}-md.jpg`,
            id: featuredGamesData[i].id,
            title: featuredGamesData[i].name,
            rating: featuredGamesFeatures[i].rating,
            desc: featuredGamesData[i].desc_snippet.slice(0, 150) + '...',
            price: featuredGamesFeatures[i].price
        });
    }

    res.render('store', {
        genre1: top6genres[0],
        genre2: top6genres[1],
        genre3: top6genres[2],
        featuredProduct1: {
            id: profileBasedGames[0].id,
            title: profileBasedGames[0].name
        },
        featuredProduct2: {
            id: profileBasedGames[1].id,
            title: profileBasedGames[1].name
        },
        semiFeaturedProduct1: {
            id: profileBasedGames[2].id,
            title: profileBasedGames[2].name
        },
        semiFeaturedProduct2: {
            id: profileBasedGames[3].id,
            title: profileBasedGames[3].name
        },
        semiFeaturedProduct3: {
            id: profileBasedGames[4].id,
            title: profileBasedGames[4].name
        },
        semiFeaturedProduct4: {
            id: profileBasedGames[5].id,
            title: profileBasedGames[5].name
        },
        top10Recs: top10Recs,
        fourFeaturedGames: fourFeaturedGames,
        mostPopularGames: mostPopularGames,
        allGenres: allGenres,
        maxUID: (await numUsers()) - 2,
        minUID: minUID,
    });
});

app.get('/store-catalog', async (req, res) => {

    let uid = cookieHandler.getUid(req.cookies);
    let [user, userGameRecs] = await Promise.all([userDetails(uid), getUserGameRecs(uid, 15)]);
    userGameRecs = userGameRecs.recommendations;
    const top6genres = getTop6Genres(user);

    const profileBasedGames = sortGameData(userGameRecs.profile_based, await getGameData(userGameRecs.profile_based));
    const similarUserBasedGames = sortGameData(userGameRecs.similar_user_based, await getGameData(userGameRecs.similar_user_based));
    const profileBasedGameFeatures = sortGameData(userGameRecs.profile_based, await getGameFeatureData(userGameRecs.profile_based));
    const similarUserBasedGameFeatures = sortGameData(userGameRecs.similar_user_based, await getGameFeatureData(userGameRecs.similar_user_based));

    const otherUserBasedRecs = [];
    for (let i = 0; i < Math.min(4, similarUserBasedGames.length); i++) {
        otherUserBasedRecs.push({
            id: similarUserBasedGames[i].id,
            img: `assets/images/product-${getRndInteger(1, 17)}-xs.jpg`,
            title: similarUserBasedGames[i].name,
            price: similarUserBasedGameFeatures[i].price,
            rating: similarUserBasedGameFeatures[i].rating,
        });
    }

    const userRecs = [];
    for (let i = 0; i < profileBasedGames.length; i++) {
        const num = getRndInteger(1, 10);
        userRecs.push({
            id: profileBasedGames[i].id,
            img: `assets/images/product-${num}-xs.jpg`,
            title: profileBasedGames[i].name,
            price: profileBasedGameFeatures[i].price,
            desc: profileBasedGames[i].desc_snippet || 'No description available at the moment.',
            genre: (profileBasedGames[i].genre && profileBasedGames[i].genre.split(',')[0]) || ('Genre N/A'),
            rating: profileBasedGameFeatures[i].rating
        });
    }

    res.render('store-catalog', {
        genre1: top6genres[0],
        genre2: top6genres[1],
        genre3: top6genres[2],
        otherUserLikes: otherUserBasedRecs,
        searchResults: userRecs,
        genreCategories: allGenres.slice(0, 7),
        allGenres: allGenres,
        maxUID: (await numUsers()) - 2,
        minUID: minUID,
    });
});

app.get('/search', async (req, res) => {

    let uid = cookieHandler.getUid(req.cookies);

    let queryGenres = req.query.genres;
    let queryMergeByAnd = req.query.merge_by_and;
    if (!queryMergeByAnd || queryMergeByAnd.toLowerCase() !== 'false') {
        queryMergeByAnd = 'true';
    }

    let regexGenreListCheck = /^(\d(\d)*,)*\d(\d*)$/;

    if (!queryGenres || !regexGenreListCheck.test(queryGenres)) {
        queryGenres = [];
    } else {
        queryGenres = queryGenres.trim().split(',');
    }

    let [user, userGameRecs, genreRecs] = await Promise.all([userDetails(uid), getUserGameRecs(uid, 4), getUserGameGenreRecs(uid, 15, queryGenres, queryMergeByAnd)]);
    userGameRecs = userGameRecs.recommendations;
    genreRecs = genreRecs.recommendations;
    const top6genres = getTop6Genres(user);

    const genreBasedGames = sortGameData(genreRecs, await getGameData(genreRecs));
    const genreBasedGameFeatures = sortGameData(genreRecs, await getGameFeatureData(genreRecs));
    const similarUserBasedGames = sortGameData(userGameRecs.similar_user_based, await getGameData(userGameRecs.similar_user_based));
    const similarUserBasedGameFeatures = sortGameData(userGameRecs.similar_user_based, await getGameFeatureData(userGameRecs.similar_user_based));

    const otherUserBasedRecs = [];
    for (let i = 0; i < Math.min(4, similarUserBasedGames.length); i++) {
        otherUserBasedRecs.push({
            id: similarUserBasedGames[i].id,
            img: `assets/images/product-${getRndInteger(1, 17)}-xs.jpg`,
            title: similarUserBasedGames[i].name,
            price: similarUserBasedGameFeatures[i].price,
            rating: similarUserBasedGameFeatures[i].rating,
        });
    }

    const userRecs = [];
    for (let i = 0; i < genreBasedGames.length; i++) {
        const num = getRndInteger(1, 10);
        userRecs.push({
            id: genreBasedGames[i].id,
            img: `assets/images/product-${num}-xs.jpg`,
            title: genreBasedGames[i].name,
            price: genreBasedGameFeatures[i].price,
            desc: genreBasedGames[i].desc_snippet || 'No description available at the moment.',
            genre: (genreBasedGames[i].genre && genreBasedGames[i].genre.split(',')[0]) || ('Genre N/A'),
            rating: genreBasedGameFeatures[i].rating
        });
    }

    res.render('store-catalog', {
        genre1: top6genres[0],
        genre2: top6genres[1],
        genre3: top6genres[2],
        otherUserLikes: otherUserBasedRecs,
        searchResults: userRecs,
        genreCategories: allGenres.slice(0, 7),
        allGenres: allGenres,
        maxUID: (await numUsers()) - 2,
        minUID: minUID,
    });
});

app.get('/store-cart', async (req, res) => {
    const uid = cookieHandler.getUid(req.cookies);

    if (uid === -1) {
        res.render('store-cart', {
            games: [],
            allGenres: allGenres,
            maxUID: (await numUsers()) - 2,
            minUID: minUID,
        });
    } else {
        const games = await getUserGameRecs(uid, 10);
        const gameList = games.recommendations.owned;
        const gameData = await getGameData(gameList);
        const gameDictList = [];
        for (let game of gameData) {
            gameDictList.push({
                img: `assets/images/product-${getRndInteger(1, 17)}-xs.jpg`,
                title: game.name,
                id: game.id,
                price: (game.discount_price && game.discount_price.slice(1)) || (game.original_price && game.original_price.slice(1)) || 'N/A'
            });
        }
        res.render('store-cart', {
            games: gameDictList,
            allGenres: allGenres,
            maxUID: (await numUsers()) - 2,
            minUID: minUID,
        });
    }
});

app.get('/similar-users', async (req, res) => {
    const uid = cookieHandler.getUid(req.cookies);
    if (uid === -1) {
        res.render('similar-users', {
            users: [],
            allGenres: allGenres,
            maxUID: (await numUsers()) - 2,
            minUID: minUID,
        });
    } else {
        const similarUsers = (await getUserUserRecs(uid, 5)).recommendations;
        const similarUsersDetails = await similarUserDetails(similarUsers);
        res.render('similar-users', {
            users: similarUsersDetails,
            allGenres: allGenres,
            maxUID: (await numUsers()) - 2,
            minUID: minUID,
        });
    }
});

app.get('/community-stats', async (req, res) => {
    res.render('community-stats', {
        gameCount: await numGames(),
        gamerCount: (await numUsers()),
        allGenres: allGenres,
        maxUID: (await numUsers()) - 2,
        minUID: minUID,
    });
});

//The 404 Route
app.get('/404', async (req, res) => {
    res.status(404).render('404', {
        maxUID: (await numUsers()) - 2,
        minUID: minUID,
    });
});

app.get('*', async (req, res) => {
    res.redirect('/404');
});

app.post('/activity-monitor', (req, res) => {
    try {
        let parsedData = JSON.parse(req.headers.body);
        axios.post('http://localhost:4000/store_user_actions', parsedData);
        res.send('Success');
    } catch (e) {
        res.send('Failure');
    }
});

// ---- Server Setup ----
app.listen(3000, () => {
    console.log("Server set up to listen on port 3000.");
});