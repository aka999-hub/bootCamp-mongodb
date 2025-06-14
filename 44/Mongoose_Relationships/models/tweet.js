// Mongoose_Relationships/models/tweet.js

const mongoose = require('mongoose')
const { Schema } = mongoose

mongoose.connect('mongodb://db:27017/relationshipDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDBコネクションOK！！')
    })
    .catch(err => {
        console.log('MongoDBコネクションエラー！！')
        console.log(err)
    })

const userSchema = new Schema({
    username: String,
    age: Number,

})

const tweetSchema = new Schema({
    text: String,
    likes: Number,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
})

const User = mongoose.model('User', userSchema)
const Tweet = mongoose.model('Tweet', tweetSchema)

// const makeTweets = async () => {
//     // ユーザーを作成して、ツイートを作成する
//     // const user = new User({ username: 'yamada99', age: 61 })
//     // const tweet1 = new Tweet({ text: '今日は晴れてて気分がいい', likes: 0})
//     // tweet1.user = user
//     // user.save()
//     // tweet1.save()

//     // ユーザーを検索して、ツイートを作成する
//     const user = await User.findOne({ username: 'yamada99' })
//     const tweet2 = new Tweet({ text: 'ほげもげほげもげ', likes: 100})
//     tweet2.user = user
//     tweet2.save()

// }

// makeTweets()

// ツイートを取得して、ユーザー情報も取得する
const findTweet = async () => {
    // const t = await Tweet.findOne({})
    // const t = await Tweet.findOne({}).populate('user')
    // const t = await Tweet.findOne({}).populate('user', 'username')  // Userからusernameだけを取得
    const t = await Tweet.find({}).populate('user', 'username')  // Userからusernameだけを取得
    console.log(t)
}

findTweet()