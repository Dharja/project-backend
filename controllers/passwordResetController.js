const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User } = require('../models/userModel'); 

const router = express.Router();

// Configuración de la clave secreta y el transportador de correos
const secretKey = 'claveSecreta';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'tuCorreo@gmail.com',
        pass: 'tuContraseña',
    },
});

// Ruta para solicitar el restablecimiento de contraseña
router.post('/reset-password', async (req, res) => {
    try {
        const { email } = req.body;

    // Verificar si el correo electrónico existe en la base de datos
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ error: 'El correo electrónico no está registrado.' });
    }

    const token = generatePasswordResetToken();
    await savePasswordResetToken(user, token);

    // Se envía un correo electrónico al usuario con un enlace que contiene el token
    const resetLink = `https://tu-sitio-web.com/reset-password/${token}`;
    sendPasswordResetEmail(user.email, resetLink);

    res.json({ message: 'Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico.' });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ error: 'Error al solicitar el restablecimiento de contraseña.' });
    }
});


// Ruta para restablecer la contraseña con el token
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const tokenData = await getPasswordResetToken(token);

        if (!tokenData) {
        return res.status(400).json({ error: 'El enlace para restablecer la contraseña no es válido o ha expirado.' });
        }
        await updatePassword(tokenData.userId, password);
        await removePasswordResetToken(token);

        res.json({ message: 'La contraseña se ha restablecido con éxito.' });
    } catch (error) {
      // Manejo de errores
        res.status(500).json({ error: 'Error al restablecer la contraseña.' });
    }
});

module.exports = router;
