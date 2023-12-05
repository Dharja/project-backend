const express = require('express');
const router = express.Router();
const path = require("path");
const filePath = path.join(__dirname, "..", "..", "data", "products.json");
const ProductManager = require('../../managers/productManager');
const Product = require('../../models/productModel');
const { isAuth } = require('../middlewares/authMiddleware');

const productManager = new ProductManager(filePath);

// Ruta PUT /api/products/:pid
router.put('/:pid', isAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        if (req.user.role === 'admin' || (req.user.role === 'premium' && req.user.email === product.owner)) {
            const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
            return res.json(updatedProduct);
        } else {
            return res.status(403).json({ error: 'No tienes permiso para modificar este producto' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Hubo un error al modificar el producto' });
    }
});

// Ruta GET /api/products
router.get('/', async (req, res) => {
    try {
        const { search, max, min, limit, sort } = req.query;
        let products = await productManager.getProducts();

        // Filtros
        if (search) {
            products = products.filter(product =>
                product.keywords.includes(search.toLowerCase()) ||
                product.title.toLowerCase().includes(search.toLowerCase()) ||
                product.description.toLowerCase().includes(search.toLowerCase())
            );
        };

        if (min) {
            products = products.filter(product => product.price >= parseFloat(min));
        };

        if (max) {
            products = products.filter(product => product.price <= parseFloat(max));
        };

        // Ordenamientos
        if (sort === 'asc') {
            products.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            products.sort((a, b) => b.price - a.price);
        };

        // Paginación
        const pageNumber = parseInt(req.query.page) || 1;
        const itemsPerPage = parseInt(limit) || 10;
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const totalPages = Math.ceil(products.length / itemsPerPage);

        const paginatedProducts = products.slice(startIndex, endIndex);

        return res.json({
            status: 'success',
            payload: paginatedProducts,
            totalPages,
            prevPage: pageNumber > 1 ? pageNumber - 1 : null,
            nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
            page: pageNumber,
            hasPrevPage: pageNumber > 1,
            hasNextPage: pageNumber < totalPages,
            prevLink: pageNumber > 1 ? `/api/products?page=${pageNumber - 1}` : null,
            nextLink: pageNumber < totalPages ? `/api/products?page=${pageNumber + 1}` : null
        });
    } catch (error) {
        console.error('Error al obtener los productos', error);
        return res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta POST /api/products
router.post('/', async (req, res) => {
    try {
        const { body } = req;
        const product = await productManager.addProduct(body);

        if (product) {
            io.emit('addProduct', product); // Emitir evento de nuevo producto
            return res.status(200).json({ status: 200, message: 'product added successfully', product });
        } else {
            return res.status(400).json({ status: 404, message: 'failed to add the product' });
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'error processing the request' });
    }
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.deleteProduct(productId); // Método del manager para eliminar el producto
        if (!product) {
            return res.status(404).json({ status: 404, message: 'producto no encontrado' })
        } else {
            io.emit('deleteProduct', productId); // Emitir evento de producto eliminado
            return res.status(200).json({ message: 'Producto eliminado exitosamente' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto', error);
        return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

// Ruta PUT /api/products/:pid
router.put('/:pid', isAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        if (req.user.role === 'admin' || (req.user.role === 'premium' && req.user.email === product.owner)) {
            const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
            return res.json({ message: 'Producto modificado con éxito' });
        } else {
            // Otros usuarios no pueden modificar el producto
            return res.status(403).json({ error: 'No tienes permiso para modificar este producto' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Hubo un error al modificar el producto' });
    }
});

module.exports = router;