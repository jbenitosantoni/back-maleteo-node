const mongoose = require('mongoose');
const Double = require('@mongoosejs/double');

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
        }, lockerID: {
            type: String,
            require: true
        }, space: {
            type: Number,
            require: true
        }, finalPrice: {
            type: Double,
            require: true
        } , userID: {
            type: String,
            require: true
        },
    },
    {
        timestamps: true
    }
);

const Booking = mongoose.model('Bookings', BookingsSchema);

module.exports = Booking;
