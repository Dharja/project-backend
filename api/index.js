const express = require('express');
const app = express();
const productRoutes = require('./routes/productsRoutes');
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
}); 
