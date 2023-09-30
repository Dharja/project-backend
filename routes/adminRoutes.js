const { Router } = require('express');
const productManager = require('../managers/product.manager');

const router = Router();


router.use((req, res, next) => {
  if(req.user?.role !== 'admin') {
    res.redirect('/');
    return;
  }

  next();
});

router.get('/product/add', async (req, res) => {
  res.render('admin/addProduct', 
  { 
    title: 'Agregar nuevo producto',
    style: 'admin'
  });
});

router.post('/product/add', async (req, res) => {
  await productManager.create(req.body);
  
  res.redirect('/admin/product/add');
});

const { checkUserRole } = require('./authMiddleware');

// Solo el administrador puede acceder
router.get('/admin', checkUserRole('admin'), (req, res) => {
  // solo se ejecutará si el usuario tiene el rol 'admin'
  res.send('Bienvenido, administrador');
});


router.get('/user', checkUserRole('user'), (req, res) => {
  // Esta ruta solo se ejecutará si el usuario tiene el rol 'user'
  res.send('Bienvenido, usuario');
});


module.exports = router;