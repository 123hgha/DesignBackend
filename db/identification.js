const mongoose = require('mongoose')

// 点赞---文章-点赞用户关联表
const identificationSchema = new mongoose.Schema({
    articleId: String, // 文章id
    userId: String, // 操作人id
    beAgree: Boolean, // 
});

// 使用规则创建集合
const Identification = mongoose.model('identification', identificationSchema);

module.exports = Identification
