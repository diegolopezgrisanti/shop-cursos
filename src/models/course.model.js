const { Model } = require('sequelize');
class Course extends Model {

    static init(sequelize, DataTypes) {
        return super.init(
            // columns data {}
            {
                id: {
                    type: DataTypes.INTEGER(11),
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },
                duration: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                mentor_id: {
                    type: DataTypes.INTEGER(11),
                    allowNull:false
                },
                price: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false
                },
                discount: {
                    type: DataTypes.INTEGER(11),
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                discounted_price: {
                    type: DataTypes.VIRTUAL,
                    get(){
                        return this.getDiscountedPrice(this.price, this.discount);
                    }
                }
            },
            // options {}
            {
                tableName: "courses",
                timestamps: false,
                sequelize
            }
        );
    }

    static associate(models) {
        models.Course.belongsTo(models.Mentor, {
            foreignKey: "mentor_id",
            as: "mentor"
        });
        
        models.Course.hasMany(models.CourseImage, {
            foreignKey: "course_id",
            as: "images"
        });

        models.Course.belongsToMany(models.Category, {
            as: "categories",
            through: "courses_categories",
            foreignKey: "course_id",
            otherKey: "category_id",
            timestamps: false
        });
    }

    getDiscountedPrice = (price, discount) => {
        const { UtilsService } = require("../services");
        const utilService = new UtilsService();
        return utilService.calcularPrecioConDescuento(price, discount);
    }

}

module.exports = Course;