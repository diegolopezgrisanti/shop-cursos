const express = require('express');
const router = express.Router();
const { OrderController } = require('../controllers');
const orderController = new OrderController();
const { check } = require('express-validator');

// router.get('/:id', orderController.detail); 

router.post('/checkout', orderController.checkout);
router.post('/pay', orderController.pay); 


module.exports = router;