// YelpCamp-ja/controllers/reviews.js

const Campground = require('../models/campground');
const Review = require('../models/review');


// レビューの登録（POST）
module.exports.createReview = async (req, res) => {
    console.log(req.params)
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)

    review.author = req.user._id;   // レビューの作成者をログインユーザーに設定
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'レビューを投稿しました')
    res.redirect(`/campgrounds/${campground._id}`)
    // res.send('レビューが投稿されました！')
};

// レビューの削除（DELETE）
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, {$pull : {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'レビューを削除しました')
    res.redirect(`/campgrounds/${id}`)
};