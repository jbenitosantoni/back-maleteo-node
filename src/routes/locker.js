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

            if (!(req.user === email)) {
                const error = "Token Invalido";
                return res.status(401).send(error);
            }

            if (user.isGuardian === false) {
                const error = "You are not a guardian!";
                return res.status(401).send(error);
            }

            if (req.body.lockerType !== 'Casa' || req.body.lockerType !== 'Hotel' || req.body.lockerType !== 'Tienda' || req.body.lockerType !== 'Trastero') {
                const error = "Locker inputs types can only be Casa Hotel Tienda or Trastero!";
                return res.status(401).send(error);
            }

            const newLocker = new Locker({
                name: req.body.name,
                description: req.body.description,
                location: req.body.location,
                space: req.body.space,
                lockerType: req.body.lockerType,
                price: req.body.price,
                userID: req.body.userID
            });

            const savedLocker = await newLocker.save();

            return res.status(201).send(savedLocker);

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
                                    console.log("uwu");
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

module.exports = router;
