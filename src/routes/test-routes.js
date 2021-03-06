// ************ Require's ************
const express = require('express');
const router = express.Router();
// ************ Controller Require ************
let { TestController } = require("../controllers");
const testController = new TestController();

router.get('/users', testController.users);
router.get('/courses', testController.courses);
router.get('/orders', testController.orders);

module.exports = router;