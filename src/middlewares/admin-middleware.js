module.exports = (req, res, next) => {
    // Check user logueado, si no está loguado lo envio al login
    if(req.session.user == undefined){
        res.redirect("/users/login");
    };
    
    // chequeo que tenga rol "admin"
    if(req.session.user.roles && req.session.user.roles.some(role => role.name == "admin")){
        next();
    } else {
        const error = new Error("Acceso denegado");
        error.status = 403;
        error.view = "error";
        throw error;
    }

}