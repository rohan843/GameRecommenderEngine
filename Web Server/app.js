require('dotenv').config();
const express = require('express');
const parser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// ---- Database Related Work ----

// ---- Express Plugins ----
app.set('view engine', 'ejs');
app.use(parser.urlencoded({ extended: true }));
app.use(express.static('public'))

// ---- Server Routes ----
app.get('/', (req, res) => {
    res.render('index')
});

// ---- Server Setup ----
app.listen(3000, () => {
    console.log("Server set up to listen on port 3000.");
});