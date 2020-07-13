const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', (req, res, next) => {

    passport.authenticate('login', (error, user) => {
        if (error) {
            return res.status(401).send(error.message);
        }

        if (error) {
            return res.status(401).send(error.message);
        }
        const token = jwt.sign({ user : req.body.email },'dasd', {expiresIn: '7 days'});
        //Send back the token to the user
        return res.json({ token });
    })(req, res, next);

});

module.exports = router;
