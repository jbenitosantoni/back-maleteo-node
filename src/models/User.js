const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            require: true
        }, password: {
            type: String,
            require: true
        }, name: {
            type: String,
            require: true
        }, surname: {
            type: String,
            require: true
        }, dateOfBirth: {
            type: Date,
            require: true
        }, marketing: {
            type: Boolean,
            required: true
        }, profileDescription: {
            type: String,
            require: false
        }, profileImage: {
            type: String,
            require: false
        }, isGuardian: {
            type: Boolean,
            require: false,
            default: false
        }, googleId : {
            type: String,
            require: false
        }, facebookID: {
            type: String,
            require: false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('Users', UserSchema);

module.exports = User;
