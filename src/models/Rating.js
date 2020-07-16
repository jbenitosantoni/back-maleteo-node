const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RatingSchema = new Schema(
    {
        comments: {
            type: String,
            require: false
        }, ratings: {
            type: Number,
            require: false
        }, clean: {
            type: Boolean,
            require: false
        }, date: {
            type: Date,
            require: false
        }

    },
    {
        timestamps: true
    }
);

const Rating = mongoose.model('Ratings', RatingSchema);

module.exports = Rating;
