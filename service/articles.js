const Article = require('../db/article')
const User = require('../db/user')
const Identification = require('../db/identification')
const Comment = require('../db/comment')
const ObjectId = require('mongodb').ObjectId
const time = require('../common/time')

// 新增文章
exports.add = async (req, res) => {
    const article = req.body
    console.log(`article`, article);

    // 校验
    let oldArt = []
    let flag = true;
    await Article.find()
        .then((doc) => {
            console.log(`查询到的所有数据`, doc);
            oldArt = [...doc]
        })
    // console.log(`>>>>`, oldArt);
    // 判断标题和副标题是否已经有重复的
    for (const i of oldArt) {
        if (article.title === i.title && article.subtitle === i.subtitle) flag = false
    }
    if (flag) {
        // 设置创建时间
        article.creatTime = new Date();
        // 设置文章状态：0 发布 1 删除
        article.state = 0
        // 设置好评差评
        article.agree = 0;
        article.disagree = 0;
        // 评论数
        article.commentNum = 0;
        // 添加文章
        await Article.create(article)
            .then((doc) => {
                console.log(`插入数据成功`, doc);
            })
            .catch((err) => {
                console.log(`数据库插入报错`, err)
                return res.status('文章新增失败，请稍后再试！')
            })
        res.status('添加成功！', 0)
    } else {
        res.status('文章的标题或副标题重复，请重新输入！')
    }

}

// 修改文章
exports.update = async (req, res) => {
    // todo
    console.log(`update`);
}

// 删除文章
exports.delete = async (req, res) => {
    // todo
    console.log(`delete`);
}

// 查看文章
exports.select = async (req, res) => {

    console.log(`>>`, req.body);

    const id = req.body.id
    let article = {}

    // 查询文章
    await Article.findOne({ _id: new ObjectId(id) })
        .then(doc => {
            console.log(`查询到的所有数据`, doc);
            article = doc;
        }).catch(error => {
            res.status(error + '查询文章失败！')
        })

    // 设置时间
    const nowTime = Date.now();
    let artTime = new Date(article.creatTime).getTime();
    artTime = nowTime - artTime;
    article.creatTime = time.changeTime(artTime);

    // 查询作者信息
    await User.findOne({ _id: new ObjectId(article.authId) })
        .then(doc => {
            article.auther = doc
        }).catch(error => {
            res.status(error + '查询作者失败！')
        })
    article.auther.password = ''

    let beAgree = false;
    // 查询用户与文章的关联信息（点赞）
    if (req.body.user) {
        await Identification.findOne({ userId: req.body.user._id })
            .then(doc => {
                console.log(`查询到的点赞信息`, doc);
                beAgree = doc.beAgree;
            }).catch(error => {
                console.log(`查询失败！`, error);
            })
    }

    res.send({
        status: 0,
        message: '查询成功！',
        data: article,
        beAgree
    })

}

