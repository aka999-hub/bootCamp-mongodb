// /34/Templating_Demo/index.js

const express = require('express')
const app = express()

// テンプレートエンジンに EJS を指定
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    // res.send('Hi')
    res.render('home') // home.ejs 呼出し
})


app.listen(3000, () => {
    console.log('ポート3000で待受中...')
})