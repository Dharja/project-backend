// Ruta para mostrar el formulario de restablecimiento de contraseña
router.get('/reset/:token', UserController.showResetPasswordForm);

// Ruta para procesar el restablecimiento de contraseña
router.post('/reset/:token', UserController.resetPassword);

exports.showResetPasswordForm = (req, res) => {
    User.findOne(
    {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
    },
    (err, user) => {
        if (!user) {
            req.flash('error', 'El enlace para restablecer la contraseña no es válido o ha caducado.');
            return res.redirect('/forgot-password');
        }
        res.render('reset-password', { token: req.params.token });
    }
    );
};

exports.resetPassword = (req, res) => {
    async.waterfall([
        (done) => {
        User.findOne(
            {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
            },
            (err, user) => {
            if (!user) {
                req.flash('error', 'El enlace para restablecer la contraseña no es válido o ha caducado.');
                return res.redirect('back');
            }
            if (req.body.newPassword === req.body.confirmPassword) {
                user.setPassword(req.body.newPassword, (err) => {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                user.save((err) => {
                    req.logIn(user, (err) => {
                    done(err, user);
                    });
                });
                });
            } else {
                req.flash('error', 'Las contraseñas no coinciden.');
                return res.redirect('back');
            }
            }
        );
    },
    (user, done) => {
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
            subject: 'Tu contraseña ha sido cambiada',
            text: `Hola,\n\n
            Esto es una confirmación de que la contraseña para la cuenta de ${user.email} ha sido cambiada.\n`,
        };

        transporter.sendMail(mailOptions, (err) => {
            req.flash('info', 'La contraseña ha sido restablecida.');
            done(err);
        });
        },
    ], (err) => {
        res.redirect('/');
    });
};