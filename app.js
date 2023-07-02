const express = require('express')

const app = express()

const joi = require('joi')

const bodyParser = require('body-parser')

const path = require("path");

// 跨域问题
const cors = require('cors')
app.use(cors())

// 数据库连接
require('./db/conn')

app.use('/data', express.static('data'))

// 解析 application/x-www-form-urlencoded 格式的表单数据的中间件
// app.use(express.urlencoded({ extended: false }))
// 解析 JSON
app.use(bodyParser.urlencoded({ extended: false }))

// 解析post参数
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 统一处理返回的状态
app.use(function (req, res, next) {
    res.status = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 解析 Token 中间件
const { expressjwt: expressJWT } = require("express-jwt");
const config = require('./config')

// app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }))

// 用户登录注册
const userRouter = require('./controllers/user')
app.use('/api', userRouter)

// 用户信息获取修改
const userinfoRouter = require('./controllers/userInfo')
app.use('/my', userinfoRouter)

// 文章信息获取
const articleRouter = require('./controllers/articleInfo')
app.use('/article', articleRouter)

// 文章增删改查
const articlesRouter = require('./controllers/articles')
app.use('/articles', articlesRouter)

// 实时通信
const server = app.listen(8002);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "*",
        // methods: ["GET", "POST"]
    }
})

require('./service/socket')(io)

// 错误中间件
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.status(err)
    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.status('身份认证失败！')
    // 未知错误
    res.status(err)
})

app.listen(80, function () {
    console.log('api server running at http://127.0.0.1:80')
})