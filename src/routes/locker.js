const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Locker = require('../models/Locker');
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
            const serviceFee = (req.body.price * 0.02).toFixed(2);

            if (!(req.user === email)) {
                const error = "Token Invalido";
                return res.status(401).send(error);
            }

            if (user.isGuardian === false) {
                const error = "You are not a guardian!";
                return res.status(401).send(error);
            }

            const newLocker = new Locker({
                name: req.body.name,
                description: req.body.description,
                location: req.body.location,
                space: req.body.space,
                lockerType: req.body.lockerType,
                price: +req.body.price + +serviceFee,
                userID: req.body.userID,
                photos: req.body.photos
            });

            const savedLocker = await newLocker.save();

            return res.status(201).send(savedLocker);

        } catch (err) {
            next(err);
        }
    }
});

router.get('/availableLockers', async (req, res, next) => {
    if (req.user) {
        try {

            if (!req.body.id) {
                const error = "You must send the user ID!";
                return res.status(401).send(error);
            }

            const id = req.body.id;
            const user = await User.findById(id);
            const email = user.email;

            if (!(req.user === email)) {
                const error = "Token Invalido";
                return res.status(401).send(error);
            }
            let lockers = await Locker.find();
            let bookings = await Booking.find();
            let availableLockers = [];
            const checkIn = new Date(req.body.checkIn);
            const checkOut = new Date(req.body.checkOut);

            for (let i = 0; i < lockers.length; i++) {
                let bookingID = []
                for (let h = 0; h < lockers[i].bookingID.length; h++) {
                if (lockers[i].bookingID[h] !== null) {
                bookingID.push(lockers[i].bookingID);
                }
                }
                if (bookingID.length === 0) {
                    availableLockers.push(lockers[i]);
                } else {
                    for(let j = 0; j < bookings.length; j++) {
                        for (let x = 0; x < bookingID.length; x++) {
                            if (bookings[j]._id == bookingID[x]) {
                                let startDate = bookings[j].dateEntry;
                                let endDate = bookings[j].dateOut;
                                const range = moment.range(startDate, endDate);
                                if ((range.contains(checkIn)) === false && (range.contains(checkOut)) === false) {
                                    console.log("uwu");
                                    availableLockers.push(lockers[i]);
                                }
                            }
                        }
                    }
                }
            }

        res.send(availableLockers);
        } catch (err) {
            next(err);
        }
    }
});

router.get('/hostLockers', async (req, res, next) => {
    if (req.user) {
        try {

            if (!req.body.userID) {
                const error = "You must send the user ID!";
                return res.status(401).send(error);
            }

            const id = req.body.id;
            const user = await User.findById(id);
            const email = user.email;
            const userID = req.body.userID;

            if (!(req.user === email)) {
                const error = "Token Invalido";
                return res.status(401).send(error);
            }

            let lockers = await Locker.find();
            let hostLockers = [];

            for (let i = 0; i < lockers.length; i++) {
                if (lockers.userID === userID) {
                    hostLockers.push(lockers[i]);
                }
            }

            res.send(hostLockers);
        } catch (err) {
            next(err);
        }
    }
});

module.exports = router;
