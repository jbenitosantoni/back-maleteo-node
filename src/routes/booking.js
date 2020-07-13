const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');

router.post('/', async (req, res, next) => {
    if (req.user) {
        try {
            if (!req.body.id) {
                const error = "You must send user ID";
                return res.status(401).send(error);
            }
            const id = req.body.id;
            const user = await User.findById(id);
            const email = user.email;

            if (!(req.user === email)) {
                const error = "Token Invalido";
                return res.status(401).send(error);
            }

            const newBooking = new Booking({
                dateEntry: req.body.dateEntry,
                dateOut: req.body.dateOut,
                comments: req.body.comments,
                space: req.body.space,
                lockerID: req.body.lockerID,
                finalPrice: req.body.finalPrice,
                userID: req.body.userID
            });

            const savedBooking = await newBooking.save();

            return res.status(201).send(savedBooking);

        } catch (err) {
            next(err);
        }
    }
});

router.get('/user', async (req, res, next) => {
    if (req.user) {
        try {

            if (!req.body.id) {
                const error = "You must send user ID";
                return res.status(401).send(error);
            }

            const id = req.body.id;
            const user = await User.findById(id);
            const email = user.email;

            if (!(req.user === email)) {
                const error = "Token Invalido";
                return res.status(401).send(error);
            }

            let bookings = await Booking.find();
            let bookingMadeByUser = [];

            for (let i = 0; i < bookings.length; i++) {
                if (bookings.userID === id) {
                    bookingMadeByUser.push(bookings[i]);
                }
            }

            res.send(bookingMadeByUser);
        } catch (err) {
            next(err);
        }
    }
});

router.get('/host', async (req, res, next) => {
    if (req.user) {
        try {

            if (!req.body.id) {
                const error = "You must send user ID";
                return res.status(401).send(error);
            }

            if (!req.body.lockerID) {
                const error = "You must send user locker ID!";
                return res.status(401).send(error);
            }

            const id = req.body.id;
            const user = await User.findById(id);
            const email = user.email;
            const lockerID = req.body.lockerID
            if (!(req.user === email)) {
                const error = "Token Invalido";
                return res.status(401).send(error);
            }

            let bookings = await Booking.find();
            let bookingsHost = [];

            for (let i = 0; i < bookings.length; i++) {
                if (bookings.lockerID === lockerID) {
                    bookingsHost.push(bookings[i]);
                }
            }

            res.send(bookingsHost);
        } catch (err) {
            next(err);
        }
    }
});

module.exports = router;
