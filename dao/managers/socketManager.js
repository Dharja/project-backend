const SocketManager = require('./websocket');

io.on('connection', SocketManager);
