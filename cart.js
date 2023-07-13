const express = require('express');
const fs = require('fs').promises;
const router = express.Router();

// Ruta GET /api/carts/:cid
// Lista los productos que pertenecen al carrito con el parámetro cid proporcionado
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    // Leer el archivo "carrito.json" para obtener el carrito correspondiente al cid
    const cartData = await fs.readFile('carrito.json', 'utf-8');
    const carts = JSON.parse(cartData);
    const cart = carts.find((cart) => cart.id === cid);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Obtener los productos del carrito
    const products = cart.products;

    res.json(products);
} catch (error) {
    console.error('Error al obtener los productos del carrito', error);
    res.status(500).json({ error: 'Error al obtener los productos del carrito' });
}
});

// Ruta POST /api/carts/:cid/product/:pid
// Agrega un producto al carrito seleccionado, siguiendo el formato especificado
router.post('/:cid/product/:pid', async (req, res) => {
try {
    const { cid, pid } = req.params;

    // Leer el archivo "carrito.json" para obtener el carrito correspondiente al cid
    const cartData = await fs.readFile('carrito.json', 'utf-8');
    const carts = JSON.parse(cartData);
    const cart = carts.find((cart) => cart.id === cid);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Verificar si el producto ya existe en el carrito
    const existingProduct = cart.products.find((product) => product.id === pid);

    if (existingProduct) {
      // Si el producto ya existe, incrementar su cantidad en 1
    existingProduct.quantity++;
    } else {
      // Si el producto no existe, agregarlo al carrito con cantidad 1
    cart.products.push({ id: pid, quantity: 1 });
    }

    // Guardar los cambios en el archivo "carrito.json"
    await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2), 'utf-8');

    res.json({ message: 'Producto agregado al carrito exitosamente' });
} catch (error) {
    console.error('Error al agregar el producto al carrito', error);
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
}
});

module.exports = router;
