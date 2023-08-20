const express = require('express');
const http = require('http');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const { api, home } = require('./routes');
const path = require('path');

const SocketManager = require('./websocket');
/*  const { usuarioAut } = require('./middlewares'); */


// Conexión a la base de datos
(async () => {
    try{
        await mongoose.connect('mongodb://localhost:27017');

        const app = express ();
        const Server = http.createServer(app);
        const { Server } = require('socket.io');
        const io = new server(Server);

        app.engine('handlebars', handlebars.engine());
        app.set('views', path.join(__dirname, '/views')); // el setting 'views'
        app.set('view engine', 'handlebars'); 

        // Middleware para parsear el cuerpo de las solicitudes como JSON
        app.use(express.json());

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
    db.once('open', () => {
        console.log('Conexión exitosa a MongoDB');
    });

    app.use(express.json());


    // Configuración de WebSocket
    const server = http.createServer(app);
    io.on('connection', socketManager);

    app.use ('/api', api);

    // Iniciar el servidor
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });

        console.log('se ha conectado a la base de datos');
    }catch(e) {
        console.log('no se ha podido conectar a la base de datos');
        console.log(e);
    };
});