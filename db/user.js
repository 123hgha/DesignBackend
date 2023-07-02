const mongoose = require('mongoose')

// 用户表
const userSchema = new mongoose.Schema({
    username: String,  // 用户名
    password: String,  // 密码
    age: Number,       // 年龄
    address: String,   // 地址
    email: String,     // 邮箱
    createTime: String, // 创建时间
    avatar: String,     // 头像
    sign: String        // 签名
});


// 使用规则创建集合
const User = mongoose.model('users', userSchema);

module.exports = User
