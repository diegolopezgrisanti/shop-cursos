const db = require("../models");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

class ProductController {

	constructor () {
	}

	/**
	 * Lists all courses
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	index = async (req, res, next) => {
		try {
			const courses = await db.Course.findAll({ include: [
				{
					model: db.Mentor,
					as: 'mentor'
				},
				{
					model: db.CourseImage,
					as: 'images'
				},
				{
					model: db.Category,
					as: 'categories',
					through: { attributes: [] }  
				}
			]});
			res.render("products", { productsAll: courses });
		} catch (err) {
			let error = new Error("Error al buscar los cursos");
			error.status = 500;
			error.developer_message = err.message;
			next(error);
			return;
		}
	}

	/**
	 * Search courses
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	search = async (req, res, next) => {
		try {
			const courses = await db.Course.findAll({ 
				where: {
					[Op.or]: [
						{
							name: {
								[Op.like]: `%${req.query.query}%`,
							}
						},
						{
							description: {
								[Op.like]: `%${req.query.query}%`,
							}
						}
					]
				},
				include: [
				{
					model: db.Mentor,
					as: 'mentor'
				},
				{
					model: db.CourseImage,
					as: 'images'
				},
				{
					model: db.Category,
					as: 'categories',
					through: { attributes: [] }  
				}
			]});
			res.render("products", { productsAll: courses, search: req.query.query });
		} catch (err) {
			let error = new Error("Error al buscar los cursos");
			error.status = 500;
			error.developer_message = err.message;
			next(error);
			return;
		}
	}

	/**
	 * Show course by ID
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
    detail = async (req, res, next) => {
		try {
			const product = await db.Course.findByPk(req.params.productId,
				{ include: [
				{
					model: db.Mentor,
					as: 'mentor'
				},
				{
					model: db.CourseImage,
					as: 'images'
				},
				{
					model: db.Category,
					as: 'categories',
					through: { attributes: [] }  
				}
			]});

			res.render("product-detail", { product: product });
		} catch (err) {
			let error = new Error("Error al buscar el curso");
			error.status = 500;
			error.developer_message = err.message;
			next(error);
			return;
		}
	}

	/**
	 * Create - Form to create
	 * @param {*} req 
	 * @param {*} res 
	*/ 
	create = async (req, res, next) => {
		try {
			const mentors = await db.Mentor.findAll();
			const categories = await db.Category.findAll();
			res.render("product-create-form", { mentors, categories});
		} catch (err) {
			let error = new Error("Error al mostrar el formulario");
			error.status = 500;
			error.developer_message = err.message;
			error.view = "error";
			next(error);
			return;
		}
	}

	/**
     * Creates a new course
     * @param {*} req 
     * @param {*} res
     */
    store = async (req, res) => {
		const transaction = await db.sequelize.transaction();
		try {
            const errors = [...validationResult(req).errors];

            if(errors.length){
                let error = new Error("Error de validación");
                error.status = 400;
                error.errors = errors;
                throw error;
			}
			
			let course = {
				name: req.body.name,
				duration: req.body.duration,
				mentor_id: req.body.mentor,
				price: Number(req.body.price),
				discount: Number(req.body.discount),
				description: req.body.description
			};

			if(req.files.length){
				course.images = req.files.map((file, index) => ({ filename: file.filename, order: index + 1}))
			}
	
            /**
             * Creamos el curso en la base de datos
             */
			const newCourse = await db.Course.create(course, { transaction, include: {
				model: db.CourseImage,
				as: "images"
			} });

			await newCourse.setCategories(req.body.category, {transaction });

			await transaction.commit();
			
            return res.redirect("/products/detail/" + newCourse.id);

        } catch (err) {
			console.log(err);
			await transaction.rollback();
			const mentors = await db.Mentor.findAll();
			const categories = await db.Category.findAll();
            return res.render("product-create-form", {
				errors: err.errors,
                message: err.message,
				value: req.body,
				mentors,
				categories
            });
        }
    }

	/**
     * edit a course
     * @param {*} req 
     * @param {*} res 
     */
    edit = async (req, res) => {
        try { 
			const product = await db.Course.findByPk(req.params.productId, { include: [
				{
					model: db.Mentor,
					as: "mentor",
				},
				{
					model: db.Category,
					as: "categories",
					through: { attributes: []}
				},
				{
					model: db.CourseImage,
					as: "images"
				}
			]});
			const mentors = await db.Mentor.findAll();
			const categories = await db.Category.findAll();

			return res.render("product-edit-form", { product, mentors, categories });

        } catch (err) {
            console.log(err);
            return res.render("/products", {
                errors: err.errors,
                message: err.message,
                value: req.body,
            });
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

            if(errors.length){
                let error = new Error("Error de validación");
                error.status = 400;
                error.errors = errors;
                throw error;
			}
			
			await db.Course.update({
				name: req.body.name,
				duration: req.body.duration,
				mentor_id: req.body.mentor,
				price: Number(req.body.price),
				discount: Number(req.body.discount),
				description: req.body.description,
			}, {
				where: {
					id: req.params.productId
				}, transaction
			});

			const course = await db.Course.findByPk(req.params.productId);
			await course.setCategories(req.body.category, { transaction });

			await transaction.commit();
			return res.redirect("/products/detail/" + req.params.productId);

        } catch (err) {
			console.log(err);
			await transaction.rollback();
			const product = await db.Course.findByPk(req.params.productId, { include: [
				{
					model: db.Mentor,
					as: "mentor",
				},
				{
					model: db.Category,
					as: "categories",
					through: { attributes: []}
				},
				{
					model: db.CourseImage,
					as: "images"
				}
			]});
			const mentors = await db.Mentor.findAll();
			const categories = await db.Category.findAll();
            return res.render("product-edit-form", {
                errors: err.errors,
                message: err.message,
				value: req.body,
				product,
				categories,
				mentors
            });
        }
    }

	/**
     * Delete a course
     * @param {*} req 
     * @param {*} res 
     */
    destroy = async (req, res, next) => {
        try { 
			const deleteCourse = await db.Course.destroy({
				where: {
					id: req.params.productId
				}
			})

			return res.redirect("/products");
        } catch (err) {
			console.log(err);
			let error = new Error("Error al borrar el curso.");
			error.status = 500;
			error.view = "error";
			next(error);

        }
    }

};

module.exports = ProductController;