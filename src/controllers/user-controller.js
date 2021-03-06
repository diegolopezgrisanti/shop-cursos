const fs = require("fs");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const db = require("../models");
const { AuthService } = require("../services");

class UserController {

    constructor(){
        this._authService = new AuthService();
    }

    /**
     * Lists all users
     * @param {*} req 
     * @param {*} res
     * @param {*} next 
     */
    index = async (req, res, next) => {
        try {
			const users = await db.User.findAll({ include: [{
                model: db.Role,
                as: 'roles',
                through: { attributes: [] }  
            }] });
			res.status(200).send({ users: users });
		} catch (err) {
			let error = new Error("Error al buscar los usuarios");
			error.status = 500;
			error.developer_message = err.message;
			next(error);
			return;
		}
    }

    /**
     * Returns Register view
     * @param {*} req 
     * @param {*} res 
     */
    register = (req, res) => {
        res.render("register");
    }

    /**
     * Creates a new user
     * @param {*} req 
     * @param {*} res 
     */
    create = async (req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            const errors = [...validationResult(req).errors];
            await this._authService.validateRegisteredUser(req.body.email) ? null : errors.push({value: req.body.email, param: "email", msg: "Email ya registrado"});

            if(errors.length){
                let error = new Error("Error de validación");
                error.status = 400;
                error.errors = errors;
                throw error;
            }
            
            let user = {
                name: req.body.name,
                lastname: req.body.lastname,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                // avatar: req.files[0]?.filename || null, // error de sixtasis en nodemon
                avatar:  req.files.length ? req.files[0].filename : null
            };

            /**
             * Creamos el usuario en la base de datos
             */
            const newUser = await db.User.create(user, { transaction });

            // Asignación de rol de usuario común
            const roleUser = await db.Role.findOrCreate({ where: { name: "user"}, defaults: { name: "user" }, transaction});
            await newUser.setRoles(roleUser[0].id, { transaction }); // guarda roles para el usuario creado
            
            await newUser.reload( { transaction, include: [{
                model: db.Role,
                as: 'roles',
                through: { attributes: [] }  
            }] });
            
            if (newUser instanceof db.User){
                const userData = { ...newUser.dataValues };
                userData.roles = userData.roles.map(role => ({...role.dataValues}));

                delete userData.password;
                req.session.user = userData;

                await transaction.commit();

                return res.redirect("/users/profile");

            } else {
                throw new Error("Error al intentar crear el nuevo usuario");
            }            

        } catch (err) {
            await transaction.rollback();
            
            console.log(err);
            return res.render("register", {
                errors: err.errors,
                message: err.message,
                value: req.body,
            });
        }
    }

    /**
     * Returns Login view
     * @param {*} req 
     * @param {*} res 
     */
    login = (req, res) => {
        res.render("login");
    }

    /**
     * Process login
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    processLogin = async (req, res, next) => {
        try {
            const user =  await this._authService.login(req.body);
            if (user) {
                const userData = { ...user.dataValues };
                userData.roles = userData.roles.map(role => ({...role.dataValues}));

                delete userData.password;
                req.session.user = userData;
    
                // si el user clickeó "recordame" guardamos una cookie
                if (req.body.recordame != undefined) {
                    res.cookie("userEmail", user.email, {
                        maxAge: 30 * 24 * 60 * 60 * 1000,
                    });
                }
    
                res.redirect("/users/profile");
                
            } else {
                res.render("login", {
                    email: req.body.email,
                    errors: errors.errors,
                });
            }

        } catch (err) {
            let error = new Error(err.message || "Error al intentar procesar el login");
			error.view = "login"
			next(error);
			return;
        }

    }

    /**
     * Returns Profile view
     * @param {*} req 
     * @param {*} res
     * @param {*} next
     */
    profile = async (req, res, next) => {
        try {
            if (req.session.user){
                let user = await db.User.findByPk(req.session.user.id);
                res.render("profile", { userData: user });
            } else {
                res.redirect("login");
            } 
        } catch(err) {
            let error = new Error("Error al procesar la petición");
			error.status = 500;
			error.developer_message = err.message;
			next(error);
			return;
        }
    }

    /**
     * Closes user session
     * @param {*} req 
     * @param {*} res 
     */
    cerrarSesion = (req, res) => {
        req.session.destroy();
        res.clearCookie("userEmail");
        res.redirect("/");
    }

	/**
     * edit a user
     * @param {*} req 
     * @param {*} res
     * @param {*} next 
     */
    edit = async (req, res, next) => {
        try {
            if(req.session.user.id != req.params.userId){
                const error = new Error("Acceso denegado");
                error.status = 403;
                error.view = errors;
                throw error;
            }
            const user = await db.User.findByPk(req.params.userId);
			return res.render("user-edit-form", { userData: user });

        } catch (err) {
            console.log(err);
            next(err);
        }
    }

	/**
     * update a course
     * @param {*} req 
     * @param {*} res 
     */
    update = async (req, res) => {
        const transaction = await db.sequelize.transaction();
        try { 
            const errors = [...validationResult(req).errors];
            if (req.body.email != req.session.user.email) {
                await this._authService.validateRegisteredUser(req.body.email) ? null : errors.push({value: req.body.email, param: "email", msg: "Email ya registrado"});
            }
            if(errors.length){
                let error = new Error("Error de validación");
                error.status = 400;
                error.errors = errors;
                throw error;
            }

            const user = {
                name: req.body.name,
                lastname: req.body.lastname,
                email: req.body.email,
            };
            req.files.length ? user.avatar = req.files[0].filename : null;

			await db.User.update(user, { where: { id: req.params.userId }, transaction });

            const updatedUser = await db.User.findByPk(req.params.userId, {include: {
                model: db.Role,
                as: "roles",
                through: { attributes: [] }
            }, transaction});

            if (updatedUser instanceof db.User){
                const userData = { ...updatedUser.dataValues };
                userData.roles = userData.roles.map(role => ({...role.dataValues}));

                delete userData.password;
                req.session.user = userData;

                await transaction.commit();

                return res.redirect("/users/profile");

            } else {
                throw new Error("Error al intentar editar el usuario");
            }

        } catch (err) {
            console.log(err);
            await transaction.rollback();
            const user = await db.User.findByPk(req.params.userId);
            return res.render("user-edit-form", {
                errors: err.errors,
                message: err.message,
                value: req.body,
                userData: user
            });
        }
    }

    /**
     * Delete a user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next
     */
    destroy = async (req, res, next) => {
        try { 
            req.session.destroy();
            res.clearCookie("userEmail");
    
			const deleteUser = await db.User.destroy({
                where: {
                    id: req.params.userId
                }
			})

			return res.redirect("/");
        } catch (err) {
            console.log(err);
            next(err);
            return;
        }
    }

};

module.exports = UserController;
