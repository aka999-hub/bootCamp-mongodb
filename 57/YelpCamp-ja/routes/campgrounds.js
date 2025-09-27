// YelpCamp-ja/routes/campgrounds.js

const express = require('express')
const router = express.Router()
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync')
// const ExpressError = require('../utils/ExpressError')
// const Campground = require('../models/campground')
// const { campgroundSchema } = require('../schemas')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
// multer の設定 アップロード先は storage(cloudinary)に設定
const { storage } = require('../cloudinary');
//// multer の設定 一旦アップロード先は 'uploads/'に設定
// const upload = multer({ dest: 'uploads/' });
// multer の設定 アップロード先は storageに設定
const upload = multer({ storage });

router.route('/')
    // キャンプ場一覧
    .get(catchAsync(campgrounds.index))
    // キャンプ場の新規登録（POST）
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
    // upload.single('image') を追記、'image' は views/campgrounds/new.ejs の <input type="file" name="image" id=""> の name="image"
    // imag フィールドはファイルとしてパースしてくれる、それ以外は req.body に設定される
    // .post(upload.single('image'), (req, res) => {
    // .post(upload.array('image'), (req, res) => {
    //     // req.body, req.file をデバッグ表示
    //     // console.log(req.body, req.file);
    //     console.log(req.body, req.files);
    //     res.send('受け付けました');
    // })

// キャンプ場の新規登録（GET）
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    // キャンプ場詳細
    .get(catchAsync(campgrounds.showCampground))
    // キャンプ場の編集（PUT）を追加
    // PUT に upload.array('image') 
    // .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    // キャンプ場の削除（DELETE）
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// キャンプ場の編集（GET）
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;


// // キャンプ場一覧
// router.get('/', catchAsync(campgrounds.index));

// // キャンプ場の新規登録（POST）
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// // キャンプ場詳細
// router.get('/:id', catchAsync(campgrounds.showCampground));

// // キャンプ場の編集（PUT）
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

// // キャンプ場の削除（DELETE）
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// // middlewareのバリデーション（キャンプ場）
// const validateCampground = (req, res, next) => {
//     const {error} = campgroundSchema.validate(req.body)
//     if (error) {
//         const msg = error.details.map(detail => detail.message).join(', ')
//         throw new ExpressError(msg, 400)
//     } else {
//         next()
//     }
// }

// // キャンプ場の認可用ミドルウェア
// const isAuthor = async (req, res, next) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id);
//     if (!campground.author.equals(req.user._id)) {
//         req.flash('error', 'そのアクションの権限がありません');
//         return res.redirect(`/campgrounds/${id}`)
//     }
//     next();
// }

// キャンプ場一覧
// router.get('/', catchAsync(async (req, res) => {
//     const campgrounds = await Campground.find({})
//     res.render('campgrounds/index', {campgrounds})
// }))
    
// キャンプ場の新規登録（GET）
// router.get('/new', isLoggedIn, (req, res) => {
//     res.render('campgrounds/new');
// })

// キャンプ場の新規登録（POST）
// router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
//     // // リクエストにcampground が無い場合、エラー
//     // if (!req.body.campground) throw new ExpressError('不正なキャンプ場のデータです', 400)

//     const campground = new Campground(req.body.campground);
//     // 作成するキャンプ場に現在のログインユーザー情報を紐づける
//     campground.author = req.user._id;
//     await campground.save()

//     // 登録時のメッセージ設定
//     req.flash('success', '新しいキャンプ場を登録しました')
//     // 登録後は詳細ページにリダイレクト
//     res.redirect(`/campgrounds/${campground._id}`)
// }))

// キャンプ場詳細
// '/campgrounds/:id' のように、パラメータを含むルーティングは一番下に定義する
// router.get('/:id', catchAsync(async (req, res) => {
//     // キャンプ場の詳細情報を取得（populateでレビュー情報も取得）（populateでユーザー情報も取得）
//     // const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
//     const campground = await Campground.findById(req.params.id)
//     .populate({
//         path: 'reviews',
//         // poulate はネストされたモデルのデータを取得するためのメソッド
//         populate: {
//             // レビューの作成者を取得
//             path: 'author',
//         }
//     })
//     .populate('author');
// console.log(campground)
//     if (!campground) {
//         req.flash('error', 'キャンプ場は見つかりませんでした')
//         return res.redirect('/campgrounds')
//     }
//     res.render('campgrounds/show', {campground})
// }))


// キャンプ場の編集（GET）
// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id)
//     if (!campground) {
//         req.flash('error', 'キャンプ場は見つかりませんでした')
//         return res.redirect('/campgrounds')
//     }
//     // if (!campground.author.equals(req.user._id)) {
//     //     req.flash('error', '更新する権限がありません');
//     //     return res.redirect(`/campgrounds/${id}`)
//     // }

//     res.render('campgrounds/edit', {campground})
// }));

// キャンプ場の編集（PUT）
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
//     const { id } = req.params
//     // const campground = await Campground.findById(id);
//     // if (!campground.author.equals(req.user._id)) {
//     //     req.flash('error', '更新する権限がありません');
//     //     return res.redirect(`/campgrounds/${id}`)
//     // }
//     const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
//     req.flash('success', 'キャンプ場を更新しました')
//     res.redirect(`/campgrounds/${camp._id}`)
// }))

// キャンプ場の削除（DELETE）
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//     const { id } = req.params
//     const campground = await Campground.findByIdAndDelete(id)
//     req.flash('success', 'キャンプ場を削除しました')
//     res.redirect(`/campgrounds`)
// }))
