const { Model } = require('sequelize');

class User extends Model {

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
                lastname: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },
                email: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },
                password: {
                    type: DataTypes.STRING(200),
                    allowNull: false
                },
                avatar: {
                    type: DataTypes.STRING(200),
                    allowNull: true   
                }
            },
            // options {}
            {
                tableName: "users",
                timestamps: false,
                underscored: true,
                sequelize
            }
        );
    }

    static associate(models) {
        models.User.belongsToMany(models.Role, {
            through: "users_roles",
            as: "roles",
            foreignKey: "user_id",
            otherKey: "role_id",
            timestamps: false,            
        }); 

        models.User.hasMany(models.Order, {
            foreignKey: 'user_id',
            as: "order"
        });
    }

}

module.exports = User;