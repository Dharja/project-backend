// userController.js
const User = require('../dao/models/userModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const async = require('async');

exports.showForgotPasswordForm = (req, res) => {
  res.render('forgot-password'); // Renderiza una vista con un formulario de solicitud
};

exports.sendPasswordResetEmail = (req, res, next) => {
async.waterfall([
    (done) => {
        crypto.randomBytes(20, (err, buf) => {
            const token = buf.toString('hex');
            done(err, token);
        });
    },
    (token, done) => {
        User.findOne({ email: req.body.email }, (err, user) => {
            if (!user) {
            req.flash('error', 'No existe una cuenta con ese correo electrónico.');
            return res.redirect('/forgot-password');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
        user.save((err) => {
            done(err, token, user);
        });
        });
    },
    (token, user, done) => {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
            user: 'tucorreo@gmail.com',
            pass: 'tucontraseña',
        },
        });

    const mailOptions = {
        to: user.email,
        from: 'tucorreo@gmail.com',
        subject: 'Restablecimiento de Contraseña',
        text: `Recibió este correo porque solicitó un restablecimiento de contraseña para su cuenta. \n\n
        Haga clic en el siguiente enlace o péguelo en su navegador para completar el proceso: \n\n
        http://${req.headers.host}/reset/${token} \n\n
        Si no solicitó esto, ignore este correo y su contraseña permanecerá sin cambios.`,
    };

    transporter.sendMail(mailOptions, (err) => {
        req.flash('info', `Se ha enviado un correo a ${user.email} con las instrucciones.`);
        done(err, 'done');
    });
    },
    ], (err) => {
        if (err) return next(err);
        res.redirect('/forgot-password');
    });
};

exports.uploadDocuments = async (req, res) => {
    // Lógica para manejar la subida de documentos
    try {
        const files = req.files;

        res.json({ message: 'Documentos subidos exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al subir los documentos' });
    }
};

exports.showResetPasswordForm = async (req, res) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            req.flash('error', 'El token ha expirado.');
            return res.redirect('/forgot-password');
        }
        res.render('reset-password', { token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al mostrar el formulario de restablecimiento de contraseña' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            req.flash('error', 'El token ha expirado.');
            return res.redirect('/forgot-password');
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        req.flash('info', 'La contraseña ha sido restablecida exitosamente.');
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al restablecer la contraseña' });
    }
};

const UserController = {};