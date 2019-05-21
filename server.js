const express = require('express');
const arrayFind = require('array-find');
const slug = require('slug');
const bodyParser = require('body-parser');
const getAge = require('get-age');
const multer = require('multer');

const upload = multer({dest: 'static/upload/'});

let profiles = [
    {
        id: 1,
        email: 'ricozethof@gmail.com',
        password: '123',
        name: 'Rico Zethof',
        gender: 'male',
        age: '16/09/2000',
        profile: {
            profileImg: 'upload/profile.jpg',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas rutrum, ex ut eleifend porta, mauris mi faucibus quam, vel tristique ipsum nisi nec elit. Etiam sed commodo ipsum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer posuere tristique porttitor.',
            wantGender: 'female',
            favoriteGames: ['biem','yeet','blam'],
        }
    },
    {
        id: 2,
        email: 'test@gmail.com',
        password: '123',
        name: '',
        gender: '',
        age: '',
        profile: {
            bio: '',
            wantGender: '',
            favoriteGames: ['','',''],
        }
    },
];

express()
    .use(express.static('static'))
    .use(bodyParser.urlencoded({extended:true}))
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
function createProfile(req, res) {
    let id = (profiles.slice(-1));
    id = id[0].id;
}
function addProfile(req, res) {
    res.redirect('/profile');
}
function profile(req, res) {
    let obj;
    obj = profiles.find(obj => obj.id == req.params.id);
    res.render('pages/profile.ejs', {title: `Profile of ${obj.name}`,obj : obj});
}
function findMatches(req, res) {
    res.render('pages/findMatches.ejs', {title: `Find your matches`});
}


function addUser(req, res) {
    let id = (profiles.slice(-1));
    id = id[0].id + 1;

    profiles.push({
        id: id,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        profile: {
            profileImg: req.file ? req.file.filename : null,
            bio: req.body.bio,
            wantGender: req.body.wantGender,
            favoriteGames: [req.body.games1, req.body.games2, req.body.games3],
        }
    });
    res.redirect(`/${id}`);
}

function notFound(req, res) {
    res.status(404).render('not-found.ejs', {title: 'Not-Found'}) ;
}
