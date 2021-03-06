const { Model } = require('sequelize');

class Order extends Model {

    static init(sequelize, DataTypes) {
        return super.init(
            // columns data {}
            {
                id: {
                    type: DataTypes.INTEGER(11),
                    primaryKey: true,
                    autoIncrement: true,
                },
                total_price: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                user_id: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                date: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                payment_id: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                }
            },
            // options {}
            {
                tableName: "orders",
                timestamps: false,
                sequelize
            }
        );
    }

    //agregado el 13/12/20
    static associate(models) {
        models.Order.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: "user"
        }); 

        models.Order.belongsTo(models.Payment, {
            foreignKey: 'payment_id',
            as: "payment"
        }); 

        models.Order.belongsToMany(models.Course, {
            through: "orders_courses",
            as: "courses",
            foreignKey: "order_id",
            otherKey: "course_id",
            timestamps: false,    
        }); 
    }

}

module.exports = Order;