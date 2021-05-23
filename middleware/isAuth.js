// To ensure that only the logged users an access the admin and cart features

module.exports = (req, res, next) => {
    if(!req.session.isLoggedIn) {
        return res.redirect("/e-commerce/login")
    }

    next();
}