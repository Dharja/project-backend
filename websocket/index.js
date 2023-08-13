const { io } = require('../app');
const ProductManager = require('../managers/productManager');
const path = require('path');
const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');

// Crea una instancia del ProductManager
const productManager = new ProductManager(productsFilePath);

function SocketManager(socket) {
    console.log(`User connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Escuchar evento para agregar un producto
    socket.on('addProduct', async (newProduct) => {
        try {
        // Agrega el nuevo producto usando el ProductManager
        const addedProduct = await productManager.addProduct(newProduct);

        if (addedProduct) {
            // Emitir evento a todos los clientes para actualizar la lista
            io.emit('updateProducts', addedProduct);
        } else {
            // Enviar un mensaje de error si no se pudo agregar el producto
            socket.emit('addError', 'No se pudo agregar el producto.');
        }
        } catch (error) {
        console.error('Error al agregar el producto:', error);
        socket.emit('addError', 'Error al agregar el producto.');
        }
    });

    // Escuchar evento para eliminar un producto
    socket.on('deleteProduct', async (productId) => {
        try {
        // Elimina el producto usando el ProductManager
        const isDeleted = await productManager.deleteProduct(productId);

        if (isDeleted) {
            // Emitir evento a todos los clientes para actualizar la lista
            io.emit('updateProducts', productId);
        } else {
            // Enviar un mensaje de error si no se pudo eliminar el producto
            socket.emit('deleteError', 'No se pudo eliminar el producto.');
        }
        } catch (error) {
        console.error('Error al eliminar el producto:', error);
        socket.emit('deleteError', 'Error al eliminar el producto.');
        }
    });
    }
//no estoy del todo segura si esta logica es correcta, siento que esta mal hecha


module.exports = SocketManager;