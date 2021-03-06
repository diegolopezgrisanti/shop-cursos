const express = require("express");
let router = express.Router();
let { MainController } = require("../controllers");
const mainController = new MainController();
let { ProductController } = require("../controllers");
const productController = new ProductController();

// Ruta Raíz / ➝ Home
router.get("/", mainController.home);

router.get("/search", productController.search);

module.exports = router;
