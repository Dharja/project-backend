const { Router } = require('express');
const productManager = require('../managers/product.manager');
const { checkUserRole } = require('./authMiddleware');

const router = Router();


router.use((req, res, next) => {
  if(req.user?.role !== 'admin') {
    res.redirect('/');
    return;
  }

  next();
});

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


// Ruta protegida para usuarios
app.get('/ruta-para-usuarios', checkUserRole('user'), (req, res) => {
  res.json({ message: 'Ruta para usuarios' });
});

// Ruta protegida para administradores
app.get('/ruta-para-admin', isAdmin, (req, res) => {
  res.json({ message: 'Ruta solo para administradores' });
});


module.exports = router;