// YelpCamp-ja/middleware.js

const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas');
const Campground = require('./models/campground');
const Review = require('./models/review');

// Express.js の res.locals はリクエストとレスポンスのライフサイクルの間、データをアプリケーション内で渡すために使用するオブジェクト
// この中に変数を格納すれば、テンプレートや他ミドルウェアなどから参照できるようになる
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


// ログイン済みかどうかのチェック
// req.isAuthenticated() でログイン済みかを取得し判定する
module.exports.isLoggedIn = (req, res, next) => {
// console.log('req.user', req.user);
    if (!req.isAuthenticated()) {
        // 元々リクエストした場所を保存しておく
        // console.log(req.path, req.originalUrl);
        req.session.returnTo = req.originalUrl;

        req.flash('error', 'ログインしてください');
        return res.redirect('/login');
    }
    next();
}


// middlewareのバリデーション（キャンプ場）
module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(detail => detail.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// キャンプ場の認可用ミドルウェア
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'そのアクションの権限がありません');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

// レビューの認可用ミドルウェア
// urlは /campgrounds/:id/reviews/:reviewId で渡される
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'そのアクションの権限がありません');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

// middlewareのバリデーション（レビュー）
module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(detail => detail.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}