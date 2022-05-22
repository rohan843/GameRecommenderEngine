require('dotenv').config();
const express = require('express');
const parser = require('body-parser');
import * as CookieHandler from "Utilities/cookieHandler.mjs";
import { allGenres } from "./Utilities/constants.mjs";

const app = express();

// ---- Database Related Work ----


// ---- Express Plugins ----
app.set('view engine', 'ejs');
app.use(parser.urlencoded({ extended: true }));
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
        allGenres: allGenres
    })
});

app.get('/store-product', (req, res) => {
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
            id: 0,
            name: 'JUST THEN HER HEAD',
            platformSpecs: 'Windows 10 or above.',
            price: '32.00',
            desc: 'With what mingled joy and sorrow do I take up the pen to write to my dearest friend! Oh, what a change between to-day and yesterday! Now I am friendless and alone; yesterday I was at home, in the sweet company of a sister, whom I shall ever, ever cherish! I was awakened at daybreak by the charwoman, and having arrived at the inn, was at first placed inside the coach. But, when we got to a place called Leakington. Now the races of these two have been for some ages utterly extinct.',
            tags: [ 'blizzard', 'action', 'MMO'].join(', '),
            genres: ['online', 'FPS', 'MMO', 'Action games'].join(', '),
            release: 2018,
            matureContent: 'Suitable for people aged 12 and over.',
            rating: 4,
        },
        allGenres: allGenres
    })
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
        allGenres: allGenres
    })
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
        allGenres: allGenres
    })
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
        allGenres: allGenres
    })
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
        allGenres: allGenres
    })
});

app.get('/community-stats', (req, res) => {
    res.render('community-stats', { 
        gameCount: 28256, 
        gamerCount: 50,
        allGenres: allGenres
    })
});

//The 404 Route
app.get('*', function (req, res) {
    res.status(404).render('404');
});

// ---- Server Setup ----
app.listen(3000, () => {
    console.log("Server set up to listen on port 3000.");
});