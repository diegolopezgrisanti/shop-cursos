// ************ Require's ************
const express = require('express');
const router = express.Router();
const { check, validationResult, body } = require("express-validator");
const multer = require("multer");
const path = require("path");
const { AdminMiddleware } = require("../middlewares");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/public/images/products");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: storage });


// ************ Controller Require ************
let { ProductController } = require("../controllers");
const productController = new ProductController();

router.get('/', productController.index); /* GET - All products */
router.get('/detail/:productId/', productController.detail); /* GET - Product detail */

/*** CREATE ONE PRODUCT ***/ 
router.get('/create/', AdminMiddleware, productController.create); /* GET - Form to create */
router.post(
    '/create/', AdminMiddleware, 
    upload.any(), 
    [
        check("name")
            .isLength({ min: 10 })
            .withMessage("El título del curso no debe tener menos de 10 caracteres")
            .isLength({ max: 100 })
            .withMessage("Este campo no puede superar los 100 caracteres"),
        check("duration")
            .isInt({ min: 1, max: 99})
            .withMessage("La duracion del curso puede ser un valor de 1 a 99"),
        check("price")
            .isFloat({ min: 1, max: 100000})
            .withMessage("El precio del curso puede ser un valor de 1 a 100000"),
        check("discount")
            .isInt({ min: 0, max: 100})
            .withMessage("El descuento ofrecido en el curso puede ser un valor de 0 a 100"),
        check("description")
            .isLength({ min: 50 })
            .withMessage("La descripción del curso no debe contener menos de 50 caracteres")
            .isLength({ max: 2000 })
            .withMessage("Este campo no puede superar los 2000 caracteres")
    ],
    productController.store); /* POST - Store in DB */

/*** EDIT ONE PRODUCT ***/ 
router.get('/:productId/edit', AdminMiddleware, productController.edit); /* GET - Form to create */
router.put(
    '/:productId', AdminMiddleware, 
    upload.any(),
    [
        check("name")
            .isLength({ min: 10 })
            .withMessage("El título del curso no debe tener menos de 10 caracteres")
            .isLength({ max: 100 })
            .withMessage("Este campo no puede superar los 100 caracteres"),
        check("duration")
            .isInt({ min: 1, max: 99})
            .withMessage("La duracion del curso puede ser un valor de 1 a 99"),
        check("price")
            .isFloat({ min: 1, max: 100000})
            .withMessage("El precio del curso puede ser un valor de 1 a 100000"),
        check("discount")
            .isInt({ min: 0, max: 100})
            .withMessage("El descuento ofrecido en el curso puede ser un valor de 0 a 100"),
        check("description")
            .isLength({ min: 50 })
            .withMessage("La descripción del curso no debe contener menos de 50 caracteres")
            .isLength({ max: 2000 })
            .withMessage("Este campo no puede superar los 2000 caracteres")
    ], 
    productController.update); /* PUT - Update in DB */

/*** DELETE ONE PRODUCT***/ 
router.delete('/:productId', productController.destroy); /* DELETE - Delete from DB */

module.exports = router;
