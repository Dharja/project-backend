const {Router} = require('express');
const productRouter = require('./routes/api/productsRoutes');
const cartsRouter = require('./routes/api/cartRoutes');

const router = Router();

router.use('/products', productRouter);
router.use('/carts', cartsRouter);

module.exports = {
    api: router
}
