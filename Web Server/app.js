require('dotenv').config();
const express = require('express');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieHandler = require('./Utilities/cookieHandler.js');
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');


const app = express();

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
    return { '$or': list };
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

// Inputs a game id and returns its feature details.
const getGameFeatureData = async (game_id) => {
    const client = await MongoClient.connect(url).catch(err => { console.log(err) });
    if (!client) {
        return {};
    } else {
        try {
            const db = client.db('recommenderDB');
            const collection = db.collection('gameFeatures');
            const query = { id: game_id };
            const res = await collection.findOne(query);
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


// ---- Constants ----
const allGenres = [
    {
        title: 'Action',
        genre_id: 2
    },
    {
        title: 'Action',
        genre_id: 2
    },
    {
        title: 'Action',
        genre_id: 3
    },
    {
        title: 'Merge By OR',
        genre_id: -1
    },
];
const minUID = 0;

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

const getUserGameRecs = (uid, k) => {
    const url = baseURL + '/user_game_rec';
};
const getUserUserRecs = (uid, k) => {
    const url = baseURL + '/user_user_rec';
};
const getGameGameRecs = (game_id, k) => {
    const url = baseURL + '/game_game_rec';
};
const getUserGameGenreRecs = (uid, k, genres, merge_by_and) => {
    const url = baseURL + '/genre_game_rec';
};


// ---- Express Plugins ----
app.set('view engine', 'ejs');
app.use(parser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// ---- Server Routes ----
app.get('/', async (req, res) => {
    res.render('index', {
        bestSeller: [
            {
                title: "She gave my mother",
                rating: 3,
                price: '14.00'
            },
            {
                title: "She gave my mother",
                rating: 3,
                price: '14.00'
            },
            {
                title: "She gave my mother",
                rating: 3,
                price: '14.00'
            },
            {
                title: "She gave my mother",
                rating: 3,
                price: '14.00'
            }
        ],
        otherUserLikes: [
            {
                title: 'So saying he unbuckled',
                rating: 4,
                price: '23.00',
            },
            {
                title: 'So saying he unbuckled',
                rating: 4,
                price: '23.00',
            },
            {
                title: 'So saying he unbuckled',
                rating: 4,
                price: '23.00',
            },
            {
                title: 'So saying he unbuckled',
                rating: 4,
                price: '23.00',
            },
        ],
        latestPics: [
            {
                imgLink: 'assets/images/gallery-1.jpg',
                thumbnailLink: 'assets/images/gallery-1-thumb.jpg',
                imgSize: '1016x572',
                descHead: 'Called Let',
                desc: 'Divided thing, land it evening earth winged whose great after. Were grass night. To Air itself saw bring fly fowl. Fly years behold spirit day greater of wherein winged and form. Seed open don\'t thing midst created dry every greater divided of, be man is. Second Bring stars fourth gathering he hath face morning fill. Living so second darkness. Moveth were male. May creepeth. Be tree fourth.'
            },
            {
                imgLink: 'assets/images/gallery-1.jpg',
                thumbnailLink: 'assets/images/gallery-1-thumb.jpg',
                imgSize: '1016x572',
                descHead: 'Called Let',
                desc: 'Divided thing, land it evening earth winged whose great after. Were grass night. To Air itself saw bring fly fowl. Fly years behold spirit day greater of wherein winged and form. Seed open don\'t thing midst created dry every greater divided of, be man is. Second Bring stars fourth gathering he hath face morning fill. Living so second darkness. Moveth were male. May creepeth. Be tree fourth.'
            },
            {
                imgLink: 'assets/images/gallery-1.jpg',
                thumbnailLink: 'assets/images/gallery-1-thumb.jpg',
                imgSize: '1016x572',
                descHead: 'Called Let',
                desc: 'Divided thing, land it evening earth winged whose great after. Were grass night. To Air itself saw bring fly fowl. Fly years behold spirit day greater of wherein winged and form. Seed open don\'t thing midst created dry every greater divided of, be man is. Second Bring stars fourth gathering he hath face morning fill. Living so second darkness. Moveth were male. May creepeth. Be tree fourth.'
            },
            {
                imgLink: 'assets/images/gallery-1.jpg',
                thumbnailLink: 'assets/images/gallery-1-thumb.jpg',
                imgSize: '1016x572',
                descHead: 'Called Let',
                desc: 'Divided thing, land it evening earth winged whose great after. Were grass night. To Air itself saw bring fly fowl. Fly years behold spirit day greater of wherein winged and form. Seed open don\'t thing midst created dry every greater divided of, be man is. Second Bring stars fourth gathering he hath face morning fill. Living so second darkness. Moveth were male. May creepeth. Be tree fourth.'
            },
            {
                imgLink: 'assets/images/gallery-1.jpg',
                thumbnailLink: 'assets/images/gallery-1-thumb.jpg',
                imgSize: '1016x572',
                descHead: 'Called Let',
                desc: 'Divided thing, land it evening earth winged whose great after. Were grass night. To Air itself saw bring fly fowl. Fly years behold spirit day greater of wherein winged and form. Seed open don\'t thing midst created dry every greater divided of, be man is. Second Bring stars fourth gathering he hath face morning fill. Living so second darkness. Moveth were male. May creepeth. Be tree fourth.'
            }
        ],
        genres: [
            'Action',
            'MMO',
            'Strategy',
            'Adventure',
            'Racing',
            'Indie'
        ],
        genreData: {
            'Action': [
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-2-fw.jpg'
                },
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-4-mid-square.jpg'
                },
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-4-mid-square.jpg'
                }
            ],
            'MMO': [
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-2-fw.jpg'
                },
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-4-mid-square.jpg'
                },
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-4-mid-square.jpg'
                }
            ],
            'Strategy': [
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-2-fw.jpg'
                },
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-4-mid-square.jpg'
                },
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-4-mid-square.jpg'
                }
            ],
            'Adventure': [
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-2-fw.jpg'
                },
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-4-mid-square.jpg'
                },
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-4-mid-square.jpg'
                }
            ],
            'Racing': [
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-2-fw.jpg'
                },
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-4-mid-square.jpg'
                },
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-4-mid-square.jpg'
                }
            ],
            'Indie': [
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-2-fw.jpg'
                },
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-4-mid-square.jpg'
                },
                {
                    title: 'Grab your sword and fight the horde',
                    release: '2018',
                    reviews: 'Very Positive,(42,550),- 92% of the...',
                    desc: 'Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and...',
                    img: 'assets/images/post-4-mid-square.jpg'
                }
            ],
        },
        genre1: 'Action',
        genre2: 'MMO',
        genre3: 'Strategy',
        userRecs: [
            {
                title: 'SMELL MAGIC IN THE AIR. OR MAYBE BARBECUE',
                desc: 'With what mingled joy and sorrow do I take up the pen to write to my dearest friend! Oh, what a change between to-day and yesterday! Now I am friendless and alone...',
                shortDesc: 'With what mingled joy and sorrow do I take up the pen to w...',
                rating: 3,
                sqImg: 'assets/images/post-1-sm.jpg',
                img: 'assets/images/post-1.jpg',
                genre: 'MMO',
            },
            {
                title: 'SMELL MAGIC IN THE AIR. OR MAYBE BARBECUE',
                desc: 'With what mingled joy and sorrow do I take up the pen to write to my dearest friend! Oh, what a change between to-day and yesterday! Now I am friendless and alone...',
                shortDesc: 'With what mingled joy and sorrow do I take up the pen to w...',
                img: 'assets/images/post-1.jpg',
                sqImg: 'assets/images/post-1-sm.jpg',
                genre: 'MMO',
                rating: 3
            },
            {
                title: 'SMELL MAGIC IN THE AIR. OR MAYBE BARBECUE',
                desc: 'With what mingled joy and sorrow do I take up the pen to write to my dearest friend! Oh, what a change between to-day and yesterday! Now I am friendless and alone...',
                shortDesc: 'With what mingled joy and sorrow do I take up the pen to w...',
                genre: 'MMO',
                img: 'assets/images/post-1.jpg',
                sqImg: 'assets/images/post-1-sm.jpg',
                rating: 3
            },
            {
                title: 'SMELL MAGIC IN THE AIR. OR MAYBE BARBECUE',
                desc: 'With what mingled joy and sorrow do I take up the pen to write to my dearest friend! Oh, what a change between to-day and yesterday! Now I am friendless and alone...',
                genre: 'MMO',
                shortDesc: 'With what mingled joy and sorrow do I take up the pen to w...',
                img: 'assets/images/post-1.jpg',
                sqImg: 'assets/images/post-1-sm.jpg',
                rating: 3
            },
            {
                title: 'SMELL MAGIC IN THE AIR. OR MAYBE BARBECUE',
                genre: 'MMO',
                desc: 'With what mingled joy and sorrow do I take up the pen to write to my dearest friend! Oh, what a change between to-day and yesterday! Now I am friendless and alone...',
                shortDesc: 'With what mingled joy and sorrow do I take up the pen to w...',
                img: 'assets/images/post-1.jpg',
                sqImg: 'assets/images/post-1-sm.jpg',
                rating: 3
            },
            {
                title: 'SMELL MAGIC IN THE AIR. OR MAYBE BARBECUE',
                sqImg: 'assets/images/post-1-sm.jpg',
                desc: 'With what mingled joy and sorrow do I take up the pen to write to my dearest friend! Oh, what a change between to-day and yesterday! Now I am friendless and alone...',
                genre: 'MMO',
                shortDesc: 'With what mingled joy and sorrow do I take up the pen to w...',
                img: 'assets/images/post-1.jpg',
                rating: 3
            }
        ],
        allGenres: allGenres,
        maxUID: (await numUsers()) - 2,
        minUID: minUID,
    });
});

