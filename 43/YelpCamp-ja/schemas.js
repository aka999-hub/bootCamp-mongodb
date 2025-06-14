// YelpCamp-ja/schemas.js

const Joi = require('joi')

// joiで使用するスキーマ
module.exports. campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),         // title はString型、必須
        price: Joi.number().required().min(0),  // price はNumber型、必須、0以上
        image: Joi.string().required(),         // image はString型、必須
        location: Joi.string().required(),      // location はString型、必須
        description: Joi.string().required(),   // description はString型、必須
    }).required()                               // campground はオブジェクト、必須
})
