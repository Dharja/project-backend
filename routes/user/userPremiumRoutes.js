const { Router } = require('express');
const User = require('../models/userModel');
const { isAuthenticated, checkUserRole } = require('../middlewares/authMiddleware');

const router = Router();

// Ruta para actualizar el rol de un usuario a "premium"
router.put('/:uid', isAuthenticated, checkUserRole('admin'), async (req, res) => {
    try {
        const userId = req.params.uid;

        // Buscar el usuario en la base de datos por su ID
        const user = await User.findById(userId);
    
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
    
        if (user.role === 'premium') {
            return res.status(400).json({ error: 'El usuario ya tiene rol premium' });
        }

        // Actualizar el rol del usuario a "premium"
        user.role = 'premium';
        await user.save(); // Se guardan los cambios en la base de datos

        res.json({ message: 'Rol actualizado a premium con éxito'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al actualizar el rol del usuario' });
    }
});

module.exports = router;
