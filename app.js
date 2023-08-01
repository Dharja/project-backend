const express = require('express');
const http = require('http');
const app = express();
/* const handlebars = require('express-handlebars');
const { Server } = require('socket.io'); */
const PORT = 8080;
const { api, home } = require('./routes');
const path = require('path');
/* const SocketManager = require('./websocket');
const { usuarioAut } = require('./middlewares'); */

app.use(express.json());

// Configuración de Handlebars
/* app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars'); */

// Configuración de WebSocket
const server = http.createServer(app);
/* const io = new Server(server);
io.on('connection', SocketManager); */

app.use ('/api', api);

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});