const { Sequelize } = require('sequelize');

/**
 * Instance of the class Sequalize with the database config
 */
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql"
});

/**
 * Models initialization
 */
const modelsClasses = require("./index-models");

const models = {};

Object.values(modelsClasses)
.filter(modelClass => typeof modelClass.init === "function")
.forEach(modelClass => {
    models[modelClass.name] = modelClass.init(sequelize, Sequelize);
});

/**
 * Models associations
 */
Object.values(models)
.filter(model => typeof model.associate === "function")
.forEach(model => model.associate(models));

/**
 * DB test function
 */
const test = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

const db = {
    ...models,
    Sequelize: Sequelize,
    sequelize: sequelize,
    test: test
};

module.exports = db;

