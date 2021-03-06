const { Model } = require('sequelize');

class Role extends Model {

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
                }
            },
            // options {}
            {
                tableName: "roles",
                timestamps: false,
                underscored: true,
                sequelize
            }
        );
    }

    static associate(models) {
        models.Role.belongsToMany(models.User, {
            through: "users_roles",
            as: "users",
            foreignKey: "role_id",
            otherKey: "user_id",
            timestamps: false,            
        }); 
    }

}

module.exports = Role;