const express = require('express');
const app = express();
const PORT = 8080;
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const ProductManager = require('./managers/productManager');
const CartManager = require('./managers/cartManager');

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Crear instancias de los managers
const productManager = new ProductManager('./data/products.json');
const cartManager = new CartManager('./data/carts.json');


// Rutas para el manejo de productos
app.get('/api/products', async (req, res) => {
  try {
      const limit = req.query.limit;
      const products = await productManager.getProducts();

      let result = products;

      if (limit) {
      result = result.slice(0, limit);
      }

      res.json(result);
  } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Rutas para el manejo de carritos
app.get('/api/carts/:cid', async (req, res) => {
  try {
      const cartId = req.params.cid;
      const cart = await cartManager.getCartById(cartId);

      if (!cart) {
          res.status(404).json({ error: 'Carrito no encontrado' });
      } else {
          res.json(cart.products);
      }
  } catch (error) {
      res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
