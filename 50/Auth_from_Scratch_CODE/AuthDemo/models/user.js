// AuthDemo/models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username は必須です']
    },
    password: {
        type: String,
        required: [true, 'password は必須です']
    }
});


// ユーザー情報取得・パスワードチェック
userSchema.statics.findAndValidate = async function(username, password) {
    const foundUser = await this.findOne({ username });
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}

// ユーザー登録時にパスワードをハッシュ化
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); // パスワード変更なしの場合、処理なし

    this.password = await bcrypt.hash(this.password, 12);   // パスワードをハッシュ化
    next();
})

module.exports = mongoose.model('User', userSchema);