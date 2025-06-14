// Mongoose_Relationships_Express_CODE/index.js

const express = require('express')
const app = express()
// path モジュールをインポート：ファイルパスやディレクトリパスを操作するためのユーティリティを提供。パス結合、絶対パス解決、ディレクトリ名や拡張子の抽出
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const Product = require('./models/product')
const Farm = require('./models/farm')
const AppError = require('./AppError')

// DBは farmStandTake2
// mongoose.connect('mongodb://db:27017/farmStandTake2', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
mongoose.connect('mongodb://db:27017/farmStandTake2', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('MongoDBコネクションOK！！')
    })
    .catch(err => {
        console.log('MongoDBコネクションエラー！！')
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

// 商品カテゴリー
const categories = ['果物','野菜','乳製品','パン類']


// Farm 関連
// 農場一覧
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({})      
    res.render('farms/index', { farms })
})

// 農場作成（GET）
app.get('/farms/new', (req, res) => {
    res.render('farms/new')
})
// 農場作成（GET）
app.post('/farms', async(req, res) => {
    // res.send(req.body)
    const farm = new Farm(req.body)
    await farm.save()
    // 登録後、一覧画面にリダイレクト
    res.redirect(`/farms`)
})

// 農場詳細
// app.get('/farms/:id', は、app.get('/farms/new', の後に定義する
app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate('products')
// console.log(farm)
    res.render('farms/show', { farm })
})

// 農場に紐づく商品登録（GET）
app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params
    const farm = await Farm.findById(id)
    res.render('products/new', { categories, farm })
})
// 農場に紐づく商品登録（POST）
app.post('/farms/:id/products', async (req, res) => {
    const { id } = req.params
    const farm = await Farm.findById(id)
    const { name, price, category } = req.body
    const product = new Product({ name, price, category })
    // FarmにProductを追加
    farm.products.push(product)
    // ProductにFarmを指定
    product.farm = farm
    // DB保存
    await farm.save()
    await product.save()

    res.redirect(`/farms/${farm._id}`)
})

// 農場の削除（DELETE）
app.delete('/farms/:id', async (req, res) => {
console.log('DELETE!!!')
    await Farm.findByIdAndDelete(req.params.id)

    res.redirect('/farms')
})


// Product 関連

// 商品一覧
app.get('/products', wrapAsync(async (req, res) => {
    // クエリパラメータ（category）を取得
    const { category } = req.query
    if (category) {
        // カテゴリ指定の場合
        // key と value が同じなので、"key: value" の形式を省略
        const products = await Product.find({category})
        res.render('products/index', {products, category})
    } else {
        // 全てのカテゴリ
        const products = await Product.find({})
        res.render('products/index', {products, category: '全'})
    }
}))

// 商品作成（GET）
app.get('/products/new', (req, res) => {
    res.render('products/new', {categories})
})
// 商品作成（POST）
app.post('/products', wrapAsync(async (req, res) => {
    const newProduct = new Product(req.body)
    await newProduct.save()
    // 登録後、詳細画面にリダイレクト
    res.redirect(`/products/${newProduct._id}`)
}))

// 商品更新（GET）
app.get('/products/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params
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
        fn(req, res, next).catch(e => {
            console.log('wrapAsync:エラー発生')
            next(e)
        })
    }
}

// 商品詳細
app.get('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id).populate('farm', 'name')
// console.log(product)
    if (!product) {
        console.log('product is null')
        throw new AppError('商品が見つかりません', 404)
    }
    res.render('products/show', {product})
}))

// 商品削除
app.delete('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)
    console.log(deletedProduct)
    // 削除後、一覧画面に遷移
    res.redirect('/products')
}))

const handleValidationErr = err => {
    console.log(err)
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
    const { status = 500, message = '問題が発生しました'} = err
    res.status(status).send(message)
})

// listen
app.listen(3000, () => {
    console.log('ポート3000でリクエスト待受中')
})