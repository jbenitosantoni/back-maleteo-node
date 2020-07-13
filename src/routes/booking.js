const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const moment = require('moment');
const momentRange = require('moment-range');
momentRange.extendMoment(moment);

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

router.get('/', async (req, res, next) => {
    if (req.user) {
        try {
            const id = req.body.id;
            const user = await User.findById(id);
            const email = user.email;

            if (!(req.user === email)) {
                const error = "Token Invalido";
                return res.status(401).send(error);
            }
            let lockers = await Locker.find();
            let bookings = await Booking.find();
            let lockersDisponibles = [];
            const checkIn = new Date(req.body.checkIn);
            const checkOut = new Date(req.body.checkOut);

            for (let i = 0; i < lockers.length; i++) {
                let bookingID = []
                bookingID.push(lockers[i].bookingID);
                if (bookingID.length === 0) {
                    lockersDisponibles.push(lockers[i]);
                } else {
                    for(let j = 0; j < bookings.length; j++) {
                        for (let x = 0; x < bookingID.length; x++) {
                            if (bookings[j]._id == bookingID[x]) {
                                let startDate = bookings[j].dateEntry;
                                let endDate = bookings[j].dateOut;
                                const start = new Date(2012, 0, 15);
                                const range = moment.range(startDate, endDate);
                                if ((range.contains(checkIn)) === false && (range.contains(checkOut)) === false) {
                                    lockersDisponibles.push(lockers[i]);
                                }
                            }
                        }
                    }
                }
            }

            res.send(lockersDisponibles);
        } catch (err) {
            next(err);
        }
    }
});

router.get('/user', async (req, res, next) => {
    if (req.user) {
        try {
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

            res.send(bookings);
        } catch (err) {
            next(err);
        }
    }
});

router.get('/host', async (req, res, next) => {
    if (req.user) {
        try {
            const id = req.body.id;
            const user = await User.findById(id);
            const email = user.email;
            const lockerID = req.body.lockerID
            if (!(req.user === email)) {
                const error = "Token Invalido";
                return res.status(401).send(error);
            }

            let bookings = await Booking.find();
            let bookingMadeByUser = [];

            for (let i = 0; i < bookings.length; i++) {
                if (bookings.lockerID === lockerID) {
                    bookingMadeByUser.push(bookings[i]);
                }
            }

            res.send(bookings);
        } catch (err) {
            next(err);
        }
    }
});

module.exports = router;
