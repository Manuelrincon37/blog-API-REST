const { Schema, model } = require("mongoose")

const ArticleSchema = Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    img: {
        type: String,
        defautl: "default.png"
    }
})

module.exports = model("Article", ArticleSchema, "articles")
