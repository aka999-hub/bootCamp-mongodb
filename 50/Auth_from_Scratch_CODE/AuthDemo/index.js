// AuthDemo/index.js

const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');


mongoose.connect('mongodb://db:27017/authDemo',
    {
        useNewUrlParser:    true,   // 新しいURL文字列パーサーを使う
        useUnifiedTopology: true,   // 新しいサーバー検出および監視エンジンを使う
        useCreateIndex:     true,   // インデックス作成のためのメソッドを有効にする
        useFindAndModify:   false   // ドキュメントのfindAndModify()を使う
    })
    .then(() => {
        console.log('MongoDBコネクションOK！！');
    })
    .catch(err => {
        console.log('MongoDBコネクションエラー！！！');
        consle.log(err);
    });


// テンプレートエンジンの設定
app.set('view engine', 'ejs');
// テンプレートファイルの場所を指定（デフォルトではviewsディレクトリにあるファイルを探してくれる）
app.set('views', 'views');

// ミドルウェアの設定
// フォームから送られてきたデータを解析してreq.bodyに格納する
app.use(express.urlencoded({extended: true}));

// セッションの設定
app.use(session({secret: 'mysecret'}));

// ログインチェック
const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
}

// ルーティング

// ホームページ
app.get('/', (req, res) => {
    res.send('ホームページ')
});


// ユーザー登録（GET）
app.get('/register', (req, res) => {
    res.render('register');
});
// ユーザー登録（POST）
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    // const hash = await bcrypt.hash(password, 12);   // パスワードをハッシュ化
    const user = new User({
        username,
        // password: hash
        password
    });
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/');
})


// ログイン（GET）
app.get('/login', (req, res) => {
    res.render('login')
})
// ログイン（POST）
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/secret');
    } else {
        res.redirect('/login');
    }
});

// ログアウト（POST）
app.post('/logout', (req, res) => {
    // req.session.user_id = null;
    req.session.destroy();  // セッションを破棄する
    res.redirect('/login');
})

// 秘密のページ（GET）
app.get('/secret', requireLogin, (req, res) => {
    // if (!req.session.user_id) {
    //     return res.redirect('/login');
    // }
    // res.send('ここはログイン済みの場合だけ見れる秘密のページ');
    res.render('secret');
})

app.get('/topsecret', requireLogin, (req, res) => {
    res.send('TOP SECRET!!!');
})

app.listen(3000, () => {
    console.log('ポート3000で待受中...');
})