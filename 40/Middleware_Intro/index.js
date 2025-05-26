const express = require('express')
const app = express()
const morgan = require('morgan')

// 全ての処理で実行される
// app.use(() => {
//     console.log('やっほー!!!')
// })

// morganのログを出力設定 ------------------
// Using a predefined format string
// app.use(morgan('tiny'))

// 色のついたログを出力
// app.use(morgan('dev'))

// よく使うHTTPリクエストのログが出力される
// app.use(morgan('common'))

// morganは通常レスポンスが投げられるタイミングで実行される
// 第2引数に{immediate: true}を渡すとリクエストが来たタイミングで実行される
// app.use(morgan('common', { immediate: true }))
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

// 全てのリクエストでレスポンスが同じ内容を返す
// app.use((req, res) => {
//     res.send('app.useでリクエストをハイジャック！！！')
// })

// app.use() で全てのリクエストを処理する
// next() で次の処理に渡す
// app.use((req, res, next) => {
//     console.log('初めてのミドルウェア')

//     // next() を実行してもこの処理が終了したわけではない、next()の後に下記が実行される
//     // next()
//     // console.log('初めてのミドルウェアのnext()の後の処理!!!')

//     // return next() にすると、next()の後に処理は実行されない
//     return next()
//     console.log('初めてのミドルウェアのnext()の後の処理!!!')
// })

// app.use((req, res, next) => {
//     console.log('2個目のミドルウェア')
//     next()
// })

// パスワード認証するミドルウェア
// app.use((req, res, next) => {        // 全てのパスで実行する
// app.use('/secret', (req, res, next) => {    // 特定のパス（/secret）で実行する
//         console.log(req.query)

//     const { password } =  req.query
//     if (password === 'supersecret') {
//         // next()
//         return next()   // retun next() にするのは、next() の後のコードを実行させないため
//         console.log('next() を実行したよ')
//     }
//     res.send('パスワードが必要です')
// })
// 認証を関数化
const verifyPassword = (req, res, next) => {
    console.log(req.query)

    const { password } =  req.query
    if (password === 'supersecret') {
        // next()
        return next()   // retun next() にするのは、next() の後のコードを実行させないため
        console.log('next() を実行したよ')
    }
    res.send('パスワードが必要です')
}

// 自作のミドルウェアを作成 End ------------------



app.get('/', (req, res) => {
    console.log(`リクエスト時刻： ${req.requestTime}`)
    res.send('ホームページ')
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



// 上記のルートに該当しない場合
app.use((req, res) => {
    res.status(404).send('ページが見つかりません')
})

app.listen(3000, () => {
    console.log('localhost:3000で待受中…')
})