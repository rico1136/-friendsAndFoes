const express = require('express');
const arrayFind = require('array-find');
const slug = require('slug');
const bodyParser = require('body-parser');
const multer = require('multer');
const getAge = require('get-age');

let loggedIn = false;

let profiles = [
    {
        id: 1,
        email: 'ricozethof@gmail.com',
        password: '123',
        name: 'Rico Zethof',
        gender: 'male',
        age: '16/09/1996',
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
let upload = multer({dest: 'static/upload/'})

express()
    .use(express.static('static'))
    .use(bodyParser.urlencoded({extended:true}))
    .set('view engine', 'ejs')
    .set('views', 'view')
    .get('/', home)
    .get('/login', login)
    .get('/register', register)
    .post('/register', addUser)
    .get('/createProfile', createProfile)
    .post('/createProfile', addProfile)
    .get('/profile', profile)
    .get('/findMatches', findMatches)
    .delete('/:id', remove)
    .use(notFound)
    .listen(8000);

function genres(req, res) {
    res.render('list.ejs', {data: data});
}

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
    console.log(id);
}
function addProfile(req, res) {
    res.redirect('/profile');
}
function profile(req, res) {
    res.render('pages/profile.ejs', {title: `Profile of `});
}
function findMatches(req, res) {
    res.render('pages/findMatches.ejs', {title: `Find your matches`});
}


function addUser(req, res) {
    let id = (profiles.slice(-1));
    id = id[0].id + 1;
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const gender = req.body.gender;
    const age = req.body.age;

    profiles.push({
        id: id,
        email: email,
        password: password,
        name: name,
        gender: gender,
        age: age,
    });
    res.render('pages/createProfile.ejs', {title: `Profile of ${id}`});
}
function add(req,res) {
    const id = slug(req.body.title).toLowerCase();

    data.push({
        id: id,
        title: req.body.title,
        description: req.body.description,
        members: req.body.members,
        cover: req.file.filename,
    });

    res.redirect('/' + id)
}

function remove(req, res){
    const id = req.params.id;

    data = data.filter((value) => value.id !== id)
    res.json({status:'ok'})
}

function notFound(req, res) {
    res.status(404).render('not-found.ejs', {title: 'Not-Found'}) ;
}
