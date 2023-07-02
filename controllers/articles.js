// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入上传配置
const upload = require('../common/upload')

// // 附件上传
// const multer = require('multer')

const articles_handler = require('../service/articles')


// 新增文章
router.post('/addArticle', articles_handler.add)

// 修改文章
router.post('/updateArticle', articles_handler.update)

// 删除文章
router.post('/deleteArticle', articles_handler.delete)

// 搜索文章
router.post('/selectArticle', articles_handler.select)

// 点赞文章
router.post('/identification', articles_handler.identification)

// 发表评论
router.post('/sendComment', articles_handler.sendComment)

// 获取评论
router.post('/getComments', articles_handler.getComments)

// 上传文章封面
router.post('/uploadCover', upload.uploadCovers.single('cover'), articles_handler.uploadCover)

// 上传文章内容
router.post('/uploadContents', upload.uploadContents.single('arcImg'), articles_handler.uploadContents)

module.exports = router