const express = require('express')
const app = express()
const morgan = require('morgan')

const AppError = require('./AppError')

// morganのログを出力設定 ------------------
app.use(morgan('tiny'))
// morganのログを出力設定 ------------------

// 自作のミドルウェアを作成 Start ------------------
app.use((req, res, next) => {
    // req.method = 'GET'
    req.requestTime = Date.now()
    console.log(req.method, req.path)
    next()
})

app.use('/dogs', (req, res, next) => {
    console.log('いぬーーーー！！！')
    next()
})

// 認証を関数化
const verifyPassword = (req, res, next) => {
    console.log(req.query)

    const { password } =  req.query
    if (password === 'supersecret') {
        // next()
        return next()   // retun next() にするのは、next() の後のコードを実行させないため
        console.log('next() を実行したよ')
    }
    // res.send('パスワードが必要です')
    // res.status(401)
    throw new AppError('パスワードが必要です', 401)
}
// 自作のミドルウェアを作成 End ------------------


app.get('/', (req, res) => {
    console.log(`リクエスト時刻： ${req.requestTime}`)
    res.send('ホームページ')
})

app.get('/error', (req, res) => {
    hoge.moge()
})

app.get('/dogs', (req, res) => {
    console.log(`リクエスト時刻： ${req.requestTime}`)
    res.send('わんわん')
})

// 認証後のルート Start ------------------
app.get('/secret', verifyPassword, (req, res) => {
    res.send('ここは秘密のページです、誰にも言わないで！！')
})
// 認証後のルート End ------------------

app.get('/admin', (req, res) => {
    throw new AppError('管理者しかアクセスできません', 403)
})

// 上記のルートに該当しない場合
app.use((req, res) => {
    res.status(404).send('ページが見つかりません')
})

// エラーハンドリングのミドルウェア
// app.use((err, req, res, next) => {
//     console.log('*******************************')
//     console.log('**********エラー発生************')
//     console.log('*******************************')
//     // res.status(500).send('エラーが発生しました!!')
//     console.log(err)
//     next(err)  // next() でexpress デフォルトのエラー処理を実行したい場合、引数にerrを渡す
// })

app.use((err, req, res, next) => {
    const { status = 500, message = '何かエラーが起きました' } = err
    res.status(status).send(message)
})


app.listen(3000, () => {
    console.log('localhost:3000で待受中…')
})