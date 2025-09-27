// YelpCamp-ja/schemas.js

const Joi = require('joi')

// joiで使用するスキーマ（キャンプ場のデータの形式）を定義
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),         // title はString型、必須
        price: Joi.number().required().min(0),  // price はNumber型、必須、0以上
        image: Joi.string().required(),         // image はString型、必須
        location: Joi.string().required(),      // location はString型、必須
        description: Joi.string().required(),   // description はString型、必須
    }).required()                               // campground はオブジェクト、必須
})

// joiで使用するスキーマ（レビューのデータの形式）を定義
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),  // rating はNumber型、必須、1以上5以下
        body: Joi.string().required()                   // body はString型、必須    
    }).required()
})
