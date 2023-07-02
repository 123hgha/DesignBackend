// 文件存储设置

// 引入附件上传
const multer = require('multer')

// 参数说明
// diskStorage：存储位置设置
// filename：存储名称设置

// 文章封面插图
const Covers = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data/articlesCovers')
    },
    filename: function (req, file, cb) {
        let type = file.originalname.replace(/.+\./, ".")
        cb(null, file.fieldname + '-' + Date.now() + type)
    }
})
const uploadCovers = multer({ storage: Covers })

// 文章内容插图
const Contents = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data/articlesContents')
    },
    filename: function (req, file, cb) {
        let type = file.originalname.replace(/.+\./, ".")
        cb(null, file.fieldname + '-' + Date.now() + type)
    }
})
const uploadContents = multer({ storage: Contents })

// 用户头像
const Avatar = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data/avatar')
    },
    filename: function (req, file, cb) {
        let type = file.originalname.replace(/.+\./, ".")
        cb(null, file.fieldname + '-' + Date.now() + type)
    }
})
const uploadAvatar = multer({ storage: Avatar })

module.exports = {
    uploadCovers,
    uploadContents,
    uploadAvatar
}