const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post('/', (req, res, next) => {

    passport.authenticate('register', (error, user) => {
        if (error) {
            return res.status(422).send(error.message);
        }

        if (error) {
            return res.status(422).send(error.message);
            return res.status(200).send(user);
        }

    })(req, res, next);

});

module.exports = router;
