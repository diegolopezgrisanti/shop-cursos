const db = require("../models");

class TestController {

    constructor(){
    }

    /**
     * Lists all users
     * @param {*} req 
     * @param {*} res
	 * @param {*} next 
     */
    users = async (req, res, next) => {
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
	 * Lists all courses
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
    courses = async (req, res, next) => {
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
			res.status(200).send({ courses: courses });
		} catch (err) {
			let error = new Error("Error al buscar los cursos");
			error.status = 500;
			error.developer_message = err.message;
			next(error);
			return;
		}
	}

	/**
	 * Lists all orders
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
    orders = async (req, res, next) => {
		try {
			const orders = await db.Order.findAll({ include: [
				{
					model: db.Payment,
					as: 'payment'
				},
				{
					model: db.User,
					as: 'user',
					attributes: ["id", "name", "lastname", "email"]
				},
				{
					model: db.Course,
					as: 'courses',
					through: { attributes: ["unit_price"], as: "order_detail" }  
				}
			]});
			res.status(200).send({ orders: orders });
		} catch (err) {
			let error = new Error("Error al buscar las ordenes");
			error.status = 500;
			error.developer_message = err.message;
			next(error);
			return;
		}
	}

};

module.exports = TestController;