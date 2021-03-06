module.exports = (req, res, next) => {
    req.session.user == undefined ? next() : res.redirect("/");
};
