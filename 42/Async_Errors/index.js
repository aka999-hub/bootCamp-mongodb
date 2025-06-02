const express = require('express')
const app = express()
// path モジュールをインポート：ファイルパスやディレクトリパスを操作するためのユーティリティを提供。パス結合、絶対パス解決、ディレクトリ名や拡張子の抽出
const path = require('path')
const mongoose = require('mongoose')
const Product = require('./models/product')
const methodOverride = require('method-override')
const AppError = require('./AppError')


// DBは farmStand2
// mongoose.connect('mongodb://admin:adminpassword@db:27017/farmStand2?authSource=admin', {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect('mongodb://db:27017/farmStand2', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(() => {
    console.log('MongoDBコネクションOK!!!')
})
.catch(err => {
    console.log('MongoDBコネクションエラー!!!')
    console.log(err)
})


// Expressでビューテンプレートが置かれているディレクトリを設定。'views'という設定名に、path.join(__dirname, 'views')で生成された絶対パスを指定
// __dirnameは現在のスクリプトファイルがあるディレクトリのパス、path.joinはそれと'views'を結合して、OSに関係なく正しいパスを作成
app.set('views', path.join(__dirname, 'views'))
// Express.jsアプリケーションでビュー（テンプレート）をレンダリングする際に使用、テンプレートエンジンをEJSに設定するコマンド
// これにより、Expressは`.ejs`拡張子を持つファイルをビューとして扱い、EJSライブラリを使ってHTMLを生成
app.set('view engine', 'ejs')
// POST リクエストなどで送られてくる URL エンコードされたデータを解析する
// {extended: true} オプションは、より複雑なオブジェクトや配列の形式も正しく解析できるようする。
// このミドルウェアを使うことで、フォームから送信されたデー タなどが req.body として利用可能になる
app.use(express.urlencoded({extended: true}))
// クエリパラメータ（?_method=[メソッド名]）で渡すことで（GET, POST）以外のリクエストが投げれるようになる
app.use(methodOverride('_method'))

// 商品カテゴリ
const categories = ['果物', '野菜', '乳製品', 'パン類']

// 商品一覧
app.get('/products', wrapAsync(async (req, res) => {
    // クエリパラメータ（category）を取得
    const { category } = req.query
    if (category) {
        // カテゴリ指定の場合
        // key と value が同じなので "key: value" の形式を省略
        const products = await Product.find({category})
        res.render('products/index', {products, category})

    } else {
        // 全てのカテゴリ
        const products = await Product.find({})
        res.render('products/index', {products, category: '全'})
    }
    // console.log(products)
}))

// 商品作成（GET）
app.get('/products/new', (req, res) => {
    // throw new AppError('閲覧できません', 401)

    // console.log('新規作成ページ')
    // res.send('新規作成ページ')
    res.render('products/new', {categories})
})
// 商品作成（POST）
app.post('/products', wrapAsync(async (req, res) => {
    const newProduct = new Product(req.body)
    await newProduct.save()
    // console.log(newProduct)
    res.redirect(`/products/${newProduct._id}`)
}))

// 商品更新（GET）
app.get('/products/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params
    // const product = await Product.findById(id)   
    const product = await Product.findById(id)
    if (!product) {
        return next(new AppError('商品が見つかりません', 404))
    }
    console.log(product)
    res.render('products/edit', {product, categories})
}))
// 商品更新（PUT）
app.put('/products/:id', wrapAsync(async (req, res) => {
    console.log(req.body)
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    res.redirect(`/products/${product._id}`)
}))

// 関数を受け取り、関数を戻す関数
function wrapAsync(fn) {
    return function(req, res, next) {
        // fn() はpromiseを返す
        // fn(req, res, next).catch(e => next(e))
        fn(req, res, next).catch(e => {
            console.log('wrapAsync:エラー発生')
            next(e)
        })
    }
}

// 商品詳細
app.get('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    // await console.log('start Product.findById')
    const product = await Product.findById(id)
    if (!product) {
        console.log('product is null')
        throw new AppError('商品が見つかりません', 404)
    }
    res.render('products/show', {product})
}))


// app.get('/dog', (req, res) => {
//     res.send('わんわん')
// })

// 商品削除
app.delete('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)
    console.log(deletedProduct)
    res.redirect('/products')
}))

const handleValidationErr = err => {
    console.log(err)
    // return err
    return new AppError(`入力内容に誤りがあります...${err.message}`, 400)
}

// カスタムエラー（err.name 参照用）
app.use((err, req, res, next) => {
    console.log(err.name)
    if (err.name === 'ValidationError') err = handleValidationErr(err)
    next(err)
})

// カスタムエラー
app.use((err, req, res, next) => {
console.log('カスタムエラー開始')    
    const { status = 500, message = '問題が発生しました' } = err
    res.status(status).send(message)  
})

// listen
app.listen(3000, () => {
    console.log('ポート3000でリクエスト待受中…')
})
