const mongoose = require('mongoose')

// 评论---文章-评论用户关联表
const commentSchema = new mongoose.Schema({
    articleId: String, // 文章id
    userId: String, // 操作人id
    userName: String, // 操作人名称
    avatar: String, // 操作人头像
    text: String, // 评论内容
    creatTime: String, // 创建时间
});

// 使用规则创建集合
const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment
