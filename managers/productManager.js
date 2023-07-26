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

    async deleteProduct(id) {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            let products = JSON.parse(data);
            products = products.filter((product) => product.id !== id);
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf-8');
            return true; // Indicar que se eliminó correctamente
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            let products = JSON.parse(data);
            const index = products.findIndex((product) => product.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedProduct };
                await fs.writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf-8');
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }
}    


module.exports = ProductManager;
