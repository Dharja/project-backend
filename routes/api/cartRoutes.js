const express = require('express');
const router = express.Router();
const path = require ("path"); 
const filePath = path.join(__dirname ,"..", "..", "data", "cart.json");
const CartManager = require('../../managers/cartManager');
const { render } = require('express-handlebars');

const cartManager = new CartManager(filePath);

// nuevo objeto Ticket
const newTicket = new Ticket({
    code: generateUniqueCode(),
    amount: totalAmount,
    purchaser: req.user.email,
    });

// Guardar el ticket en la base de datos
    await newTicket.save();


    const Cart = require('../../models/cartModel');
    const Ticket = require('../../models/ticket');
    
    
    // Ruta para finalizar la compra
    router.post('/:cid/purchase', async (req, res) => {
        try {
            const cartId = req.params.cid;
    
            const cart = await Cart.findById(cartId);
    
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
    
            const productsToPurchase = [];
            const productsWithoutStock = [];
    
            // Esto recorre los productos en el carrito y verifica el stock
            for (const product of cart.products) {
    
                if (product.hasEnoughStock) {
                    const purchasedProduct = { ...product, quantity: 1 }; // Se actualiza la cantidad según lo que se compró
                    productsToPurchase.push(purchasedProduct);
                } else {
                    // Si el producto no tiene suficiente stock, se agrega a la lista de productos sin stock
                    productsWithoutStock.push(product);
                }
            }
    
            const totalAmount = productsToPurchase.reduce((total, product) => {
                return total + product.price * product.quantity;
            }, 0);
    
            const newTicket = new Ticket({
                products: productsToPurchase,
                totalAmount,
            });
    
            const updatedCart = cart.products.filter((product) => !productsToPurchase.includes(product));
            cart.products = updatedCart;
    
            await cart.save();
            await newTicket.save();
    
            res.status(200).json({
                ticket: newTicket,
                productsWithoutStock,
            });
    
        } catch (error) {
            res.status(500).json({ error: 'Error al procesar la compra' });
        }
    });  


// Ruta GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId); // método del manager para obtener el cart

        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
        } else {
            res.render('cart', { cart });
        }
    } catch (error) {
        console.error('Error al obtener los productos del carrito', error);
        res.status(500).json({ error: 'Error al obtener los productos del carrito' });
    }
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        await cartManager.addProductToCart(cartId, productId); 

        const cart = await cartManager.getCartById(cartId); 
        console.log('soy cart', cart);

        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
        } else {
            res.status(200).json(cart.products);
        }
    } catch (error) {
        console.error('Error al agregar el producto al carrito', error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});


// Ruta POST /api/carts
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart(); // Método del manager para agregar un nuevo carrito

        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al agregar el carrito', error);
        res.status(500).json({ error: 'Error al agregar el carrito' });
    }
});

module.exports = router;
