// YelpCamp-ja/models/user.js

const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
       type: String,
       required: true,
       unique: true     // ユニークな値であることを保証する
    }
});

// passportLocalMongoose を plugin することで User.authenticate() を使用できるようになる
userSchema.plugin(passportLocalMongoose, {
    errorMessages:{
        // UserExistsError のメッセージをカスタマイズ
        UserExistsError: 'そのユーザー名はすでに使われています。',
        MissingPasswordError: 'パスワードを入力してください。',
        AttemptTooSoonError: 'アカウントがロックされています。時間を空けて再試行してください。',
        TooManyAttemptsError: 'ログインの失敗が続いたため、アカウントをロックしました。',
        NoSaltValueStoredError: '認証ができませんでした。',
        IncorrectPasswordError: 'パスワードまたはユーザー名が間違っています。',
        IncorrectUsernameError: 'パスワードまたはユーザー名が間違っています。',
        MissingUsernameError: 'パスワードまたはユーザー名が間違っています。'
    }
});

module.exports = mongoose.model('User', userSchema);