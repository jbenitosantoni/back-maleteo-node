const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LockerSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            require: true
        }, name: {
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
        }, password: {
            type: String,
            require: true
        }, availableSpace: {
            type: Number,
            require: false
        }, lockerType: {
            type: String,
            require: true
        }, price: {
            type: Number,
            require: true
        }
    },
    {
        timestamps: true
    }
);

const Locker = mongoose.model('Lockers', LockerSchema);

module.exports = Locker;
