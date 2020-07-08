const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post('/register', (req, res, next) => {

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

router.post('/login', (req, res, next) => {

    passport.authenticate('login', (error, user) => {
        if (error) {
            return res.status(401).send(error.message);
        }

        if (error) {
            return res.status(401).send(error.message);
        }

        return res.status(200).send(user);
    })(req, res, next);

});

router.post('/logout', (req, res, next) => {
    req.logout();

    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/');
    })
})

module.exports = router;
