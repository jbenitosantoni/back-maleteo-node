const mongoose = require('mongoose');
const Double = require('@mongoosejs/double');
const Schema = mongoose.Schema;

const LockerSchema = new Schema(
    {
        name: {
            type: String,
            require: true
        }, description: {
            type: String,
            require: true
        }, location: {
            type: String,
            require: true
        }, ratings: {
            type: Array,
            require: false
        }, space: {
            type: Number,
            require: true
        }, lockerType: {
            type: String,
            require: true
        }, price: {
            type: Double,
            require: true
        }, bookingID: {
            type: String,
            require: false
        }
    },
    {
        timestamps: true
    }
);

const Locker = mongoose.model('Lockers', LockerSchema);

module.exports = Locker;
