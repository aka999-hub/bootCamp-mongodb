// YelpCamp-ja/routes/campgrounds.js

const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas')

// middlewareのバリデーション（キャンプ場）
const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(detail => detail.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}


// キャンプ場一覧
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}))

// キャンプ場の新規登録（GET）
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})
// キャンプ場の新規登録（POST）
router.post('/', validateCampground, catchAsync(async (req, res) => {
    // // リクエストにcampground が無い場合、エラー
    // if (!req.body.campground) throw new ExpressError('不正なキャンプ場のデータです', 400)

    const campground = new Campground(req.body.campground)
    await campground.save()

    // 登録時のメッセージ設定
    req.flash('success', '新しいキャンプ場を登録しました')
    // 登録後は詳細ページにリダイレクト
    res.redirect(`/campgrounds/${campground._id}`)
}))

// キャンプ場詳細
// '/campgrounds/:id' のように、パラメータを含むルーティングは一番下に定義する
router.get('/:id', catchAsync(async (req, res) => {
    // キャンプ場の詳細情報を取得（populateでレビュー情報も取得）
    const campground = await Campground.findById(req.params.id).populate('reviews')
// console.log(campground)
    if (!campground) {
        req.flash('error', 'キャンプ場は見つかりませんでした')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}))

// キャンプ場の編集（GET）
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'キャンプ場は見つかりませんでした')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}))
// キャンプ場の編集（PUT）
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'キャンプ場を更新しました')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// キャンプ場の削除（DELETE）
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'キャンプ場を削除しました')
    res.redirect(`/campgrounds`)
}))

module.exports = router