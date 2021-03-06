const db = require("../models");
const bcrypt = require("bcrypt");

class AuthService {

    constructor(){}

    /**
     * Checks user login data
     * @param {*} body 
     */
    login = async (body) => {
        try {
            const user = await db.User.findOne({ where: { email: body.email }, include: {
                model: db.Role,
                as: "roles",
                through: { attributes: []}
            }});
            if(user){
                const passCheck = bcrypt.compareSync(body.password, user.password);
                if(!passCheck){
                    throw new Error("Datos incorrectos");
                }
                return user;

            } else {
                throw new Error("Usuario inexistente");
            }
            
        } catch (err) {
            throw new Error(err.message || "Error al procesar el login!")
        }
    }

    /**
     * Validates registered users
     * @param {*} email 
     * @return boolean - returns false if users exists, true if it doesn exist
     */
    validateRegisteredUser = async (email) => {
        try {
            const user = await db.User.findOne({ where: { email: email }});
            return user === null;  
        } catch (err) {
            throw err;
        }
    }
}

module.exports = AuthService;
