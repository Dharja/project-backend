//Middleware de Protección de Rutas:
const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    if(req.user?.role !== 'admin') {
      res.redirect('/');
      return;
    }
  
    next();
  });