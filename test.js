const mongoose = require('mongoose');  // 引入模块

// 链接数据库
mongoose
    .connect('mongodb://localhost/GameSocial')
    .then(() => console.log('数据库连接成功'))
    .catch((err) => console.log(`数据库连接失败`, err))

// 创建集合规则
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    age: Number,
});

// 使用规则创建集合
const User = mongoose.model('user', userSchema);

// User.find().then((res) => console.log(`全部`, res))

User.create({ username: '九阳神功', password: '斗酒僧', age: 18 },
    (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            console.log(doc);
        }
    }
)