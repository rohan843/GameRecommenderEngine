const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://user1:PasswordMongoDB@cluster0.ilunp.mongodb.net/";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const sysDB = db.db("sysDB");
    sysDB.collection("modelRefreshPasswords").findOne({}, function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
});

