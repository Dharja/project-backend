const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const ProductManager = require('../managers/productManager');

const productManager = new ProductManager('./data/products.json'); // instancia del manager de productos

// Ruta GET /api/products
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts(limit); // método del manager para obtener los productos

        res.json(products);
    } catch (error) {
        console.error('Error al obtener los productos', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId); // método del manager para obtener un producto por su ID

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            res.json(product);
        }
    } catch (error) {
        console.error('Error al obtener el producto', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Ruta POST /api/products
    router.post('/', async (req, res) => {
        try {
            const { title, description, code, price } = req.body;
            const newProduct = {
                id: generateProductId(),
                title,
                description,
                code,
                price
            };
    
            await productManager.addProduct(newProduct); // método del manager para agregar un nuevo producto
    
            res.status(201).json(newProduct);
        } catch (error) {
            console.error('Error al agregar el producto', error);
            res.status(500).json({ error: 'Error al agregar el producto' });
        }
    });
    
    // Función para generar un nuevo ID para el producto
    function generateProductId() {
        return Date.now().toString();
    }
    
module.exports = router;