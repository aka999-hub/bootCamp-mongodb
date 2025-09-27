// YelpCamp-ja/controllers/campgrounds.js
const Campground = require('../models/campground');


// キャンプ場一覧
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
} 

// キャンプ場の新規登録（GET）
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

// キャンプ場詳細
module.exports.showCampground = async (req, res) => {
    // キャンプ場の詳細情報を取得（populateでレビュー情報も取得）（populateでユーザー情報も取得）
    // const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    const campground = await Campground.findById(req.params.id)
    .populate({
        path: 'reviews',
        // poulate はネストされたモデルのデータを取得するためのメソッド
        populate: {
            // レビューの作成者を取得
            path: 'author',
        }
    })
    .populate('author');
// console.log(campground)
    if (!campground) {
        req.flash('error', 'キャンプ場は見つかりませんでした')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}

// キャンプ場の新規登録（GET）
module.exports.createCampground = async (req, res) => {
    // // リクエストにcampground が無い場合、エラー
    // if (!req.body.campground) throw new ExpressError('不正なキャンプ場のデータです', 400)

    const campground = new Campground(req.body.campground);
    // 作成するキャンプ場に現在のログインユーザー情報を紐づける
    campground.author = req.user._id;
    await campground.save()

    // 登録時のメッセージ設定
    req.flash('success', '新しいキャンプ場を登録しました')
    // 登録後は詳細ページにリダイレクト
    res.redirect(`/campgrounds/${campground._id}`)
}

// キャンプ場の編集（GET）
module.exports.renderEditForm  = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'キャンプ場は見つかりませんでした')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}

// キャンプ場の編集（PUT）
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'キャンプ場を更新しました')
    res.redirect(`/campgrounds/${camp._id}`)
}

// キャンプ場の削除（DELETE）
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'キャンプ場を削除しました')
    res.redirect(`/campgrounds`)
};