
const { Router } = require('express');
const productManager = require('../managers/product.manager');
const { checkUserRole } = require('./authMiddleware');

const router = Router();

// Middleware para verificar si un usuario es administrador
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); 
  } else {
    res.status(403).json({ error: 'Acceso solo para administradores' });
  }
}


router.get('/product/add', checkUserRole('admin'), async (req, res) => {
  res.render('admin/addProduct', 
  { 
    title: 'Agregar nuevo producto',
    style: 'admin'
  });
});

router.post('/product/add', checkUserRole('admin'), async (req, res) => {
  await productManager.create(req.body);
  
  res.redirect('/admin/product/add');
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
app.get('/ruta-para-usuarios', checkUserRole('user'), (req, res) => {
  res.json({ message: 'Ruta para usuarios' });
});

// Ruta protegida para administradores
app.get('/ruta-para-admin', isAdmin, (req, res) => {
  res.json({ message: 'Ruta solo para administradores' });
});


module.exports = router;