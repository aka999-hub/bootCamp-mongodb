// FlashDemo/index.js
const express = require('express')
const app = express()
// pathはファイルパスを扱うためのモジュール
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

// セッションの設定
// secretはセッションを暗号化するためのキー：通常ハードコードしない
// resaveはセッションを保存するかどうか：falseにする
// saveUninitializedはセッションが初期化されていない場合に保存するかどうか：falseにする
const sessionOptions = { secret: 'mysecret', resave: false, saveUninitialized: false }
app.use(session(sessionOptions))
// フラッシュメッセージを使うためのミドルウェア
app.use(flash())

const Farm = require('./models/farm')

// MongoDBに接続する
// useNewUrlParserはURLのパースに使う
// useNewUrlParserとuseUnifiedTopologyはMongoDBのバージョンが古い場合に必要
mongoose.connect('mongodb://db:27017/flashDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDBコネクションOK！！')
    })
    .catch(err => {
        console.log('MongoDBコネクションエラー！！！')
        console.log(err)
    })

// viewsディレクトリを指定
// path.joinはファイルパスを結合する
// __dirnameは現在のディレクトリのパス
// viewsディレクトリを __dirname と views を結合したパスに設定
app.set('views', path.join(__dirname, 'views'))
// ejsをテンプレートエンジンとして設定
app.set('view engine', 'ejs')
// body-parserを使うためのミドルウェア
// extended: trueはクエリパラメータを解析するためのオプション
// urlencodedはクエリパラメータを解析するためのミドルウェア
app.use(express.urlencoded({ extended: true }))

// フラッシュメッセージを使うためのミドルウェア
app.use((req, res, next) => {
    res.locals.messages = req.flash('success')
    next()
})

// Farm関連
// 農場一覧
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({})
    // res.render('farms/index', { farms, messages: req.flash('success') })
    res.render('farms/index', { farms })
})

// 農場新規登録（GET）
app.get('/farms/new', (req, res) => {
    res.render('farms/new')
})
// 農場新規登録（POST）
app.post('/farms', async (req, res) => {
    const farm = new Farm(req.body)
    await farm.save()
    req.flash('success', '新しい農場を登録しました')
    res.redirect('/farms')
})

// 農場詳細
app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id)
    res.render('farms/show', { farm })
})

app.listen(3000, () => {
    console.log('ポート3000でリクエスト待受中...')
})