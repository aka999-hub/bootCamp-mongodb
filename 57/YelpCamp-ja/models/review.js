// YelpCamp-ja/models/review.js
const mongoose = require('mongoose')
const { Schema } = mongoose

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Userモデルと関連付け
    }
});

module.exports = mongoose.model('Review', reviewSchema)