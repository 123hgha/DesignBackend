const mongoose = require('mongoose')

// 用户关联表
const recordsSchema = new mongoose.Schema({
    fromId: String, // 发送用户id
    toId: String, // 接收用户id
    dateTime: String, // 发送时间
    message: String, // 发送内容
});

// 使用规则创建集合
const Records = mongoose.model('records', recordsSchema);

module.exports = Records