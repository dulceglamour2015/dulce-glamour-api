const router = require('express').Router();
const ordersRouter = require('../services/orders/controller');
const productsRouter = require('../services/products/controller');

router.use('/orders', ordersRouter);
router.use('/products', productsRouter);

module.exports = router;
