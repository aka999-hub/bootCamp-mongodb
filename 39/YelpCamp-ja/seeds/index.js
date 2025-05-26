const mongoose = require('mongoose')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground')


// MongoDB接続
mongoose.connect('mongodb://db:27017/yelp-camp', 
{userNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {
        console.log('MongoDBコネクションOK!!!')
    })
    .catch(err => {
        console.log('MongoDBコネクションエラー!!!')
        console.log(err)
    })

// タイトル作成用
const sample = array => array[Math.floor(Math.random() * array.length)]

// DBのデータ削除（初期処理でデータ削除）
const seedDB = async () => {
    // 全データ削除
    await Campground.deleteMany({})

    // // テスト用にデータ登録
    // const c = new Campground({ title: 'オートキャンプ' })
    // await c.save()

    for (let i = 0; i < 50; i++) {
        const randomCityIndex = Math.floor(Math.random() * cities.length)
        const randomPlaceIndex = Math.floor(Math.random() * places.length)
        const randomDescriptorsIndex = Math.floor(Math.random() * descriptors.length)

        const camp = new Campground({
            location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
            title: `${sample(descriptors)}・${sample(places)}`,
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})