const fs = require('fs').promises;
const path = require('path');
const productManager = require('../managers/productManager');

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getCarts() {
        try {
        const data = await fs.readFile(this.filePath, 'utf-8');
        const carts = JSON.parse(data);
        return carts;
        } catch (error) {
        console.error('Error reading carts file:', error);
        throw error;
        }
    }

    async getCartById(id) {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            const carts = JSON.parse(data);
            const cart = carts.find((c) => c.id === id);
            // Agregar una validación para el caso en que no se encuentre el carrito
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            console.error('Error reading carts file:', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            const carts = JSON.parse(data);
            let cart = carts.find((c) => c.id === cartId);
    
            if (!cart) {
                // Si el carrito no existe, crear uno nuevo y agregar el producto
                cart = { id: cartId, products: [] };
                carts.push(cart);
            }
    
            const existingProduct = cart.products.find((p) => p.id === productId);
    
            if (existingProduct) {
                // Si el producto ya existe en el carrito, incrementar su cantidad
                existingProduct.quantity++;
            } else {
                // Si el producto no existe en el carrito, agregarlo con cantidad 1
                cart.products.push({ id: productId, quantity: 1 });
            }
    
            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error adding product to cart:', error);
            throw error;
        }
    }
    

    async addCart() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            let carts = JSON.parse(data);
            let id = 1
            if (carts.length > 0){
                id = parseInt(carts [carts.length - 1].id) + 1;
            }
            const newCart = {
                id: id.toString(),
                products: []
            };
            carts.push(newCart);
            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2), 'utf-8');
            return newCart;
        } catch (error) {
            console.error('Error adding cart:', error);
            throw error;
        }
    }
}

module.exports = CartManager;
