// YelpCamp-ja/routes/users.js

const express = require("express");
const router = express.Router();
const passport = require('passport');
const { userSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
const { route } = require("./users");

// ユーザー登録（GET）
router.get('/register', (req, res) => {
    res.render('users/register');
})
// ユーザー登録（POST）
router.post('/register', async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email});
    
        // User.register()はpassport-local-mongooseモジュールが提供するメソッド
        // passport で生のパスワードをハッシュ化して保存する
        const registerUser = await User.register(user, password);  
        console.log(registerUser);
        req.flash('success', 'Yelp Campへようこそ！');
        res.redirect('/campgrounds');    
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');  // エラーメッセージを表示して、ユーザーを登録ページにリダイレクト
    }
});

// ログイン（GET）
router.get('/login', (req, res) => {
    res.render('users/login');
});
// ログイン（POST）
// passport.authenticate() は、ログイン処理を行うミドルウェア
// passport.authenticate() で既に認証がＯＫかどうかが完了する
// passport.authenticate() はパスワードをハッシュ化して、ハッシュ化した値がDBの値と一致するか判定する
// 第２引数の `failureFlash` で、ログイン失敗時に自動的にFlashを出すようにしている
// 第２引数の `failureRedirect` で、ログイン失敗時のリダイレクト先を指定
// ログイン成功時には、req.user にユーザー情報が格納される
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    // ここに入っていると時には既に認証済み
    req.flash('success', 'おかえりなさい！！');
    res.redirect('/campgrounds');
});

// ログアウト（GET）
router.get('/logout', (req, res) => {
    // // passport パッケージのバージョン 0.6.0 以前の場合は、req.logout() を呼び出す
    // req.logout();
    // req.flash('success', 'ログアウトしました');
    // res.redirect('/campgrounds');

    // passport パッケージのバージョン 0.6.0 以降は、非同期処理となり処理完了後に実行されるコールバック関数が必須になった
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'ログアウトしました');
        res.redirect('/campgrounds');    
    });
});


module.exports = router;