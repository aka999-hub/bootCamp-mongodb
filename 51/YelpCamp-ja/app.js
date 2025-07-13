// YelpCamp-ja/app.js

const express = require('express')
// path モジュールをインポート：ファイルパスやディレクトリパスを操作するためのユーティリティを提供。パス結合、絶対パス解決、ディレクトリ名や拡張子の抽出
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
// const ExpressError = require('./utils/ExpressError')
// const { campgroundSchema, reviewSchema } = require('./schemas')
// const catchAsync = require('./utils/catchAsync')
// const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
// const Campground = require('./models/campground')
// const Review = require('./models/review')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const usersRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')


// MongoDB接続
mongoose.connect('mongodb://db:27017/yelp-camp', 
{   userNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false})
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
// 静的ファイルを提供するためのミドルウェア。Express.jsアプリケーションで静的ファイル（HTML、CSS、JavaScriptなど）を提供するために使用
app.use(express.static(path.join(__dirname, 'public')))

// セッションの設定（取り敢えずメモリストアを利用）
const sessionConfig = {
    secret: 'mysecret',         // セッションを暗号化するためのシークレットキー、基本的にハードコードしない
    resave: false,              // セッションが変更されたかどうかに関係なく、セッションを保存するかどうか
    saveUninitialized: true,    // 初期化されていないセッションを保存するかどうか
    cookie: {
        httpOnly: true,         // JavaScriptからアクセスできないようにする
        maxAge: 1000 * 60 * 60 * 24 * 7, // cookieの有効期限：7日間
    }
}
app.use(session(sessionConfig))

// passportの設定
app.use(passport.initialize());
app.use(passport.session());    // セッションを使用するために必要（expressのセッションを設定した後に定義する）
// passport に対し LocalStrategy のログイン方法を使用すると宣言（認証には User.authenticate() を使用する）
passport.use(new LocalStrategy(User.authenticate()));
// セッションにユーザー情報をどうやって設定するか（User.serializeUser() を使用する）
passport.serializeUser(User.serializeUser());
// セッションからユーザー情報をどうやって取得するか（User.deserializeUser() を使用する）
passport.deserializeUser(User.deserializeUser());

// フラッシュメッセージの設定
app.use(flash())

// フラッシュのミドルウェア設定
app.use((req, res, next) => {
    // res.locals：リクエストのライフサイクル内で使える変数を保存
    // グローバルにアクセスできるのでテンプレートで利用可能
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

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




app.get('/', (req, res) => {
    // res.send('YelpCamp!!!!')
    res.render('home')
})


// GET /register
// POST /register
// app.get('/users/register', (req, res) => {
//     res.render('')
// })
// ユーザーのルーティング
app.use('/', usersRoutes);


// app.get('/fakeUser', async (req, res) => {
//     const user = new User({email: 'hogegege@example.com', username: 'hogegege'});
//     const newUser = await User.register(user, 'mogegege');
//     res.send(newUser);
// });

// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({ title: '私の庭', description: '気軽に安くキャンプ！' })
//     await camp.save()
//     res.send(camp)
// })

// キャンプ場のルーティング
app.use('/campgrounds', campgroundRoutes)
// レビューのルーティング
app.use('/campgrounds/:id/reviews', reviewRoutes)


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
