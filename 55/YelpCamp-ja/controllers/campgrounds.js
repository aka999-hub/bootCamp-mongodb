// YelpCamp-ja/controllers/campgrounds.js
const Campground = require('../models/campground');
// mapbox 使用準備
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });
// cloudinary
const { cloudinary } = require('../cloudinary');


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
console.log("campgrounds.js module.exports.showCampground campground", campground);    
    res.render('campgrounds/show', {campground})
}

// キャンプ場の新規登録（GET）
module.exports.createCampground = async (req, res) => {
    // // リクエストにcampground が無い場合、エラー
    // if (!req.body.campground) throw new ExpressError('不正なキャンプ場のデータです', 400)

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    // console.log(geoData.body.features[0].geometry);
    // res.send('OK!!!');
    // res.send(geoData.body.features[0].geometry.coordinates);
    // res.send(geoData.body.features[0].geometry);

// // mapbox確認用のため一時的にコメントアウト
    const campground = new Campground(req.body.campground);
    // geometry情報を設定
    campground.geometry = geoData.body.features[0].geometry;
    // 作成するキャンプ場にアップロードした画像情報を紐づける
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // 作成するキャンプ場に現在のログインユーザー情報を紐づける
    campground.author = req.user._id;
    await campground.save()
console.log(campground);

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
console.log(req.body);
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })

    // 編集するキャンプ場にアップロードした画像情報を追加・DB更新する
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();

    // 画像情報の削除対応（req.body に deleteImages があれば削除する）
    if (req.body.deleteImages) {
        // cloudinaryからファイルを削除
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }

        // 配列から情報を取り除く（レビューの削除を参考）
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }

    req.flash('success', 'キャンプ場を更新しました')
    res.redirect(`/campgrounds/${campground._id}`)
}

// キャンプ場の削除（DELETE）
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'キャンプ場を削除しました')
    res.redirect(`/campgrounds`)
};