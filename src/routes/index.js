const router = require('express').Router();
const ordersRouter = require('../orders/orders.controller');

router.use('/orders', ordersRouter);

module.exports = router;
