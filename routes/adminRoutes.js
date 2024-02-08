
const { Router } = require('express');
const productManager = require('../dao/managers/productManager');
const { checkUserRole } = require('../middlewares/authMiddleware');

const router = Router();

// Middleware to check if a user is an admin
const isAdmin = (req, res, next) => {
  const { user } = req;
if (user && user.role === 'admin') {
    return next();
}
res.status(403).json({ error: 'Access only allowed for administrators' });
}


// Ruta protegida para administradores
router.get('/product/add', checkUserRole('admin'), async (req, res) => {
  try {
    await productManager.create(req.body);
    res.redirect('/admin/product/add');
  } catch (error) {
    res.status(500).render('error', { message: 'Error al agregar el producto' });
  }
});

router.post('/product/add', checkUserRole('admin'), async (req, res) => {
  try {
    await productManager.create(req.body);
    res.redirect('/admin/product/add');
  } catch (error) {
    res.status(500).render('error', { message: 'Error al agregar el producto' });
  }
});

// Ruta protegida para usuarios
router.get('/ruta-para-usuarios', checkUserRole('user'), (req, res) => {
  res.json({ message: 'Ruta para usuarios' });
});

// Ruta protegida para administradores
router.get('/ruta-para-admin', isAdmin, (req, res) => {
  res.json({ message: 'Ruta solo para administradores' });
});

module.exports = router;