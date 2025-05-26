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

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 10
    },
    price: {
        type: Number,
        required: true,
        min: [0, "priceは0より大きい値にしてください"]
    },
    onSale: {
        type: Boolean,
        default: false
    },
    categories: [String],
    qty: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        }
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L']
    }
})


// インスタンスメソッド ----------------------------
// アロー関数にするとthisが代わるので、functionにする
// productSchema.methods.greet = function() {
//     console.log(`ハロー！！、ヤッホー！！`)
//     console.log(`- ${this.name} からの呼び出し`)
// }


// onSale を切り替えて保存する
productSchema.methods.toggleOnsale = function() {
    // this には Product のインスタンスが入る
    this.onSale = !this.onSale
    return this.save()
}

// カテゴリーを追加する
productSchema.methods.addCategory = function(newCat) {
    this.categories.push(newCat)
    return this.save()
}
// インスタンスメソッド ----------------------------

// staticメソッド ----------------------------
productSchema.statics.fireSale = function() {
    return this.updateMany({}, {onSale: true, price: 0})
}
// staticメソッド ----------------------------


// collection は Product
const Product = mongoose.model('Product', productSchema)


// インスタンスメソッド ----------------------------
const findProduct = async () => {
    const foundProduct = await Product.findOne({name: 'マウンテンバイク'})
    // foundProduct.greet()

    console.log(foundProduct)
    await foundProduct.toggleOnsale()
    console.log(foundProduct)
    await foundProduct.addCategory('アウトドア')
    console.log(foundProduct)
}

// // findProduct() 呼び出し
// findProduct()
// インスタンスメソッド ----------------------------

// staticメソッド ----------------------------
Product.fireSale().then(msg => console.log(msg))
// staticメソッド ----------------------------



// const bike = new Product({
//     name: 'ジャージ',
//     price: 2980,
//     categories: ['サイクリング'],
//     size: 'XS'
// })

// bike.save()
//     .then(data => {
//         console.log('成功!!!')
//         console.log(data)
//     })
//     .catch(err => {
//         console.log('エラー!!!')
//         // console.log(err.errors.name.properties.message)
//         // console.log(err.errors)
//         console.log(err)
//     })

// // priceをマイナス値で更新 & 更新後のデータ取得
// Product.findOneAndUpdate({name: '空気入れ'}, {price: -1980}, {new: true, runValidators: true})
//     .then(data => {
//         console.log('成功!!!')
//         console.log(data)
//     })
//     .catch(err => {
//         console.log('エラー!!!')
//         // console.log(err.errors.name.properties.message)
//         // console.log(err.errors)
//         console.log(err)
//     })