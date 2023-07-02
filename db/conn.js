const Mongoose = require('mongoose')

// 链接数据库
Mongoose
    .connect('mongodb://localhost/GameSocial')
    .then(() => console.log('数据库连接成功'))
    .catch((err) => console.log(`数据库连接失败`, err))