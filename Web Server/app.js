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

app.get('/gallery', (req, res) => {
    res.render('gallery')
});

app.get('/store-product', (req, res) => {
    res.render('store-product')
});

app.get('/store', (req, res) => {
    res.render('store')
});

app.get('/store-catalog', (req, res) => {
    res.render('store-catalog')
});

app.get('/store-cart', (req, res) => {
    res.render('store-cart')
});

app.get('/similar-users', (req, res) => {
    res.render('similar-users')
});

app.get('/community-stats', (req, res) => {
    res.render('community-stats')
});

//The 404 Route
app.get('*', function (req, res) {
    res.status(404).render('404');
});

// ---- Server Setup ----
app.listen(3000, () => {
    console.log("Server set up to listen on port 3000.");
});