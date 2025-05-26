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

        const price = Math.floor(Math.random() * 2000) + 1000   // 1000~3000円
        const camp = new Campground({
            location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
            title: `${sample(descriptors)}・${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: '木曾路はすべて山の中である。あるところは岨づたいに行く崖の道であり、あるところは数十間の深さに臨む木曾川の岸であり、あるところは山の尾をめぐる谷の入り口である。一筋の街道はこの深い森林地帯を貫いていた。東ざかいの桜沢から、西の十曲峠まで、木曾十一宿はこの街道に添うて、二十二里余にわたる長い谿谷の間に散在していた。道路の位置も幾たびか改まったもので、古道はいつのまにか深い山間に埋もれた。',
            price   // 省略表記
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})