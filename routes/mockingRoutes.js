const express = require('express');
const router = express.Router();

const { generateUsers, generateProducts } = require('./dataGenerationModule');

// Ruta para obtener datos ficticios de usuarios
router.get('/mockingusers', (req, res) => {
    const users = generateUsers(10); // Genera 10 usuarios ficticios
    res.json(users);
});

// Ruta para obtener datos ficticios de productos
router.get('/mockingproducts', (req, res) => {
    const products = generateProducts(10); // Genera 10 productos ficticios
    res.json(products);
});

module.exports = router;
