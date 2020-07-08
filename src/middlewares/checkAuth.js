const checkAuthMiddleware = (res, req, next) => {
    if (req.user) {
        next();
    } else {
        res.send("Debes hacer login");
    }
}

module.exports = checkAuthMiddleware;
