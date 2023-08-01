const {Router} = require('express');
const productRouter = require('./api/productsRoutes');
const cartsRouter = require('./api/cartRoutes');

const router = Router();

router.use('/products', productRouter);
router.use('/carts', cartsRouter);

module.exports = {
    api: router
}
