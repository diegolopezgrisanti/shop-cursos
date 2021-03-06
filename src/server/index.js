const express = require("express");
const routers = require("../routes");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { ErrorMiddleware } = require("../middlewares");
const methodOverride = require('method-override');
const db = require('../models');

class Server {

    constructor(){
        console.log("Initializing server...");

        // init app
        this._app = express();

        // template engine config
        this._app.set("views", path.join(__dirname, "../views"));
        this._app.set("view engine", "ejs");

        // init app level middlewares
        this.initMiddlewares();

        // init routers
        this._routers = routers;
        this.initRouters();

        // Setting error middleware
        this._app.use(ErrorMiddleware);
        

    }

    start = () => {
        this._app.listen(process.env.PORT, () => {
            console.log(`${process.env.APP_NAME} APP running on port ${process.env.PORT}`);
        })
    }

    initMiddlewares = () => {
        console.log("Initializing middlewares...");
        this._app.use(express.urlencoded({ extended: false }));
        this._app.use(express.json());
        this._app.use(express.static(path.join(__dirname, "../public")));
        

        // configuramos middlewares a nivel aplicación de cookie-parser y express-session
        this._app.use(cookieParser());
        this._app.use(session({ secret: "my secret!!$" }));
        this._app.use(methodOverride('_method'));

        // configuramos middleware para iniciar sesion con data en cookies
        this._app.use(async (req, res, next) => {
            if (req.session.user == undefined && req.cookies.userEmail != undefined) {
                const user = await db.User.findOne({ where: { email: req.cookies.userEmail }, include: [{
                    model: db.Role,
                    as: 'roles',
                    through: { attributes: [] }  
                }] });
                if (user) {
                    // guardamos la data del usuario en session
                    const userData = { ...user.dataValues };
                    userData.roles = userData.roles.map(role => ({...role.dataValues}));
                    delete userData.password;
                    req.session.user = userData;
                }
            }
            next();
        });

        // configuramos middleware para pasarle la data del usuario a las vistas
        this._app.use(function (req, res, next) {
            res.locals.userLogueado = req.session.user != undefined;
            req.session.user != undefined ? res.locals.user = req.session.user : null;
            next();
        });
        
    }

    initRouters = () => {
        console.log("Initializing routes...");
        this._app.use("/", this._routers.mainRoutes);
        this._app.use("/users", this._routers.userRoutes);
        this._app.use("/products", this._routers.productRoutes);
        this._app.use("/test", this._routers.testRoutes);
        this._app.use("/order", this._routers.orderRoutes);
    }

}

module.exports = Server;