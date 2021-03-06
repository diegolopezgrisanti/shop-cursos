const express = require("express");
let router = express.Router();
let { UserController } = require("../controllers");
const userController = new UserController();

let multer = require("multer");
let path = require("path");
let { check, validationResult, body } = require("express-validator");
const fs = require("fs");
const { AuthMiddleware, GuestMiddleware } = require("../middlewares");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/public/images/avatars");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

var upload = multer({ storage: storage });

router.get('/', userController.index); 

router.get("/register", GuestMiddleware, userController.register);

router.post(
    "/register",
    upload.any(),
    [
        check("name")
            .custom((value) => {
                let regex = /^[a-zA-Z ]+$/;
                return regex.test(value);
            })
            .withMessage('El nombre solo debe contener letras')
            .isLength({ min: 1 })
            .withMessage("Este campo no debe estar vacío")
            .isLength({ max: 100 })
            .withMessage("Este campo no puede superar los 100 caracteres"),
        check("lastname")
            .custom((value) => {
                let regex = /^[a-zA-Z ]+$/;
                return regex.test(value);
            })
            .withMessage('El apellido solo debe contener letras')
            .isLength({ min: 1 })
            .withMessage("Este campo no debe estar vacío")
            .isLength({ max: 100 })
            .withMessage("Este campo no puede superar los 100 caracteres"),
        check("email")
            .isEmail()
            .withMessage("El email que está ingresando no es válido")
            .isLength({ max: 100 })
            .withMessage("Este campo no puede superar los 100 caracteres"),
        check("password")
            .isLength({ min: 4 })
            .withMessage("La contraseña debe tener minimo 4 caracteres")
            .isLength({ max: 200 })
            .withMessage("Este campo no puede superar los 100 caracteres"),
        body("rePassword")
            .custom((value, { req }) => value == req.body.password)
            .withMessage("Las contraseñas deben ser iguales")
    ],
    userController.create
);

router.get("/login", GuestMiddleware, userController.login);

router.post("/login", userController.processLogin);

router.get("/profile", AuthMiddleware, userController.profile);

router.get("/cerrar-sesion", AuthMiddleware, userController.cerrarSesion);

/*** EDIT USER ***/ 
router.get("/:userId/edit", AuthMiddleware, userController.edit); /* GET - Form to create */

router.put("/:userId", upload.any(), 
    [
        check("name")
            .custom((value) => {
                let regex = /^[a-zA-Z ]+$/;
                return regex.test(value);
            })
            .withMessage('El nombre solo debe contener letras')
            .isLength({ min: 1 })
            .withMessage("Este campo no debe estar vacío")
            .isLength({ max: 100 })
            .withMessage("Este campo no puede superar los 100 caracteres"),
        check("lastname")
            .custom((value) => {
                let regex = /^[a-zA-Z ]+$/;
                return regex.test(value);
            })
            .withMessage('El apellido solo debe contener letras')
            .isLength({ min: 1 })
            .withMessage("Este campo no debe estar vacío")
            .isLength({ max: 100 })
            .withMessage("Este campo no puede superar los 100 caracteres"),
        check("email")
            .isEmail()
            .withMessage("El email que está ingresando no es válido")
            .isLength({ max: 100 })
            .withMessage("Este campo no puede superar los 100 caracteres")
    ],
    userController.update); /* PUT - Update in DB */

/*** DELETE USER ***/ 
router.delete("/:userId", userController.destroy);

module.exports = router;
