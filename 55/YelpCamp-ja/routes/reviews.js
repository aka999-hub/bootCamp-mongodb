// YelpCamp-ja/routes/reviews.js

const express = require('express')
// mergeParams: true（親ルーターのパラメータを子ルーターで使用できるようにする）
const router = express.Router({mergeParams: true})  // mergeParams: true を追加
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync')
const reviews = require('../controllers/reviews');
// const { reviewSchema } = require('../schemas')
// const ExpressError = require('../utils/ExpressError')
// const Campground = require('../models/campground')
// const Review = require('../models/review')

// レビューの登録（POST）
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// レビューの削除（DELETE）
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;

// // middlewareのバリデーション（レビュー）
// const validateReview = (req, res, next) => {
//     const {error} = reviewSchema.validate(req.body)
//     if (error) {
//         const msg = error.details.map(detail => detail.message).join(', ')
//         throw new ExpressError(msg, 400)
//     } else {
//         next()
//     }
// }


// レビューの登録（POST）
// router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
// console.log(req.params)
//     const campground = await Campground.findById(req.params.id)
//     const review = new Review(req.body.review)

//     review.author = req.user._id;   // レビューの作成者をログインユーザーに設定
//     campground.reviews.push(review)
//     await review.save()
//     await campground.save()
//     req.flash('success', 'レビューを投稿しました')
//     res.redirect(`/campgrounds/${campground._id}`)
//     // res.send('レビューが投稿されました！')
// }))
    
// レビューの削除（DELETE）
// router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params
//     await Campground.findByIdAndUpdate(id, {$pull : {reviews: reviewId}})
//     await Review.findByIdAndDelete(reviewId)
//     req.flash('success', 'レビューを削除しました')
//     res.redirect(`/campgrounds/${id}`)
// }));
