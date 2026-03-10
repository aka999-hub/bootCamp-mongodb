// YelpCamp-ja/app.js

// process.env.NODE_ENV：node.jsの環境変数
if (process.env.NODE_ENV !== 'production') {    // production：本番用
    // node.js が開発用で起動している場合は、dotenvの設定を使用する
    require('dotenv').config();
}
// require('dotenv').config();

// console.log(process.env.SECRET);
// console.log(process.env.CLOUDINARY_CLOUD_NAME);
// console.log(process.env.CLOUDINARY_KEY);
// console.log(process.env.CLOUDINARY_SECRET);

const express = require('express')
// path モジュールをインポート：ファイルパスやディレクトリパスを操作するためのユーティリティを提供。パス結合、絶対パス解決、ディレクトリ名や拡張子の抽出
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError')
// const { campgroundSchema, reviewSchema } = require('./schemas')
// const catchAsync = require('./utils/catchAsync')
const methodOverride = require('method-override')
// const Campground = require('./models/campground')
// const Review = require('./models/review')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');

// SQLインジェクション対策
const mongoSanitize = require('express-mongo-sanitize');

const usersRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')

const MongoStore = require('connect-mongo');

// MongoDB接続
//const dbUrl = process.env.DB_URL;
const dbUrl = 'mongodb://db:27017/yelp-camp'; // 'mongodb://db:27017/yelp-camp', 
mongoose.connect(dbUrl,
// {   useNewUrlParser: true, 
//     useUnifiedTopology: true, 
//     useCreateIndex: true,
//     useFindAndModify: false})
    {   useNewUrlParser: true,
        useUnifiedTopology: true})
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
// SQLインジェクション対策
app.use(mongoSanitize({
    replaceWith: '_',
}));

// セッションストアの設定
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60, // 24時間ごとにセッションを更新
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
})
store.on('error', e => {
    console.log('セッションストアエラー', e);
});

// セッションの設定（取り敢えずメモリストアを利用）
const sessionConfig = {
    store,                      // セッションストアの保存先設定（mongoDB）
    name: 'session',            // セッション名を指定
    secret: 'mysecret',         // セッションを暗号化するためのシークレットキー、基本的にハードコードしない
    resave: false,              // セッションが変更されたかどうかに関係なく、セッションを保存するかどうか
    saveUninitialized: true,    // 初期化されていないセッションを保存するかどうか
    cookie: {
        httpOnly: true,         // JavaScriptからアクセスできないようにする, httpからのみアクセス可能
        // secure: true,           // httpsでしかcookieのやりとりとしない設定
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

// コンテンツセキュリティポリシー (CSP)の設定
const scriptSrcUrls = [
    'https://api.mapbox.com',
    'https://cdn.jsdelivr.net'
];
const styleSrcUrls = [
    'https://api.mapbox.com',
    'https://cdn.jsdelivr.net'
];
const connectSrcUrls = [
    'https://api.mapbox.com',
    'https://*.tiles.mapbox.com',
    'https://events.mapbox.com'
];
const fontSrcUrls = [];
const imgSrcUrls = [
    `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
    'https://images.unsplash.com'
];
// セキュリティの設定
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["blob:"],
        objectSrc: [],
        imgSrc: ["'self'", 'blob:', 'data:', ...imgSrcUrls],
        fontSrc: ["'self'", ...fontSrcUrls]
    }
}));
// app.use(helmet({
//     // contentSecurityPolicy: false
// }));

// フラッシュのミドルウェア設定
app.use((req, res, next) => {

    console.log(req.query);
    // console.log(req.session);

    // res.locals：リクエストのライフサイクル内で使える変数を保存
    // グローバルにアクセスできるのでテンプレートで利用可能
    res.locals.currentUser = req.user;
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
