const express = require('express');
const app = express();
const PORT = 8080;
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/api/cartRoutes');

const {api} = require ('./routes')
app.use ('/api', api);

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

