const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const userHandler = require('../service/user')

// 数据校验
const expressJoi = require('@escook/express-joi')
const { reg_login_schema } = require('../schema/user')

// 注册新用户
router.post('/reguser', userHandler.regUser)

// 登录
router.post('/login', expressJoi(reg_login_schema), userHandler.login)

module.exports = router