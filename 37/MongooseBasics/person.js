const mongoose = require('mongoose')
// DBは shopApp
mongoose.connect('mongodb://admin:adminpassword@db:27017/shopApp?authSource=admin', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('コネクションOK!!!')
})
.catch(err => {
    console.log('コネクションエラー!!!')
    console.log(err)
})


const personSchema = new mongoose.Schema({
    first: String,
    last: String
})

// modelの中で fullName を呼ばれた場合の処理
// アロー関数を使うとthisが変わるので、functionにする
personSchema.virtual('fullName').get(function() {
    return `${this.first} ${this.last}`
})


// mongooseのミドルウェア Pre：保存前に実行
personSchema.pre('save', async function() {
    this.first = 'ほげ'
    this.last = 'もげ'
    console.log('今から保存するよ!!!!')
})
// mongooseのミドルウェア Post：保存後に実行
personSchema.post('save', async function() {
    console.log('保存したよ!!!')
})


const Person = mongoose.model('Person', personSchema)