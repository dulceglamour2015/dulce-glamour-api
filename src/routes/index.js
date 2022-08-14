const router = require('express').Router();
const ordersRouter = require('../services/orders/controller');
const productsRouter = require('../services/products/controller');
const eordersController = require('../services/e-orders/controller');

router.use('/orders', ordersRouter);
router.use('/products', productsRouter);
router.use('/eorders', eordersController);

module.exports = router;
