function SocketManager (socket) {
    console.log(`User conected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log('User desconected');
    });
}

module.exports = SocketManager;