# Friends And Foes

A dating app for the ones seeking for a partner. For gamers it is hard to find someone who is equally into gaming cause they live inside most of the time. For them we developed this app.

![Wireframes](https://raw.githubusercontent.com/rico1136/-friendsAndFoes/master/Wiki/firstidea.PNG)

## Wiki

Follow the progress on the [wiki](https://github.com/rico1136/-friendsAndFoes/wiki).

# Interested? Clone the following on your terminal:

## Before you clone

* Install Node.js
* Install a Code Editor
* An CLI(Command Line Interface) like bash or iTerm

## Used (necessery sources)

* NPM
* EJS
* Express

* Use npm install to install all the packages at once

## Database model

```
email: req.body.email,
password: req.body.password,
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
```

## Installation

```
git clone https://github.com/rico1136/-friendsandfoes.git
```

Install used npm packages
```
npm install
```
Create an .ENV file
```
Touch .env
fill in the following:
DB_HOST=-the host of your database-
DB_NAME= -name of your database- 
SESSION_SECRET= -secure session cookies-
```
Run the application
```
npm run dev
```


## Our features
- Register
- Log-in
- Session
- Game-Api
- Matches based on category

## Usage
Start the application
```
npm run start
```
To run nodemon (nodemon will run server.js each time the file changes)
```
npm run dev
```
## Keep up to date
Make sure you pull the repository once in a while since we are still working on this project, you can do this by using ```git pull```

# License
[MIT](https://github.com/rico1136/-friendsandfoes/blob/master/LICENSE)
