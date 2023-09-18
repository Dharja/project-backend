const express = require('express');
const http = require('http');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const path = require('path');
const { findUserById, saveUserToDatabase } = require('./userFunctions');

const PORT = process.env.PORT || 3000;


const app = express();


app.engine('handlebars', handlebars());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');


app.use(express.json());


app.use(
    session({
        secret: 'secreto',
        resave: true,
        saveUninitialized: true,
    })
);

// Inicilizar Passport
app.use(passport.initialize());
app.use(passport.session());


passport.use(
    new GitHubStrategy(
        {
        clientID: 'tu_client_id',
        clientSecret: 'tu_client_secret', 
        callbackURL: 'http://localhost:3000/auth/github/callback',
        },
        (accessToken, refreshToken, profile, done) => {
        const existingUser = findUserById(profile.id);

        if (existingUser) {

            return done(null, existingUser);
        } else {

            const newUser = {
            id: profile.id,
            displayName: profile.displayName,
            };

        saveUserToDatabase(newUser);
        return done(null, newUser);
        }
    }
    )
);


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/auth/github', passport.authenticate('github'));

app.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {

    res.redirect('/profile');
    }
);

app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {

        res.render('profile', { user: req.user });
    } else {
        res.redirect('/login');
    }
    });

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

mongoose
    .connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        http.createServer(app).listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });


    app.listen (port, () => {
        console.log(`Server escuchando en el puerto ${port}`);
    });