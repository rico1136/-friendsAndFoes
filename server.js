const express = require('express');
const arrayFind = require('array-find');
const bodyParser = require('body-parser');
const getAge = require('get-age');
const multer = require('multer');
const mongo = require('mongodb');
const session = require('express-session');

// Json api call
const request = require("request");


// initialize db
require('dotenv').config();

let db = null;
let url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT;

mongo.MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    db = client.db(process.env.DB_NAME)
});


const upload = multer({dest: 'static/upload/'});

express()
    .use(express.static('static'))
    .use(bodyParser.urlencoded({extended:true}))
    .use(session({
        resave:false,
        saveUninitialized:true,
        secret: process.env.SESSION_SECRET
    }))
    .set('view engine', 'ejs')
    .set('views', 'view')
    .get('/', home)
    .get('/login', login)
    .post('/login', tryLogin)
    .get('/register', register)
    .post('/register', upload.single('profilePicture'), addUser)
    .get(`/:id`, profile)
    .get('/findMatches', findMatches)
    .use(notFound)
    .listen(8000);

function home(req, res) {
    res.render('pages/home.ejs', {title: 'Home'});
}
function login(req, res) {
    res.render('pages/login.ejs', {title: 'Login'});
}
function tryLogin(req, res) {
    db.collection('profile').find().toArray(done);
    function done(err, data, next){
        if (err) {
            next(err);
        } else {
            let profile = arrayFind(data, function (value) {
                return value.email == req.body.email && value.password == req.body.password
            });
            if(!profile){
                res.status(401).send('Password incorrect');
                return;
            }
            req.session.user = {userID: profile._id};
            res.redirect(`/${profile._id}`);
        }
    }
}
function register(req, res) {
    res.render('pages/register.ejs', {title: 'Register'});
}
function profile(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');
        return
    }
    db.collection('profile').find().toArray(done)

    function done(err, data){
        if (err) {
            next(err)
        } else {
            let id = req.params.id;
            let profile = arrayFind(data, function (value) {
                return value._id == id
            });
            if(!profile){
                next();
                return
            }
            res.render('pages/profile.ejs', {title: `Profile of ${profile.name}`,obj : profile});
        }
    }


}
function findMatches(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');
        return
    }
    let bestMatch;
    let mediumMatch;
    let noMatch;
    db.collection('profile').find().toArray(done);
    function done(err, data){
        if (err) {
            next(err);
        } else {
            filterMatches(data);
            res.render('pages/findMatches.ejs', {title: `Find your matches`,bestMatch : bestMatch, mediumMatch : mediumMatch, noMatch:noMatch, profiles : data, user: req.session.user});
        }
    }

    function filterMatches(data) {

    }
}


function addUser(req, res, next) {
    db.collection('profile').find().toArray(getEmails);
    function getEmails(err, data){
        let emails = arrayFind(data, function (value) {
            return value.email == req.body.email
        });
        if(emails){
            res.status(401).send('Email already in use');
            return
        }
        db.collection('profile').insertOne({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            gender: req.body.gender,
            age: getAge(req.body.age),
            profile: {
                profileImg: req.file ? req.file.filename : null,
                bio: req.body.bio,
                wantGender: req.body.wantGender,
                favoriteGames: [req.body.games1, req.body.games2, req.body.games3],
            }
        }, done);
    }

    function done(err, data, next) {
        if (err) {
            next(err);
        } else {
            req.session.user = {userID: profile._id};
            res.redirect(`/${data.insertedId}`);
        }
    }


}

function notFound(req, res) {
    res.status(404).render('not-found.ejs', {title: 'Not-Found'}) ;
}


const options = { method: 'POST',
    url: 'https://api-v3.igdb.com/games',
    headers:
        { 'Postman-Token': '181a8b4d-3061-41d7-a6ba-105cb9bd5d07',
            'cache-control': 'no-cache',
            'user-key': 'fb8821b65e913424665c33e12d06ac9a' },
    body: 'fields name,popularity; sort popularity desc;\n' };

request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
});