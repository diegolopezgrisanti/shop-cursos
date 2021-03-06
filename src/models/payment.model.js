const { Model } = require('sequelize');

class Payment extends Model {

    static init(sequelize, DataTypes) {
        return super.init(
            // columns data {}
            {
                id: {
                    type: DataTypes.INTEGER(11),
                    primaryKey: true,
                    autoIncrement: true,
                },
                status: {
                    type: DataTypes.STRING(45),
                    allowNull: false
                }
            },
            // options {}
            {
                tableName: "payments",
                timestamps: false,
                sequelize
            }
        );
    }

    //agregado el 13/12/20
    static associate(models) {
        models.Payment.hasMany(models.Order, {
            foreignKey: 'payment_id',
            as: "order"
        }); 
    }

}

module.exports = Payment;