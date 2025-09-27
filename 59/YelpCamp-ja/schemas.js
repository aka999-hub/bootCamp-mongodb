// YelpCamp-ja/schemas.js

// const Joi = require('joi');
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                    return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

// joiで使用するスキーマ（キャンプ場のデータの形式）を定義
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),         // title はString型、必須
        price: Joi.number().required().min(0),  // price はNumber型、必須、0以上
        // image: Joi.string().required(),         // image はString型、必須
        location: Joi.string().required().escapeHTML(),      // location はString型、必須
        description: Joi.string().required().escapeHTML(),   // description はString型、必須
    }).required(),                              // campground はオブジェクト、必須
    deleteImages: Joi.array()                   // deleteImages は配列、任意
})

// joiで使用するスキーマ（レビューのデータの形式）を定義
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),  // rating はNumber型、必須、1以上5以下
        body: Joi.string().required().escapeHTML()                   // body はString型、必須    
    }).required()
})