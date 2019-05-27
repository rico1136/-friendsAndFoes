const express = require('express');
const arrayFind = require('array-find');
const bodyParser = require('body-parser');
const getAge = require('get-age');
const multer = require('multer');
const mongo = require('mongodb');
const session = require('express-session');

// initialize db
require('dotenv').config();

var db = null;
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT;

mongo.MongoClient.connect(url, function (err, client) {
    if (err) throw err
    db = client.db(process.env.DB_NAME)
});


const upload = multer({dest: 'static/upload/'});

let profiles = [

];

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
function register(req, res) {
    res.render('pages/register.ejs', {title: 'Register'});
}
function profile(req, res, next) {
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
function findMatches(req, res) {
    db.collection('profile').find().toArray(done)
    function done(err, data){
        if (err) {
            next(err)
        } else {
            res.render('pages/findMatches.ejs', {title: `Find your matches`, users : data});
        }
    }
}


function addUser(req, res) {
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


    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.redirect(`/${data.insertedId}`);
        }
    }


}

function notFound(req, res) {
    res.status(404).render('not-found.ejs', {title: 'Not-Found'}) ;
}
