// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()

const articleInfo_handler = require('../service/articleInfo')

// 获取文章信息内容
router.post('/articleInfo', articleInfo_handler.getArticleInfo)

module.exports = router