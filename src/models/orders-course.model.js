const { Model } = require('sequelize');

class OrdersCourse extends Model {

    static init(sequelize, DataTypes) {
        return super.init(
            // columns data {}
            {
                id: {
                    type: DataTypes.INTEGER(11),
                    primaryKey: true,
                    autoIncrement: true,
                },
                order_id: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                course_id: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                unit_price: {
                    type: DataTypes.DECIMAL(10, 2),
                    allownull: false
                }
            },
            // options {}
            {
                tableName: "orders_courses",
                timestamps: false,
                sequelize
            }
        );
    }
}

module.exports = OrdersCourse;