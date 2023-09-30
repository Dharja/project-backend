const express = require('express');
const router = express.Router();

// Ruta para mostrar la vista de inicio de sesión
router.get('/login', (req, res) => {
    res.render('login'); // Renderiza la vista de inicio de sesión
});

// Ruta para redirigir al usuario a la autenticación de GitHub
router.get('/auth/github', passport.authenticate('github'));

// Ruta de callback después de la autenticación de GitHub
router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {

        res.redirect('/profile');
    }
);

// Ruta para mostrar la vista de perfil (requiere autenticación)
router.get('/profile', ensureAuthenticated, (req, res) => {
    res.render('profile', { user: req.user }); 
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


const { checkUserRole } = require('./authMiddleware');

router.get('/admin', checkUserRole('admin'), (req, res) => {
    res.send('Bienvenido, administrador');
});


router.get('/user', checkUserRole('user'), (req, res) => {
    res.send('Bienvenido, usuario');
});


module.exports = router;