// 点赞
exports.identification = async (req, res) => {

    const info = req.body
    console.log(`点赞`, info);

    let result = undefined;
    let article = undefined;

    // 先查看库里有没有这条数据
    await Identification.findOne({ articleId: info.articleId, userId: info.userId })
        .then(doc => {
            console.log(`查询到的所有数据`, doc);
            result = doc
        })

    // 查询文章-获取点赞数
    await Article.findOne({ _id: new ObjectId(info.articleId) })
        .then(doc => {
            console.log(`查询到的文章内容`, doc);
            article = doc;
        }).catch(error => {
            res.status(error + '查询文章失败！')
        })

    // 点赞数
    let flag = article.agree;

    if (result !== null) {
        // 有，查看状态，取反
        console.log(`有`);
        // 将数据取反
        result.beAgree = !result.beAgree
        // 查找这篇文章，修改点赞总数
        // 判断是点赞还是取消点赞

        console.log(`article.agree`, result.beAgree);
        if (result.beAgree) {
            console.log(`用户点赞`, result.beAgree);
            // 点赞
            flag = flag + 1;
        } else if (!result.beAgree && flag > 0) {
            console.log(`用户取消点赞`, result.beAgree);
            flag = flag - 1;
        }

        // 往关联表修改数据
        await Identification.updateOne({ articleId: info.articleId }, { $set: { beAgree: result.beAgree } })
            .then(doc => {
                console.log(`更新的数据`, doc);
                // res.send({
                //     status: 0,
                //     message: '更新成功！',
                //     data: result.beAgree,
                //     agree: flag,
                // })
            })
    } else {
        // 没有，新增一条数据
        flag = flag + 1;
        info.beAgree = true;
        delete info.operate;
        console.log(`没有`);
        await Identification.create(info)
            .then(doc => {
                console.log(`数据插入成功！`, doc);
                // res.status('添加成功！', 0)
            }).catch(doc => {
                console.log(`数据插入失败！`, doc);
                // res.status('添加失败！')
            })
    }

    // 修改文章的点赞数
    await Article.updateOne({ _id: new ObjectId(info.articleId) }, { $set: { agree: flag } })
        .then(doc => {
            console.log(`文章点赞数增加成功！`, doc);
        }).catch(doc => {
            console.log(`文章点赞数增加失败！`, doc);
        })
    res.send({
        status: 0,
        message: '更新成功！',
        data: result.beAgree,
        agree: flag,
    })
}

// 获取评论
exports.getComments = async (req, res) => {
    console.log(req.body);
    const articleId = req.body;
    let article = undefined;
    let comments = undefined;

    // 获取当前文章的评论数
    // 查询文章
    await Article.findOne({ _id: new ObjectId(articleId) })
        .then(doc => {
            console.log(`查询到的所有数据`, doc);
            article = doc
        }).catch(error => {
            console.log(`查询出错`, error);
        })
    // 查询当前文章全部评论
    await Comment.find({ articleId: new ObjectId(articleId) })
        .then(doc => {
            console.log(`查询到的所有评论`, doc);
            comments = doc
        }).catch(error => {
            console.log(`查询出错`, error);
        })

    // 设置时间
    const nowTime = Date.now();
    for (let i of comments) {
        let artTime = new Date(i.creatTime).getTime();
        artTime = nowTime - artTime;
        i.creatTime = time.changeTime(artTime);
    }

    res.send({
        status: 0,
        article,
        comments
    })
}

// 发送评论
exports.sendComment = async (req, res) => {
    const info = req.body
    let flag = true

    // 查找用户的头像
    await User.findOne({ _id: new ObjectId(info.userId) })
        .select('avatar')
        .then((res) => {
            console.log(`查询到的数据`, res)
            info.avatar = res.avatar
        })
    info.creatTime = new Date();
    // 添加评论
    await Comment.create(info)
        .then((doc) => {
            console.log(`插入数据成功`, doc);
        })
        .catch((err) => {
            flag = false
            console.log(`数据库插入报错`, err)
        })

    let commentNum = 0;
    if (flag) {
        // 文章添加评论数
        // 查询文章
        await Article.findOne({ _id: new ObjectId(info.articleId) })
            .then(doc => {
                console.log(`查询到的所有数据`, doc);
                commentNum = doc.commentNum + 1;
            }).catch(error => {
                res.status(error + '查询文章失败！')
            })

        // 修改评论数
        await Article.updateOne({ _id: new ObjectId(info.articleId) }, { $set: { commentNum: commentNum } })
            .then(doc => {
                console.log(`评论数修改成功`, doc);
            }).catch(error => {
                console.log(`评论数修改失败`, error);
            })
    }

    res.send({
        status: 0,
        flag,
        commentNum
    })
}

// 上传封面图片
exports.uploadCover = async (req, res) => {
    // let data = req.file;
    console.log(req.file);
    let imgUrl = 'http://127.0.0.1:80/data/articlesCovers/' + req.file.filename
    // console.log(`url地址`, + imgUrl);
    res.send(imgUrl)
}

// 上传内容图片
exports.uploadContents = async (req, res) => {
    let imgUrl = 'http://127.0.0.1:80/data/articlesContents/' + req.file.filename
    res.send(imgUrl)
}


