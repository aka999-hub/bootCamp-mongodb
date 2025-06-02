// YelpCamp-ja/app.js

const express = require('express')
// path モジュールをインポート：ファイルパスやディレクトリパスを操作するためのユーティリティを提供。パス結合、絶対パス解決、ディレクトリ名や拡張子の抽出
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const joi = require('joi')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const Campground = require('./models/campground')
const Joi = require('joi')
const { error } = require('console')

// MongoDB接続
mongoose.connect('mongodb://db:27017/yelp-camp', 
{userNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {
        console.log('MongoDBコネクションOK!!!')
    })
    .catch(err => {
        console.log('MongoDBコネクションエラー!!!')
        console.log(err)
    })

const app = express()

// ejs-mateを使用して、EJSテンプレートエンジンを設定
// ejsを解釈する場合、デフォルトのejsエンジンを使用ではなく、ejsMate(ejs-mate)を使用するようにexpressに定義
app.engine('ejs', ejsMate)
// Express.jsアプリケーションでビュー（テンプレート）をレンダリングする際に使用、テンプレートエンジンをEJSに設定するコマンド
// これにより、Expressは`.ejs`拡張子を持つファイルをビューとして扱い、EJSライブラリを使ってHTMLを生成
app.set('view engine', 'ejs')
// Expressでビューテンプレートが置かれているディレクトリを設定。'views'という設定名に、path.join(__dirname, 'views')で生成された絶対パスを指定
// __dirnameは現在のスクリプトファイルがあるディレクトリのパス、path.joinはそれと'views'を結合して、OSに関係なく正しいパスを作成
app.set('views', path.join(__dirname, 'views'))
// POST リクエストなどで送られてくる URL エンコードされたデータを解析する
// {extended: true} オプションは、より複雑なオブジェクトや配列の形式も正しく解析できるようする。
// このミドルウェアを使うことで、フォームから送信されたデー タなどが req.body として利用可能になる
app.use(express.urlencoded({extended: true}))
// クエリパラメータ（?_method=[メソッド名]）で渡すことで（GET, POST）以外のリクエストが投げれるようになる
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    // res.send('YelpCamp!!!!')
    res.render('home')
})

// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({ title: '私の庭', description: '気軽に安くキャンプ！' })
//     await camp.save()
//     res.send(camp)
// })

// キャンプ場一覧
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}))

// キャンプ場の新規登録（GET）
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})
// キャンプ場の新規登録（POST）
app.post('/campgrounds', catchAsync(async (req, res) => {
    // // リクエストにcampground が無い場合、エラー
    // if (!req.body.campground) throw new ExpressError('不正なキャンプ場のデータです', 400)

    // joiで使用するスキーマ
    const campgroundSchema = joi.object({
        campground: Joi.object({
            title: Joi.string().required(),         // title はString型、必須
            price: Joi.number().required().min(0),  // price はNumber型、必須、0以上
            image: Joi.string().required(),         // image はString型、必須
            location: Joi.string().required(),      // location はString型、必須
            description: Joi.string().required(),   // description はString型、必須
        }).required()                               // campground はオブジェクト、必須
    })

    const {error} = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(detail => detail.message).join(', ')
        throw new ExpressError(msg, 400)
    }
    
    console.log(error.details)

    const campground = new Campground(req.body.campground)
    await campground.save()
    // 登録後は詳細ページにリダイレクト
    res.redirect(`/campgrounds/${campground._id}`)
}))

// キャンプ場詳細
// '/campgrounds/:id' のように、パラメータを含むルーティングは一番下に定義する
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {campground})
}))

// キャンプ場の編集（GET）
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {campground})
}))
// キャンプ場の編集（PUT）
app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
}))

// キャンプ場の削除（DELETE）
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect(`/campgrounds`)
}))



app.all('*', (req, res, next) => {
    // res.send('404!')
    next(new ExpressError('ページが見つかりませんでした', 404))
})

// カスタムエラーハンドリング
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) {
        err.message = '問題が起きました'
    }
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('ポート3000でリクエスト待受中...')
})
