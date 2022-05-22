require('dotenv').config();
const express = require('express');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieHandler = require('./Utilities/cookieHandler.js');
const MongoClient = require('mongodb').MongoClient;


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
const minUID = 0
const maxUID = 49

const app = express();

// ---- Database Related Work ----
const url = "mongodb+srv://user1:PasswordMongoDB@cluster0.ilunp.mongodb.net/";

// ---- Express Plugins ----
app.set('view engine', 'ejs');
app.use(parser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// ---- Server Routes ----
app.get('/', (req, res) => {
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
        maxUID: maxUID,
        minUID: minUID,
    });
});

app.get('/store-product', (req, res) => {

    const game_id = 10;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const recommenderDB = db.db("recommenderDB");
        recommenderDB.collection("allGameData").findOne({id: game_id}, function (err, resultAlldata) {
            if (err) throw err;
            recommenderDB.collection("gameFeatures").findOne({id: game_id}, function (err, featureData) {
                if(err) throw err;
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
                    mainProductDesc: {
                        id: resultAlldata.id,
                        name: resultAlldata.name,
                        platformSpecs: resultAlldata.recommended_requirements,
                        price: (resultAlldata.discount_price && resultAlldata.discount_price.slice(1)) || (resultAlldata.original_price && resultAlldata.original_price.slice(1)) || featureData.price,
                        desc: resultAlldata.game_description.slice(0, 500) + '...',
                        tags: (resultAlldata.popular_tags && resultAlldata.popular_tags.slice(0, 100) + '...') || '',
                        genres: (resultAlldata.genre && resultAlldata.genre.slice(0, 100) + '...') || '',
                        release: resultAlldata.release_date_y,
                        matureContent: (resultAlldata.mature_content && resultAlldata.mature_content.slice(0, 150) + '...') || 'Suitable for people aged 12 and over.',
                        rating: featureData.rating,
                    },
                    allGenres: allGenres,
                    maxUID: maxUID,
                    minUID: minUID,
                });
                db.close();
            });
        });
    });
});

app.get('/store', (req, res) => {
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
        maxUID: maxUID,
        minUID: minUID,
    });
});

app.get('/store-catalog', (req, res) => {
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
        maxUID: maxUID,
        minUID: minUID,
    });
});

app.get('/store-cart', (req, res) => {
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
        maxUID: maxUID,
        minUID: minUID,
    });
});

app.get('/similar-users', (req, res) => {
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
        maxUID: maxUID,
        minUID: minUID,
    });
});

app.get('/community-stats', (req, res) => {
    res.render('community-stats', {
        gameCount: 28256,
        gamerCount: 50,
        allGenres: allGenres,
        maxUID: maxUID,
        minUID: minUID,
    });
});

//The 404 Route
app.get('*', function (req, res) {
    res.status(404).render('404', {
        maxUID: maxUID,
        minUID: minUID,
    });
});

// ---- Server Setup ----
app.listen(3000, () => {
    console.log("Server set up to listen on port 3000.");
});