// YelpCamp-ja/middleware.js

// Express.js の res.locals はリクエストとレスポンスのライフサイクルの間、データをアプリケーション内で渡すために使用するオブジェクト
// この中に変数を格納すれば、テンプレートや他ミドルウェアなどから参照できるようになる
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


// ログイン済みかどうかのチェック
// req.isAuthenticated() でログイン済みかを取得し判定する
module.exports.isLoggedIn = (req, res, next) => {
// console.log('req.user', req.user);
    if (!req.isAuthenticated()) {
        // 元々リクエストした場所を保存しておく
        // console.log(req.path, req.originalUrl);
        req.session.returnTo = req.originalUrl;

        req.flash('error', 'ログインしてください');
        return res.redirect('/login');
    }
    next();
}