const { Router } = require('express')
const manager = require('../../managers/user.manager')

const router = Router()

// Ruta para registrar un nuevo usuario
router.post('/signup', async (req, res) => {
    const { body } = req;

    try {
        const existingUser = users.find(user => user.username === body.username);
        if (existingUser) {
            return res.render('signup', { error: 'El usuario ya existe' });
        }

        const hashedPassword = await hashPassword(body.password);
        const newUser = {
            username: body.username,
            password: hashedPassword,
        };

        users.push(newUser);

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


module.exports = router;