app.get('/store-product', async (req, res) => {
    const game_id = parseInt(req.query.game_id);
    const game_ids = [game_id];
    let gameData = sortGameData(game_ids, await getGameData(game_ids));
    let gameFeatures = await getGameFeatureData(game_id);
    res.render('store-product', {
        genreCategories: [
            {
                name: 'Action',
                genre_id: 1
            },
            {
                name: 'Action',
                genre_id: 1
            },
            {
                name: 'Action',
                genre_id: 1
            },
            {
                name: 'Action',
                genre_id: 1
            },
            {
                name: 'Action',
                genre_id: 1
            }
        ],
        otherUserLikes: [
            {
                title: 'So saying he unbuckled',
                rating: 4,
                price: '23.00',
            },
            {
                title: 'So saying he unbuckled',
                rating: 4,
                price: '23.00',
            },
            {
                title: 'So saying he unbuckled',
                rating: 4,
                price: '23.00',
            },
            {
                title: 'So saying he unbuckled',
                rating: 4,
                price: '23.00',
            },
        ],
        relatedProducts: [
            {
                img: 'assets/images/product-11-xs.jpg',
                title: 'She gave my mother',
                rating: 3,
                price: '24.00',
                id: 2
            },
            {
                img: 'assets/images/product-11-xs.jpg',
                title: 'She gave my mother',
                rating: 3,
                price: '24.00',
                id: 2
            },
            {
                img: 'assets/images/product-11-xs.jpg',
                title: 'She gave my mother',
                rating: 3,
                price: '24.00',
                id: 2
            }
        ],
        mainProductDesc: ((gameData.length >= 1) && {
            id: gameData[0].id,
            name: gameData[0].name,
            platformSpecs: gameData[0].recommended_requirements,
            price: (gameData[0].discount_price && gameData[0].discount_price.slice(1)) || (gameData[0].original_price && gameData[0].original_price.slice(1)) || parseFloat(gameFeatures.price).toFixed(2),
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
});

app.get('/store', async (req, res) => {
    res.render('store', {
        genre1: 'Action',
        genre2: 'MMO',
        genre3: 'Strategy',
        featuredProduct1: {
            id: 0,
            title: 'She was bouncing'
        },
        featuredProduct2: {
            id: 0,
            title: 'She was bouncing'
        },
        semiFeaturedProduct1: {
            id: 0,
            title: 'In all revolutions of'
        },
        semiFeaturedProduct2: {
            id: 0,
            title: 'In all revolutions of'
        },
        semiFeaturedProduct3: {
            id: 0,
            title: 'In all revolutions of'
        },
        semiFeaturedProduct4: {
            id: 0,
            title: 'In all revolutions of'
        },
        top10Recs: [
            {
                id: 0,
                img: 'assets/images/product-1-xs.jpg',
                title: 'So saying he unbuckled',
                price: '23.00'
            },
            {
                id: 0,
                img: 'assets/images/product-1-xs.jpg',
                title: 'So saying he unbuckled',
                price: '23.00'
            },
            {
                id: 0,
                img: 'assets/images/product-1-xs.jpg',
                title: 'So saying he unbuckled',
                price: '23.00'
            },
            {
                id: 0,
                img: 'assets/images/product-1-xs.jpg',
                title: 'So saying he unbuckled',
                price: '23.00'
            },
            {
                id: 0,
                img: 'assets/images/product-1-xs.jpg',
                title: 'So saying he unbuckled',
                price: '23.00'
            },
            {
                id: 0,
                img: 'assets/images/product-1-xs.jpg',
                title: 'So saying he unbuckled',
                price: '23.00'
            },
            {
                id: 0,
                img: 'assets/images/product-1-xs.jpg',
                title: 'So saying he unbuckled',
                price: '23.00'
            },
            {
                id: 0,
                img: 'assets/images/product-1-xs.jpg',
                title: 'So saying he unbuckled',
                price: '23.00'
            },
            {
                id: 0,
                img: 'assets/images/product-1-xs.jpg',
                title: 'So saying he unbuckled',
                price: '23.00'
            },
            {
                id: 0,
                img: 'assets/images/product-1-xs.jpg',
                title: 'So saying he unbuckled',
                price: '23.00'
            }
        ],
        fourFeaturedGames: [
            {
                img: 'assets/images/product-7-md.jpg',
                id: 0,
                title: 'With what mingled joy',
                rating: 3,
                desc: 'She clutched the matron by the arm, and forcing her into a chair by the bedside, was about to speak, when looking round, she caught sight of the two old women',
                price: '14.00'
            },
            {
                img: 'assets/images/product-7-md.jpg',
                id: 0,
                title: 'With what mingled joy',
                rating: 3,
                desc: 'She clutched the matron by the arm, and forcing her into a chair by the bedside, was about to speak, when looking round, she caught sight of the two old women',
                price: '14.00'
            },
            {
                img: 'assets/images/product-7-md.jpg',
                id: 0,
                title: 'With what mingled joy',
                rating: 3,
                desc: 'She clutched the matron by the arm, and forcing her into a chair by the bedside, was about to speak, when looking round, she caught sight of the two old women',
                price: '14.00'
            },
            {
                img: 'assets/images/product-7-md.jpg',
                id: 0,
                title: 'With what mingled joy',
                rating: 3,
                desc: 'She clutched the matron by the arm, and forcing her into a chair by the bedside, was about to speak, when looking round, she caught sight of the two old women',
                price: '14.00'
            }
        ],
        mostPopularGames: [
            {
                id: 0,
                img: 'assets/images/product-11-xs.jpg',
                title: 'She gave my mother',
                rating: 3,
                price: '14.00'
            },
            {
                id: 0,
                img: 'assets/images/product-11-xs.jpg',
                title: 'She gave my mother',
                rating: 3,
                price: '14.00'
            },
            {
                id: 0,
                img: 'assets/images/product-11-xs.jpg',
                title: 'She gave my mother',
                rating: 3,
                price: '14.00'
            },
            {
                id: 0,
                img: 'assets/images/product-11-xs.jpg',
                title: 'She gave my mother',
                rating: 3,
                price: '14.00'
            },
            {
                id: 0,
                img: 'assets/images/product-11-xs.jpg',
                title: 'She gave my mother',
                rating: 3,
                price: '14.00'
            },
            {
                id: 0,
                img: 'assets/images/product-11-xs.jpg',
                title: 'She gave my mother',
                rating: 3,
                price: '14.00'
            }
        ],
        allGenres: allGenres,
        maxUID: (await numUsers()) - 2,
        minUID: minUID,
    });
});

app.get('/store-catalog', async (req, res) => {
    res.render('store-catalog', {
        genre1: 'Action',
        genre2: 'MMO',
        genre3: 'Strategy',
        otherUserLikes: [
            {
                title: 'So saying he unbuckled',
                rating: 4,
                price: '23.00',
            },
            {
                title: 'So saying he unbuckled',
                rating: 4,
                price: '23.00',
            },
            {
                title: 'So saying he unbuckled',
                rating: 4,
                price: '23.00',
            },
            {
                title: 'So saying he unbuckled',
                rating: 4,
                price: '23.00',
            },
        ],
        searchResults: [
            {
                title: 'SO SAYING HE UNBUCKLED',
                rating: 4,
                price: '23.00',
                img: 'assets/images/product-1-xs.jpg',
                id: 0
            },
            {
                title: 'SO SAYING HE UNBUCKLED',
                rating: 4,
                price: '23.00',
                img: 'assets/images/product-1-xs.jpg',
                id: 0
            },
            {
                title: 'SO SAYING HE UNBUCKLED',
                rating: 4,
                price: '23.00',
                img: 'assets/images/product-1-xs.jpg',
                id: 0
            },
        ],
        genreCategories: [
            {
                name: 'Action',
                genre_id: 1
            },
            {
                name: 'Action',
                genre_id: 1
            },
            {
                name: 'Action',
                genre_id: 1
            },
            {
                name: 'Action',
                genre_id: 1
            },
            {
                name: 'Action',
                genre_id: 1
            }
        ],
        allGenres: allGenres,
        maxUID: (await numUsers()) - 2,
        minUID: minUID,
    });
});

app.get('/store-cart', async (req, res) => {
    res.render('store-cart', {
        games: [
            {
                title: 'HOWEVER, I HAVE REASON',
                id: 1,
                img: 'assets/images/product-2-xs.jpg',
                price: '32.00'
            },
            {
                title: 'HOWEVER, I HAVE REASON',
                id: 1,
                img: 'assets/images/product-2-xs.jpg',
                price: '32.00'
            },
            {
                title: 'HOWEVER, I HAVE REASON',
                id: 1,
                img: 'assets/images/product-2-xs.jpg',
                price: '32.00'
            },
            {
                title: 'HOWEVER, I HAVE REASON',
                id: 1,
                img: 'assets/images/product-2-xs.jpg',
                price: '32.00'
            },
            {
                title: 'HOWEVER, I HAVE REASON',
                id: 1,
                img: 'assets/images/product-2-xs.jpg',
                price: '32.00'
            },
        ],
        allGenres: allGenres,
        maxUID: (await numUsers()) - 2,
        minUID: minUID,
    });
});

app.get('/similar-users', async (req, res) => {
    res.render('similar-users', {
        users: [
            {
                id: 0,
                genres: ['Early Access', 'Japanese', 'Turkish'].join(', '),
                age: 32
            },
            {
                id: 0,
                genres: ['Early Access', 'Japanese', 'Turkish'].join(', '),
                age: 32
            },
            {
                id: 0,
                genres: ['Early Access', 'Japanese', 'Turkish'].join(', '),
                age: 32
            },
            {
                id: 0,
                genres: ['Early Access', 'Japanese', 'Turkish'].join(', '),
                age: 32
            }
        ],
        allGenres: allGenres,
        maxUID: (await numUsers()) - 2,
        minUID: minUID,
    });
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
app.get('*', async (req, res) => {
    res.status(404).render('404', {
        maxUID: (await numUsers()) - 2,
        minUID: minUID,
    });
});

// ---- Server Setup ----
app.listen(3000, () => {
    console.log("Server set up to listen on port 3000.");
});