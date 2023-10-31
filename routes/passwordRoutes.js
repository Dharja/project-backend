// passwordRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Ruta para mostrar el formulario de solicitud de restablecimiento de contraseña
router.get('/forgot-password', UserController.showForgotPasswordForm);

// Ruta para procesar la solicitud de restablecimiento de contraseña
router.post('/forgot-password', UserController.sendPasswordResetEmail);

// Ruta para mostrar el formulario de restablecimiento de contraseña
router.get('/reset/:token', UserController.showResetPasswordForm);

// Ruta para procesar el restablecimiento de contraseña
router.post('/reset/:token', UserController.resetPassword);

module.exports = router;
