// passwordRoutes.js
const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');
const userController = require('../controllers/userController');
const resetPassword = require('../controllers/userController');
const showResetPasswordForm = require('../controllers/userController');
const passport = require('passport');

router.get('/forgot', passwordController.showForgotPasswordForm);
router.post('/forgot', passwordController.sendPasswordResetEmail);
router.get('/reset/:token', passwordController.showResetPasswordForm);
router.post('/reset/:token', passwordController.resetPassword);



module.exports = router;
