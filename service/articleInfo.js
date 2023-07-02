const Article = require('../db/article')
// const multer = require('multer')
const time = require('../common/time')

// 获取文章信息
exports.getArticleInfo = async (req, res) => {
    console.log(req.body, `接收的请求参数`);
    let param = req.body // 请求的参数
    let article = []
    // 获取所有文章内容
    await Article.find({ limit: param.limit, state: param.state })
        .then((res) => {
            // console.log(`查询到的数据`, res)
            article = [...res]
        })

    // 设置时间
    const nowTime = Date.now();
    for (let i of article) {
        let artTime = new Date(i.creatTime).getTime();
        artTime = nowTime - artTime;
        i.creatTime = time.changeTime(artTime);
    }
    
    let hasMore = true
    if (article.length <= 10) {
        hasMore = false
    }
    res.send({
        status: 0,
        message: '获取所有文章信息成功！',
        data: article,
        hasMore
    })
}

