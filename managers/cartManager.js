    const fs = require('fs').promises;

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
        return cart || null;
        } catch (error) {
        console.error('Error reading carts file:', error);
        throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
        const data = await fs.readFile(this.filePath, 'utf-8');
        const carts = JSON.parse(data);
        const cart = carts.find((c) => c.id === cartId);
        if (cart) {
            const existingProduct = cart.products.find((p) => p.id === productId);
            if (existingProduct) {
            existingProduct.quantity++;
            } else {
            cart.products.push({ id: productId, quantity: 1 });
            }
            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2), 'utf-8');
        }
        } catch (error) {
        console.error('Error adding product to cart:', error);
        throw error;
        }
    }
    }

module.exports = CartManager;
