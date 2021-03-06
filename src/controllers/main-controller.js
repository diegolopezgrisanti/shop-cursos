const fs = require("fs");
const path = require("path");
const db = require('../models');
const { UtilsService } = require("../services");

class MainController {
  constructor() {
		this._utilsService = new UtilsService();
	}

	/**
     * index-home show all products
     * @param {*} req 
     * @param {*} res 
	 * @param {*} next
     */
	home = async (req, res, next) => {
		try {
			const courses = await db.Course.findAll({ 
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
        ],
        limit: 5,
        order: [['discount', 'desc']]
      });
			res.status(200).render("home", { products: courses});
		} catch (err) {
			let error = new Error("Error al cargar los productos en home");
			error.status = 500;
			error.developer_message = err.message;
			next(error);
			return;
		}
	}

  
};

module.exports = MainController;
