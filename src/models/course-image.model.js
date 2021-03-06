const { Model } = require('sequelize');

class CourseImage extends Model {

    static init(sequelize, DataTypes) {
        return super.init(
            // columns data {}
            {
                id: {
                    type: DataTypes.INTEGER(11),
                    primaryKey: true,
                    autoIncrement: true,
                },
                filename: {
                    type: DataTypes.STRING(200),
                    allowNull: false
                },
                order: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                course_id: {
                    type: DataTypes.INTEGER(11),
                    allowNull:false
                }

            },
            // options {}
            {
                tableName: "course_images",
                timestamps: false,
                sequelize
            }
        );
    }

    //agregado el 13/12/20
    static associate(models) {
        models.CourseImage.belongsTo(models.Course, {
            foreignKey: 'course_id',
            as: "course"
        }); 
    }

}

module.exports = CourseImage;