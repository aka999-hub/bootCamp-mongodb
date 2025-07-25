// YelpCamp-ja/middleware.js

// ログイン済みかどうかのチェック
// req.isAuthenticated() でログイン済みかを取得し判定する
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'ログインしてください');
        return res.redirect('/login');
    }
    next();
}