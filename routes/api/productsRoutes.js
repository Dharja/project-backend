const express = require('express');
const router = express.Router();
const path = require ("path"); 
const filePath = path.join(__dirname ,"..", "..", "data", "products.json");
const ProductManager = require('../../managers/productManager');
const { error } = require('console');
const { render } = require('express-handlebars');
const { gunzipSync } = require('zlib');

const productManager = new ProductManager(filePath);


router.get('/', async (req, res) => {
    try {
        const { search, max, min, limit, sort } = req.query;

        let products = await productManager.getProducts();

        // Filtros
        if (search) {
            products = products.filter(product =>
                product.keywords.includes(search.toLowerCase()) ||
                product.title.toLowerCase().includes(search.toLowerCase()) ||
                product.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (min) {
            products = products.filter(product => product.price >= parseFloat(min));
        }

        if (max) {
            products = products.filter(product => product.price <= parseFloat(max));
        }

        // Ordenamientos
        if (sort === 'asc') {
            products.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            products.sort((a, b) => b.price - a.price);
        }

        // Paginación
        const pageNumber = parseInt(req.query.page) || 1;
        const itemsPerPage = parseInt(limit) || 10;
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const totalPages = Math.ceil(products.length / itemsPerPage);

        const paginatedProducts = products.slice(startIndex, endIndex);

        res.json({
            status: 'success',
            payload: paginatedProducts,
            totalPages,
            prevPage: pageNumber > 1 ? pageNumber - 1 : null,
            nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
            page: pageNumber,
            hasPrevPage: pageNumber > 1,
            hasNextPage: pageNumber < totalPages,
            prevLink: pageNumber > 1 ? `/api/products?page=${pageNumber - 1}` : null,
            nextLink: pageNumber < totalPages ? `/api/products?page=${pageNumber + 1}` : null
        });
    } catch (error) {
        console.error('Error al obtener los productos', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});


// Ruta GET /productos
router.get('/productos', (req, res) => {
    // Obtener el usuario de la sesión
    const user = req.session.user;

    // Obtener el rol del usuario (puedes implementar esto según tus necesidades)
    const role = user === 'adminCoder@coder.com' ? 'admin' : 'usuario';

    // Renderizar la vista de productos y pasar los datos del usuario y el rol
    res.render('productos', { user, role });
});


// Ruta GET /api/products
router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId); // método del manager para obtener un producto por su ID

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            res.render('product', { product }); // Renderizar la vista "product" y pasar los datos del producto
        }
    } catch (error) {
        console.error('Error al obtener el producto', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
}); 

// Ruta GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId); // método del manager para obtener un producto por su ID

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            res.json(product);
        }
    } catch (error) {
        console.error('Error al obtener el producto', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Ruta POST /api/products
    router.post('/', async (req, res) => {
        try {
            const { body } = req;
            const product = await productManager.addProduct(body);

            if (product) {
                io.emit('addProduct', product); // Emitir evento de nuevo producto
                return res.status(200).json({status: 200, message: 'product added succsesfully', product});
            }else{
                return res.status(400).json({status: 404, message: 'failed to add the product'});
            }
        }catch (error){
            res.status(500).json ({status: 500, message: 'error procesing the request'});
        }

/*          const {title, description, code, price, stock, id}  
            const newProduct = {
                id: generateProductId(),
                title,
                description,
                code,
                price
            }; 
     */
/*             await productManager.addProduct(newProduct); // método del manager para agregar un nuevo producto
    
            res.status(201).json(newProduct);
        catch (error) {
            console.error('Error al agregar el producto', error);
            res.status(500).json({ error: 'Error al agregar el producto' });
        }*/
    });

/* // Función para generar un nuevo ID para el producto
function generateProductId() {
    return Date.now().toString();
} */

// Ruta DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.deleteProduct(productId); // Método del manager para eliminar el producto
        if (!product){
            return res.status(404).json ({status: 404, message: 'producto no encontrado'})
        } else {
            io.emit('deleteProduct', productId); // Emitir evento de producto eliminado
            return res.status(200).json({ message: 'Producto eliminado exitosamente' });
        } 
    } catch (error) {
        console.error('Error al eliminar el producto', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

// Ruta PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedProduct = req.body;
        await productManager.updateProduct(productId, updatedProduct); // Método del manager para actualizar el producto
        res.status(200).json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el producto', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

module.exports = router;