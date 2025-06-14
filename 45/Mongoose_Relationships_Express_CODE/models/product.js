// Mongoose_Relationships_Express_CODE/models/products.js

const mongoose = require('mongoose')
const { Schema } = mongoose

// スキーマ：productSchemaを作成
const productSchema = new Schema({
    name: {
        type: String,
        required: [true, '商品名は必須です']
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['果物', '野菜', '乳製品']
    },
    // Farmモデルの参照
    farm: {
        type: Schema.Types.ObjectId,
        ref: 'Farm'
    }
})

// モデル：Productを作成
const Product = mongoose.model('Product', productSchema)

// モデル：Productをエクスポート
module.exports = Product