// YelpCamp-ja/models/campground.js
const mongoose = require('mongoose')
const Review = require('./review')
const { Schema } = mongoose

// imageのサムネイル用
// https://res.cloudinary.com/dwwqzevrb/image/upload/v1754776627/YelpCamp/y1r79q7eljttlloc8gbz.jpg
// ->
// https://res.cloudinary.com/dwwqzevrb/image/upload/w_200/v1754776627/YelpCamp/y1r79q7eljttlloc8gbz.jpg
// image 専用のスキーマを作成
// image に対して thumbnail プロパティが使えるようになる
// virtual を使用することで、imageSchema に thumbnail を追加する（mongoDBに追加）必要がない
const imageSchema = new Schema({
    url: String,
    filename: String
});
// virtual を使用することで mongoDB に thumbnail 項目を追加する必要がない
imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace("/upload", "/upload/w_200");
});
// imageのサムネイル用

// mongooseのSchema をJSONにした時、デフォルトではvirtual は含まれないので、オプション「toJSON: { virtuals: true }」指定する
const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema({
    title: String,
    // image: String,
    // images: [
    //     {
    //         url: String,
    //         filename: String
    //     }
    // ],
    images: [imageSchema],

    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }        
    },

    price: Number,
    description: String,
    location: String,
    author: {
       type: Schema.Types.ObjectId,
       ref: 'User'  // authorはUser モデルと関連付けられる
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);
// virtual を使用することで mongoDB に properties.poppupMarkup 項目を追加する必要がない
campgroundSchema.virtual('properties.popupMarkup').get(function() {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});


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