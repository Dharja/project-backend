const fs = require('fs').promises;

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getProducts() {
        try {
        const data = await fs.readFile(this.filePath, 'utf-8');
        const products = JSON.parse(data);
        return products;
        } catch (error) {
        console.error('Error reading products file:', error);
        throw error;
        }
    }

    async getProductById(id) {
        try {
        const data = await fs.readFile(this.filePath, 'utf-8');
        const products = JSON.parse(data);
        const product = products.find((p) => p.id === id);
        return product || null;
        } catch (error) {
        console.error('Error reading products file:', error);
        throw error;
        }
    }

    async addProduct(product) {
        try {
        const data = await fs.readFile(this.filePath, 'utf-8');
        const products = JSON.parse(data);
        products.push(product);
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf-8');
        } catch (error) {
        console.error('Error adding product:', error);
        throw error;
        }
    }
}

module.exports = ProductManager;
