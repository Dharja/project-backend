const express = require('express');
const router = express.Router();
const faker = require('@faker-js/faker');

// Función para generar un código de usuario unico
function generateUniqueCode() {
    // Lógica para generar un código de usuario unico
    return faker.datatype.uuid();
}

// Función para generar usuarios ficticios
function generateUsers(count) {
    const users = [];

    for (let i = 0; i < count; i++) {
        const user = {
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            age: Math.floor(Math.random() * 50) + 18,
            address: `Address ${i + 1}`,
        };

        users.push(user);
    }
    return users;
}

// Función para generar productos ficticios
function generateProducts(count) {
    // Lógica para generar productos ficticios
    const products = [];

    for (let i = 0; i < count; i++) {
        const product = {
            name: `Product ${i + 1}`,
            price: Math.floor(Math.random() * 100) + 1,
            category: `Category ${i + 1}`,
        };

        products.push(product);
    }
    return products;
}

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
