const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Locker = require('../Models/Locker');
const Booking = require('../Models/Booking');
const bcrypt = require('bcrypt');

const saltRounds = 10;

router.get('/', async (req, res, next) => {
    if (req.user) {
        console.log(req.user);
        try {
            const id = req.body.id;
            const user = await User.findById(id);
            const email = user.email;
            const entryDate = req.body.entryDate;
            const leaveDate = req.body.leaveDate;
            const space = req.body.space;
            if (!(req.user === email)) {
                const error = "Token Invalido";
                return res.status(401).send(error);
            }

        } catch (err) {
            next(err);
        }
    }
});

module.exports = router;
