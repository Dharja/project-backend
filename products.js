const express = require('express');
const router = express.Router();

// Array de productos (simulación de base de datos)
let products = [];

// Ruta GET /api/products
// Lista todos los productos de la base. (Incluir limitación ?limit del desafío anterior)
router.get('/', (req, res) => {
    const limit = req.query.limit;
    let result = products;

    if (limit) {
        result = result.slice(0, limit);
    }

    res.json(result);
});

// Ruta GET /api/products/:pid
// Trae solo el producto con el id proporcionado
router.get('/:pid', (req, res) => {
const productId = req.params.pid;
const product = products.find((p) => p.id === productId);

if (!product) {
    res.status(404).json({ error: 'Producto no encontrado' });
} else {
    res.json(product);
}
});

// Ruta POST /api/products
// Agrega un nuevo producto con los campos especificados
router.post('/', async (req, res) => {
    try {
    const { title, description, code, price } = req.body;

    // Leer el archivo "productos.json" para obtener la lista de productos actual
    const productsData = await fs.readFile('productos.json', 'utf-8');
    const products = JSON.parse(productsData);

    // Generar un ID único para el nuevo producto
    const id = generateUniqueId(); // Función para generar el ID único

    // Crear el objeto del nuevo producto con los campos recibidos y el ID generado
    const newProduct = {
        id,
        title,
        description,
        code,
        price
    };

    // Agregar el nuevo producto a la lista
    products.push(newProduct);

    // Guardar los cambios en el archivo "productos.json"
    await fs.writeFile('productos.json', JSON.stringify(products, null, 2), 'utf-8');

    res.json(newProduct);
    } catch (error) {
        console.error('Error al agregar el nuevo producto', error);
        res.status(500).json({ error: 'Error al agregar el nuevo producto' });
    }
});

// Función para generar un nuevo ID para el producto
function generateProductId() {
    return Date.now().toString(); // Ejemplo sencillo de generación de ID basado en la marca de tiempo actual
}

module.exports = router;
