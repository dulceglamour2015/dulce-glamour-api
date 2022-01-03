const router = require('express').Router();
const ordersRouter = require('../orders/orders.controller');
const productsRouter = require('../products/controller');

router.use('/orders', ordersRouter);
router.use('/products', productsRouter);

module.exports = router;
