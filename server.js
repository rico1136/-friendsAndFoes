const express = require('express');
const arrayFind = require('array-find');
const slug = require('slug');
const bodyParser = require('body-parser');
const multer = require('multer');
const getAge = require('get-age')


let data = [
    {
        id: '1',
        title: '',
        description: 'Role players',
        members:'200',
        cover:'',
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
    .get('/profile', profile)
    .get('/add', form)
    .get('/:id', movie)
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
function profile(req, res) {
    res.render('pages/createProfile.ejs', {title: 'Profile'});
}

function addUser(req, res) {
    const name = req.body.na
    const age = getAge(req.body.age);
    let profilePicture;
    if (req.body.profilePicture){
        profilePicture = req.body.profilePicture;
    }else{
        profilePicture = '../assets/images/profile.jpg';
    }

    res.render('pages/createProfile.ejs', {title: `Profile of ${name}`, name: name, age: age, profilePicture : profilePicture});
}

function movie(req, res, next) {
    const id = req.params.id;
    let movie = arrayFind(data, (value) => value.id === id);
    if(!movie){
        next();
        return
    }
    res.render('detail.ejs', {data: movie});
}

function form(req, res) {
    res.render('addMovie.ejs')
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
