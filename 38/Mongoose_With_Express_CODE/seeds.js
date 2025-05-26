const mongoose = require('mongoose')
const Product = require('./models/product')
const { name } = require('ejs')

mongoose.connect('mongodb://admin:adminpassword@db:27017/farmStand?authSource=admin', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('MongoDBコネクションOK!!!')
})
.catch(err => {
    console.log('MongoDBコネクションエラー!!!')
    console.log(err)
})

// const p = new Product({
//     name: 'ルビーグレープフルーツ',
//     price: 198,
//     category: '果物'
// })

// p.save().then(p => {
//     console.log(p)
// }).catch(e => {
//     console.log(e)
// })


const seedProducts = [    
    {
        name: 'ナス',
        price: 98,
        category: '野菜'
    },
    {
        name: 'カットメロン',
        price: 480,
        category: '果物'
    },
    {
        name: '種なしスイカのカット',
        price: 380,
        category: '果物'
    },
    {
        name: 'オーガニックセロリ',
        price: 198,
        category: '野菜'
    },
    {
        name: 'コーヒー牛乳',
        price: 298,
        category: '乳製品'
    }
]

// 複数データの登録
// バリデーションエラーが1つでもある場合、データ登録されない仕様
Product.insertMany(seedProducts)
    .then(res => {
        console.log(res)
    }).catch(e => {
        console.log(e)
    })
