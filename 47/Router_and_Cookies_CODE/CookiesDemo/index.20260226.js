// Router_and_Cookies_CODE/CookiesDemo/index.js
const express = require('express')
const app = express()
// const router = express.Router()

// クッキーを使うためのミドルウェア
// requestからクッキーを読み取るためのミドルウェア
// app.use(cookieParser()) で リクエスト.cookies でリクエストからcookieが取得できるようになる
const cookieParser = require('cookie-parser')
app.use(cookieParser('mysecret'))   // 通常はシークレットキーはコードに記載しない

app.get('/greet', (req, res) => {
    // console.log(req.cookies)
    const { name = 'anonymous' } = req.cookies

    res.send(`ようこそ ${name} さん`)
})

app.get('/setname', (req, res) => {
    res.cookie('name', 'yamadataro')
    res.cookie('animal', 'cat')

    res.send('クッキーを送ったよ！！')
})

// 署名付きクッキーを設定する
app.get('/getsignedcookie', (req, res) => {
    res.cookie('fruit', 'grape', { signed: true})
    res.send('署名付きクッキーを返したよ！！')
})

// 署名付きクッキーを検証する
app.get('/verifyfruit', (req, res) => {
    console.log(req.cookies)
    // 署名付きクッキーは `req.signedCookies`  で取得できる
    console.log(req.signedCookies)
    // res.send(req.cookies)
    res.send(req.signedCookies)
})

app.listen(3000, () => {
    console.log('待受中...')
})