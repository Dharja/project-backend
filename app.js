const express = require ('express');
const fs = require ('fs').promises;

const app = express();
const PORT = 8080;

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Rutas para el manejo de productos
app.get('/api/products', async (req, res) => {
    try {
        const limit = req.query.limit; // Obtener el parámetro de límite de resultados

        const data = await fs.readFile('productos.json', 'utf-8');
        const products = JSON.parse(data);

        if (limit) {
        const limitedProducts = products.slice(0, limit);
        res.json(limitedProducts);
        } else {
        res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

app.get('/api/products/:pid', async (req, res) => {
try {
    const productId = req.params.pid;

    const data = await fs.readFile('productos.json', 'utf-8');
    const products = JSON.parse(data);
    const product = products.find((p) => p.id === productId);

        if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        } else {
        res.json(product);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
    });

app.post('/api/products', async (req, res) => {
try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    const data = await fs.readFile('productos.json', 'utf-8');
    const products = JSON.parse(data);

    const newProduct = {
        id: generateId(), // Función para generar un nuevo id único
        title,
        description,
        code,
        price,
        status: status || true,
        stock,
        category,
        thumbnails,
    };

    products.push(newProduct);

    await fs.writeFile('productos.json', JSON.stringify(products, null, 2), 'utf-8');

    res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

// Rutas para el manejo de carritos
app.get('/api/carts/:cid', async (req, res) => {
try {
    const cartId = req.params.cid;

    const data = await fs.readFile('carrito.json', 'utf-8');
    const carts = JSON.parse(data);
    const cart = carts.find((c) => c.id === cartId);

    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      res.json(cart.products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const data = await fs.readFile('carrito.json', 'utf-8');
    const carts = JSON.parse(data);
    const cart = carts.find((c) => c.id === cartId);

    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      const existingProduct = cart.products.find((p) => p.product === productId);

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2), 'utf-8');

      res.status(200).json(cart.products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

// Función para generar un nuevo id único
function generateId() {
  // Lógica para generar el id
}

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
