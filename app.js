const express = require('express');
const http = require('http');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const path = require('path');
const User = require('./models/userModel');

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

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración de la estrategia de autenticación local
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    function(email, password, done) {
        User.findOne({ email: email }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Correo electrónico incorrecto.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Contraseña incorrecta.' });
            }
            return done(null, user);
        });
    }
));

// Configuración de la estrategia de autenticación de GitHub
passport.use(
    new GitHubStrategy(
        {
            clientID: 'tu_client_id',
            clientSecret: 'tu_client_secret',
            callbackURL: 'http://localhost:3000/auth/github/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ githubId: profile.id }, (err, existingUser) => {
                if (err) { return done(err); }
                if (existingUser) {
                    return done(null, existingUser);
                } else {
                    const newUser = new User({
                        githubId: profile.id,
                        displayName: profile.displayName,
                    });
                    newUser.save((err) => {
                        if (err) { return done(err); }
                        return done(null, newUser);
                    });
                }
            });
        }
    )
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
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
    .connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        http.createServer(app).listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

    app.post(
        '/login',
        passport.authenticate('local', {
          successRedirect: '/dashboard', // Redirige a la página de inicio después de iniciar sesión
          failureRedirect: '/login', // Redirige a la página de inicio de sesión en caso de fallo
        })
    );      