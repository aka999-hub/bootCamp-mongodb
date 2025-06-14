// Mongoose_Relationships_Express_CODE/models/farm.js

const mongoose = require('mongoose')
const { Schema } = mongoose
const Product = require('./product')

// スキーマ：farmSchemaを作成
const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, 'nameが必要です']
    },
    city: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'emailが必要です']
    },
    // Productモデルの参照
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
})

farmSchema.post('findOneAndDelete', async function(farm) {
//    console.log('POST middleware')
//    console.log(farm)
    if (farm.products.length) {
        const res = await Product.deleteMany({_id: { $in: farm.products }})
        console.log(res)
    }
})


// モデル：Farmを作成
const Farm = mongoose.model('Farm', farmSchema)

// モデル：Farmをエクスポート
module.exports = Farm