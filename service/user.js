const User = require('../db/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

// 注册用户的处理函数
exports.regUser = async (req, res) => {
    const userInfo = req.body
    console.log(`拿到的用户注册数据`, userInfo);

    // 判断用户名是否被占用
    let users = {}
    await User.find({ username: userInfo.username })
        .then((res) => {
            console.log(`查询到的数据`, res)
            users = res[0]
        })
    if (users) {
        return res.status('用户名被占用，请更换其他用户名')
    } else {
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)
        User.create(userInfo)
            .then((doc) => {
                console.log(`插入数据成功`, doc);
            })
            .catch((err) => {
                console.log(`数据库插入报错`, err)
                return res.status('用户注册失败，请稍后再试！')
            })
        res.status('注册成功！', 0)
    }
}

// 登录的处理函数
exports.login = async (req, res) => {

    const userInfo = req.body
    // 判断是否存在该用户
    let user = {}
    await User.find({ username: userInfo.username })
        .then((res) => {
            console.log(`查询到的数据`, res)
            user = { ...res[0]._doc }
        })
    if (user === {}) return res.status('登录失败')

    // 密码比较
    const compareResult = bcrypt.compareSync(userInfo.password, user.password)

    if (!compareResult) {
        console.log(`用户与密码不一致，登录失败`)
        return res.status('账户与密码不一致，登录失败！')
    }
    user.password = ''

    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
        expiresIn: '24h',
    })

    // console.log(`生成的token`, tokenStr)
    res.send({
        status: 0,
        message: '登录成功！',
        // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
        token: 'Bearer ' + tokenStr,
        data: {
            ...user
        }
    })
}
