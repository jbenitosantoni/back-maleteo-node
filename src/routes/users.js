const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post('/register', (req, res, next) => {

    passport.authenticate('register', (error, user) => {
        if (error) {
            return res.status(422).send(error.message);
        }

        if (user === false) {
            return res.status(422).send("User or password is missing");
        }

        return res.status(200).send(user);
    })(req);

});

module.exports = router;
