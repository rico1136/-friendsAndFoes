const express = require('express');
const arrayFind = require('array-find');
const arrayFilter = require('array-filter');
const bodyParser = require('body-parser');
const getAge = require('get-age');
const multer = require('multer');
const mongo = require('mongodb');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Json api call
const request = require("request");


// initialize db
require('dotenv').config();

let db = null;
let url = 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASSWORD+'@cluster0-l7jii.mongodb.net/test?retryWrites=true&w=majority';

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
    .get('/profile', redProfile)
    .get('/remove', removeView)
    .post('/remove', thanosMe)
    .get('/edit', editProfile)
    .post('/edit', edit)
    .use(notFound)
    .listen(process.env.PORT || 8000);

function home(req, res) {
    res.render('pages/home.ejs', {title: 'Home'});
}
function redProfile(req,res) {
    if (!req.session.user) {
        res.redirect('/login');
        return
    }
    res.redirect(`/${req.session.user.userID}`)
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
                return value.email == req.body.email
            });
            if(!profile){
                res.status(401).send('Password incorrect');
                return;
            }
            let salt = bcrypt.genSaltSync(saltRounds);
            let hash = bcrypt.hashSync(req.body.password, salt);
            if (bcrypt.compareSync(req.body.password, hash)){
                req.session.user = {userID: profile._id};
                res.redirect(`/${profile._id}`);
            }
        }
    }
}
function register(req, res) {
    const options = { method: 'POST',
        url: 'https://api-v3.igdb.com/genres',
        headers:
            { 'Postman-Token': '181a8b4d-3061-41d7-a6ba-105cb9bd5d07',
                'cache-control': 'no-cache',
                'user-key': 'fb8821b65e913424665c33e12d06ac9a' },
        body: 'fields name;limit 50;' };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let data = JSON.parse(body);
        res.render('pages/register.ejs', {title: 'Register', options: data});
    });
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
            res.render('pages/profile.ejs', {title: `Profile of ${profile.name}`,obj : profile, user: req.session.user});
        }
    }


}
function findMatches(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');
        return
    }
    db.collection('profile').find().toArray(done);
    function done(err, data){
        if (err) {
            next(err);
        } else {
            const matches = filterMatches(data);
            res.render('pages/findMatches.ejs', {title: `Find your matches`, matches : matches, allUsers : data , currentUser: req.session.user});
        }
    }

    function filterMatches(data) {
        const user = arrayFind(data, function (value) {
            return value._id == req.session.user.userID;
        });

        return arrayFilter(data, function (value) {
            return user.profile.wantGender === value.gender  && user.gender === value.profile.wantGender && (user.genre1 === value.genre1 || user.genre1 === value.genre2 || user.genre1 === value.genre3) || (user.genre2 === value.genre1 || user.genre2 === value.genre2 || user.genre2 === value.genre3) || (user.genre3 === value.genre1 || user.genre3 === value.genre2 || user.genre3 === value.genre3);
        });


    }
}
function editProfile(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');
        return
    }
    const options = { method: 'POST',
        url: 'https://api-v3.igdb.com/genres',
        headers:
            { 'Postman-Token': '181a8b4d-3061-41d7-a6ba-105cb9bd5d07',
                'cache-control': 'no-cache',
                'user-key': 'fb8821b65e913424665c33e12d06ac9a' },
        body: 'fields name;limit 50;' };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let data = JSON.parse(body);
        res.render('pages/edit.ejs', {title: 'Edit Profile', options: data});
    });
}

function edit(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');
        return
    }
    const myPlaintextPassword = req.body.password;
    let ObjectID = require('mongodb').ObjectID;
    bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
                // Store hash in your password DB.
                db.collection('profile').updateOne(
                    {_id : ObjectID(req.session.user.userID)},
                    {
                        $set:{
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            genre1: req.body.genre1,
                            genre2: req.body.genre2,
                            genre3: req.body.genre3,
                            profile: {
                                bio: req.body.bio,
                            }
                        }}, done);
            });
        }
    );
    function done(err) {
        if (err) {
            next(err);
        } else {
            res.redirect(`/${req.session.user.userID}`);
        }
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
        const myPlaintextPassword = req.body.password;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
                // Store hash in your password DB.
                db.collection('profile').insertOne({
                    email: req.body.email,
                    password: hash,
                    name: req.body.name,
                    gender: req.body.gender,
                    age: getAge(req.body.age),
                    genre1: req.body.genre1,
                    genre2: req.body.genre2,
                    genre3: req.body.genre3,
                    profile: {
                        profileImg: req.file ? req.file.filename : null,
                        bio: req.body.bio,
                        wantGender: req.body.wantGender,
                    }
                }, done);
            });
        });

    }

    function done(err, data, next) {
        if (err) {
            next(err);
        } else {
            req.session.user = {userID: data.insertedId};
            res.redirect(`/${data.insertedId}`);
        }
    }


}

function removeView(req, res) {
    if (!req.session.user) {
        res.redirect('/login');
        return
    }
    res.render('pages/remove', {title: 'Remove'});
}

function thanosMe(req, res) {
    if (!req.session.user) {
        res.redirect('/login');
        return
    }
    let ObjectID = require('mongodb').ObjectID;
    db.collection('profile').deleteOne(
        {
            _id : ObjectID(req.session.user.userID)
        },done
    );
    function done(err,next) {
        if (err) {
            next(err);
        } else {
            req.session.destroy();
            res.redirect(`/`);
        }
    }
}
function notFound(req, res) {
    res.status(404).render('not-found.ejs', {title: 'Not-Found'}) ;
}