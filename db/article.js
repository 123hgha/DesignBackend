const mongoose = require('mongoose')

// 文章表
const articleSchema = new mongoose.Schema({
    cover: String, // 封面
    title: String, // 标题
    subtitle: String, // 副标题
    authId: String, // 作者id
    kind: String, // 所属类型
    text: String, // 内容
    img: String, // 插图
    comment: String, // 评论id
    commentNum: Number, // 评论数量
    creatTime: String, // 创建时间
    agree: Number, // 好评
    disagree: Number, // 差评
    state: Number, // 文章当前状态：0 未删除 1 已删除
    // authId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'users'
    // }
    auther: Object, // 作者信息
});

// 使用规则创建集合
const Article = mongoose.model('articles', articleSchema);

module.exports = Article
