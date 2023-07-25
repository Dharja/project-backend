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


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
