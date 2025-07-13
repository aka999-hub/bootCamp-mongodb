// Session_And_Flash/SessionDemo/index.js
const express = require('express')
const app = express()
// Expressでセッションを使うためのモジュール
const session = require('express-session')

// セッションの設定
const sessionOptions = {
    secret: 'mysecret',         // 本番環境ではハードコードしない
    resave: false,              // セッションが変更されない限りセッションを保存しない
    saveUninitialized: false,   // 初期化されていないセッションを保存しない
}
// ミドルウェアにsessionを設定
app.use(session(sessionOptions))


app.get('/viewcount', (req, res) => {
    if (req.session.count) {
        req.session.count += 1
    } else {
        req.session.count = 1
    }
    res.send(`あなたは${req.session.count}回このページを表示しました`)
})

app.get('/register', (req, res) => {
    const { username = 'Anonymous' } = req.query
    req.session.username = username 
    res.redirect('/greet')
})

app.get('/greet', (req, res) => {
    const { username } = req.session
    res.send(`ようこそ、${username}さん`)
})

app.listen(3000, () => {
    console.log('ポート3000で待受中...')
})