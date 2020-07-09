const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookingsSchema = new Schema(
    {
        dateEntry: {
            type: Date,
            require: true
        }, dateOut: {
            type: Date,
            require: true
        }, comments: {
            type: String,
            require: false
        }, disputes : {
            type: Array,
            require: false
        }
    },
    {
        timestamps: true
    }
);

const Booking = mongoose.model('Bookings', BookingsSchema);

module.exports = Booking;
