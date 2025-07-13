// YelpCamp-ja/models/campground.js
const mongoose = require('mongoose')
const Review = require('./review')
const { Schema } = mongoose

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

// キャンプ場削除（findByIdAndDelete）でトリガされるミドルウェア
campgroundSchema.post('findOneAndDelete', async function(doc) {
    // console.log(doc)
    // キャンプ場が削除されると、それに関連するレビューも削除する
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }    
        })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema)