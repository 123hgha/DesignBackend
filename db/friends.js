const mongoose = require('mongoose')

// 用户关联表
const friendsSchema = new mongoose.Schema({
    fromId: String, // 关注用户id
    toIds: Array, // 被关注用户id
    newMsg: String // 接收到的最新消息
});

// 使用规则创建集合
const Friends = mongoose.model('friends', friendsSchema);

module.exports = Friends
