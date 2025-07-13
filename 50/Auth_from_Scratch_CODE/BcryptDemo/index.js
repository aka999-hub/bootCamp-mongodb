// Auth_from_Scratch_CODE/BcryptDem/index.js

const bcrypt = require('bcrypt')

// salt と hash を別々に生成する関数
// const hashPassword = async(pw) => {
//     const salt = await bcrypt.genSalt(12)
//     const hash = await bcrypt.hash(pw, salt)
//     console.log(salt)
//     console.log(hash)
// }

// salt と hash を一度に生成する関数
const hashPassword = async(pw) => {
    const hash = await bcrypt.hash(pw, 12)
    console.log(hash)
}


const login = async(pw, hashPw) => {
   const result = await bcrypt.compare(pw, hashPw)
   if (result) {
    console.log('ログイン成功！！！')
   } else {
    console.log('ログイン失敗！！！')
   }
}


// hashPassword('123456')

// salt と hash を別々に生成してログイン関数
// root ➜ .../bootCamp-mongodb/50/Auth_from_Scratch_CODE/BcryptDemo $ node index.js 
// $2b$12$Xn.BGQeku665oXl2Qjr6c.
// $2b$12$Xn.BGQeku665oXl2Qjr6c.rvqcPoGUYXGCakC0XI6Qlk.F1YikQNu
// // ログイン成功パターン
// login('123456', '$2b$12$Xn.BGQeku665oXl2Qjr6c.rvqcPoGUYXGCakC0XI6Qlk.F1YikQNu')
// ログイン失敗パターン
// login('123456', '$2b$12$Xn.BGQeku665oXl2Qjr6c.rvqcPoGUYXGCakC0XI6Qlk.F1YikQNa')

// salt と hash を一緒に生成してログイン関数
// root ➜ .../bootCamp-mongodb/50/Auth_from_Scratch_CODE/BcryptDemo $ node index.js 
// $2b$12$mG/cSjhNYEQUxbd8Vm9jtuLNrxcRdJPUr0a0c2b.xJBZuoYtRDoeO
// ログイン成功パターン
// login('123456', '$2b$12$mG/cSjhNYEQUxbd8Vm9jtuLNrxcRdJPUr0a0c2b.xJBZuoYtRDoeO')
// ログイン失敗パターン
login('123457', '$2b$12$mG/cSjhNYEQUxbd8Vm9jtuLNrxcRdJPUr0a0c2b.xJBZuoYtRDoeO')
