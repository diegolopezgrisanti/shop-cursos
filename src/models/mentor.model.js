const { Model } = require('sequelize');

class Mentor extends Model {

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
                    type: DataTypes.STRING(45),
                    allowNull: false
                },
                lastname: {
                    type: DataTypes.STRING(45),
                    allowNull: false
                }
            },
            // options {}
            {
                tableName: "mentors",
                timestamps: false,
                sequelize
            }
        );
    }

    static associate(models) {
        models.Mentor.hasMany(models.Course, {
            foreignKey: 'mentor_id',
            as: "courses"
        }); 
    }
}

module.exports = Mentor;