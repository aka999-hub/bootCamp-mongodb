// YelpCamp-ja/controllers/users.js

const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email});
    
        // User.register()はpassport-local-mongooseモジュールが提供するメソッド
        // passport で生のパスワードをハッシュ化して保存する
        const registeredUser = await User.register(user, password);  
        // console.log(registeredUser);
        req.login(registeredUser, function(err) {
            if (err) return next(err);
            req.flash('success', 'Yelp Campへようこそ！');
            res.redirect('/campgrounds');   
        });
 
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');  // エラーメッセージを表示して、ユーザーを登録ページにリダイレクト
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'おかえりなさい！！');
    // res.redirect('/campgrounds');

    // ログイン前にアクセスしようとしていたページにリダイレクトする
    // ログイン前にアクセスしようとしていたページがない場合は、'/campgrounds' にリダイレクトする
    // Passort.js のアップデートによりログイン成功時に、セッションがクリアされ、ログイン前にアクセスしようとしていたページが取得できない
    // const redirectUrl = req.session.returnTo || '/campgrounds';

    // ここを res.locals.returnTo に変更
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    // ログインが完了した時に、returnTo を消す処理を追加
    delete req.session.returnTo;
    delete res.locals.returnTo;

    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
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
};