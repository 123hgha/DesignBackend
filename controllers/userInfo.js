// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入上传配置
const upload = require('../common/upload')

// 导入用户信息的处理函数模块
const userinfo_handler = require('../service/userInfo')

// 获取用户的基本信息
router.post('/getUserinfo', userinfo_handler.getUserInfo)

// 更新用户的基本信息
router.post('/updateUserinfo', userinfo_handler.updateUserInfo)

// 上传用户头像
router.post('/uploadAvatar', upload.uploadAvatar.single('avatar'), userinfo_handler.uploadAvatar)

// 重置密码的路由
router.post('/updatepwd', userinfo_handler.updatePassword)

// 获取指定用户编辑的文章信息
router.post('/getUserArticle', userinfo_handler.getUserArticle)

// 模糊搜索用户
router.post('/dimGetUser', userinfo_handler.dimGetUser)

// 判断当前用户的聊天列表中是否存在
router.post('/initiateChat', userinfo_handler.initiateChat)

// 获取当前用户聊天列表
router.post('/getUsersHasFriends', userinfo_handler.getUsersHasFriends)

// 获取用户历史聊天记录
router.post('/getOldMsg', userinfo_handler.getOldMsg)

// 保存新的聊天记录
router.post('/saveMsg', userinfo_handler.saveMsg)

// 向外共享路由对象
module.exports = router