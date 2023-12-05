const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../dao/models/userModel');

// Ruta para mostrar el formulario de registro
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Ruta para procesar el registro
router.post('/signup', (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    const newUser = new User({ firstName, lastName, email, password });

    // Registrar al usuario en Passport.
    passport.authenticate('local-signup', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {

            return res.render('signup', { error: 'Error en el registro' });
        }

        // Iniciar sesión automáticamente después del registro.
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/dashboard');
        });
    })(req, res, next);
});

// Ruta para cerrar la sesión del usuario
router.get('/logout', (req, res) => {
    req.logout(); 
    res.redirect('/');
});

module.exports = router;

