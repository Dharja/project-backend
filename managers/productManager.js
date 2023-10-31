const fs = require('fs').promises;
const productModel = require('../models/productModel');
const BaseManager = require('./baseManager');


// repository
class ProductManager extends BaseManager {
        constructor() {
        super(productModel);
        };
    
        getBySKU(sku) {
        return this.model.find({ sku }).lean();
        };
    
        // mas metodos
        getProductsInPriceRange(min, max) {
        return this.model.find(
            { $and: [
            { price: { $gte: min }},
            { price: { $lte: max} },
            ]
        });
    };
};


class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    };

    async getProducts() {
        try {
        const data = await fs.readFile(this.filePath, 'utf-8');
        const products = JSON.parse(data);
        return products;
        } catch (error) {
        console.error('Error reading products file:', error);
        throw error;
        };
    };

    async getProductById(id) {
        try {
        const data = await fs.readFile(this.filePath, 'utf-8');
        const products = JSON.parse(data);
        const product = products.find((p) => p.id === id);
        return product || null;
        } catch (error) {
        console.error('Error reading products file:', error);
        throw error;
        };
    };

    async addProduct(newProduct) {
        try{
        
        const data = await fs.readFile(this.filePath, 'utf-8');
        const products = JSON.parse(data);
    
        const newId = parseInt(products[products.length - 1]?.id) + 1 || 1;
        newProduct.id = newId.toString();
            const product = {
                status: true,
                ...newProduct,
            };
    
        products.push(product)

        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return newProduct;
        }

        catch(err){
            console.log ('ERROR -->', err);
            return null;
        }
    };
    

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
    };

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
        };
    };
};    


module.exports = ProductManager;