const { Router } = require('express');
const { hashPassword, checkCredentials } = require('../managers/userManager');
const User = require('../models/userModel');
const { isAuthenticated, checkUserRole } = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
import { Request, Response } from 'express';

const router = Router();



// GET / debe obtener todos los usuarios, sólo debe devolver los datos principales como nombre, correo, tipo de cuenta (rol) y fecha de creación
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('name email role createdAt');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});


router.delete('/', async (req, res) => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 2);

        const { deletedCount } = await User.deleteMany({ lastConnection: { $lt: cutoffDate } });
        const deletedUsers = await User.find({ lastConnection: { $lt: cutoffDate } });
        if (deletedCount === 0) {
            return res.status(404).json({ message: 'ningun usuario eliminado' });
        }
        const emails = deletedUsers.map(async user => {
            try {
                await sendEmail(user.email, 'Account Deletion', 'Your account has been deleted due to inactivity');
            } catch (emailError) {
                console.error(`Error sending email to ${user.email}: ${emailError.message}`);
            }
        });

        // Wait for all emails to be sent
        await Promise.all(emails);

        res.json({ message: `Se eliminarion ${deletedCount} usuarios y se enviaron correos a ${deletedUsers.length} usuarios` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar usuarios', details: error.message });  
    }    
});



router.post('/:uid/documents', isAuthenticated, upload.array('documents'), async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }


        res.json({ message: 'Documentos subidos exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al subir documentos' });
    }
});

// Ruta para registrar un nuevo usuario
router.post('/signup', async (req, res) => {
    const { body } = req;

    try {
        const existingUser = await User.findOne({ username: body.username });

        if (existingUser) {
            return res.render('signup', { error: 'El usuario ya existe' });
        }

        const hashedPassword = await hashPassword(body.password);
        const newUser = new User({
            username: body.username,
            password: hashedPassword,
        });

        await newUser.save();

        // Redirige al usuario a la página de inicio
        res.redirect('/login');
    } catch (error) {
        // Manejo de errores
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { body } = req;

    try {
        const isValidUser = await checkCredentials(body.username, body.password);

        if (isValidUser) {
            req.session.user = body.username;
            res.redirect('/productos');
        } else {
            // Si las credenciales son incorrectas, muestra un mensaje de error
            res.render('login', { error: 'Credenciales incorrectas' });
        }
    } catch (error) {
        // Manejo de errores
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para cambiar el rol de un usuario
router.put('/users/premium/:uid', async (req, res) => {
    const userId = req.params.uid;
    const newRole = req.body.role; 

    try {
        const currentUser = req.user; 

        if (!currentUser.isAdmin) {
            return res.status(403).json({ error: 'No tienes permiso para cambiar roles.' });
        }

        // Actualiza el campo de rol del usuario en la base de datos con el nuevo rol.
        const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole });

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.json({ message: 'Rol de usuario actualizado con éxito.' });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ error: 'Error al cambiar el rol del usuario.' });
    }
});

// GET /api/users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, 'nombre correo tipoDeCuenta');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await userService.getAllUsers();

      // Filtrar la información que deseas devolver (nombre, correo, tipo de cuenta)
        const simplifiedUsers = users.map(user => ({
        name: user.name,
        email: user.email,
        accountType: user.role,
    }));

    res.json(simplifiedUsers);
        } catch (error) {
            console.error('Error al obtener usuarios', error);
            res.status(500).json({ error: 'Error interno del servidor' });
    }
});


module.exports = router;