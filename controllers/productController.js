const express = require('express');
const jwt = require('jsonwebtoken');
const Product = require('../models/productModel');

const router = express.Router();

// Maneja la creación de un nuevo producto
exports.createProduct = (req, res) => {
    // Verificación de roles - Asegúrate de que el usuario tenga el rol "premium" para crear productos
    if (req.user.role !== 'premium') {
        return res.status(403).json({ error: 'No tienes permiso para crear productos' });
    }

    // Recopila los datos del producto desde el cuerpo de la solicitud
    const { name, description, price, category } = req.body;

  // Validación de datos (puedes agregar validaciones personalizadas aquí)

    // Crea un nuevo producto
    const newProduct = new Product({
        name,
        description,
        price,
        category,
        // Agrega otros campos según sea necesario
    });

    // Guarda el producto en la base de datos
    newProduct.save()
    .then(product => {
        // Producto creado con éxito
        res.status(201).json(product);
    })
    .catch(error => {
      // Manejo de errores si la creación del producto falla
        res.status(500).json({ error: 'Error al crear el producto' });
    });
};
