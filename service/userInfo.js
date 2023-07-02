const User = require('../db/user')
const bcrypt = require('bcryptjs')
const Article = require('../db/article')
const ObjectId = require('mongodb').ObjectId
const Records = require('../db/records')
const Friends = require('../db/friends')

// 时间格式化
const time = require('../common/time')

// 排序
const sortObjValue = require('../common/sortObjValue')

// 获取用户基本信息的处理函数
exports.getUserInfo = async (req, res) => {
    // console.log(req.auth)
    let user = req.body
    console.log(user);
    await User.find({ _id: new ObjectId(user._id) })
        .select('username age address email createTime avatar sign')
        .then((res) => {
            console.log(`查询到的数据`, res)
            user = res[0]
        })

    if (!user) return res.status('获取用户信息失败！')

    // 清除密码
    delete user.password

    res.send({
        status: 0,
        message: '获取用户基本信息成功！',
        data: user,
    })
}

// 更新用户基本信息的处理函数
exports.updateUserInfo = async (req, res) => {
    let user = req.body

    await User.updateOne({ _id: new ObjectId(user.id) },
        { $set: { ...user } },
    )
        .then((res) => {
            console.log(`更新成功！`, res)
        })

    // 修改用户信息成功
    return res.status('修改用户基本信息成功！', 0)
}

// 上传用户头像
exports.uploadAvatar = async (req, res) => {
    // let data = req.file;
    console.log(req.file);
    let imgUrl = 'http://127.0.0.1:80/data/avatar/' + req.file.filename
    // console.log(`url地址`, + imgUrl);

    res.send(imgUrl)
}

// 重置密码的处理函数
exports.updatePassword = async (req, res) => {
    let user = {}
    await User.find({ _id: req.auth._id })
        .then((res) => {
            console.log(`查询到的数据`, res)
            user = res[0]
        })

    if (!user) return res.status('用户不存在！')

    // 判断提交的旧密码是否正确
    const compareResult = bcrypt.compareSync(req.body.oldPwd, user.password)
    if (!compareResult) return res.status('原密码错误！')

    // 新密码进行 bcrypt 加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

    // 更新密码
    await User.updateOne({ _id: req.auth._id },
        { $set: { password: newPwd } },
    )
        .then((res) => {
            console.log(`更新密码成功！`)
        })

    // 修改用户信息成功
    return res.status('更新密码成功！', 0)
}

// 获取指定用户创建的文章内容
exports.getUserArticle = async (req, res) => {
    console.log(req.body, `接收的请求参数`);
    let param = req.body // 请求的参数
    let article = []
    let auther = {}

    // 获取所有文章内容
    await Article.find({ state: param.state, authId: param.id })
        // await Article.find({ state: param.state, authId: new ObjectId(param.id) })
        // .populate('authId')
        .then(res => {
            console.log(`查询到的数据`, res)
            article = [...res]
        })

    // 查询文章作者信息
    await User.findOne({ _id: new ObjectId(param.id) })
        .then(res => {
            console.log(`作者`, res);
            auther = res
        })

    // 设置时间
    const nowTime = Date.now();
    for (let i of article) {
        let artTime = new Date(i.creatTime).getTime();
        artTime = nowTime - artTime;
        i.creatTime = time.changeTime(artTime);
        i.auther = auther
    }

    res.send({
        status: 0,
        message: '获取所有文章信息成功！',
        data: article
    })
}

// 模糊查询用户姓名
exports.dimGetUser = async (req, res) => {
    let param = req.body // 请求的参数 
    let reg = new RegExp('^.*' + param.text + '.*$')

    let users = [];
    // 查询模糊搜索条件下的用户信息
    await User.find({ username: reg })
        .select('username age address')
        .then(res => {
            console.log(`查询到的数据`, res)
            users = [...res]
        })

    // 过滤当前登陆人信息
    for (let i in users) {
        if (users[i].username === param.user.username) {
            users.splice(i, 1)
        }
    }

    res.send({
        status: 0,
        message: '搜索用户信息成功！',
        data: users
    })
}

// 向用户发起聊天
exports.initiateChat = async (req, res) => {
    let param = req.body // 请求的参数 
    console.log(param);
    let friendsList = [] // 用来存储查询到的当前用户的聊天列表
    let flag = true // 判断用户是否有存在这张表中

    await Friends.findOne({ fromId: param.userId })
        .then(res => {
            if (res) { friendsList = [...res.toIds] }
            else flag = false
            console.log(`查询到的数据`, res)
        })
        .catch(error => {
            console.log(`查询报错`, error)
        })

    // 表中没有保存当前用户的信息
    if (flag === false) {
        let obj = {
            fromId: param.userId,
            toIds: [{ toId: param.toId, toName: param.toName, newMsg: '快来和新的小伙伴打招呼吧！' }]
        }
        await Friends.create(obj)
            .then(res => {
                console.log(`添加成功`, res)
            })
            .catch(error => {
                console.log(`添加失败`, error)
            })
    } else {
        // 被聊天用户不存在当前用户聊天列表中
        console.log(`当前用户的聊天列表`, friendsList, param.toId);
        let isAdd = friendsList.some((value) => {
            return param.toId === value
        })
        if (!isAdd) {
            await Friends.updateOne({ fromId: param.userId }, { $push: { toIds: { toId: param.toId, toName: param.toName, newMsg: '快来和新的小伙伴打招呼吧！' } } })
                .then(res => {
                    console.log(`添加成功`, res)
                })
                .catch(error => {
                    console.log(`添加失败`, error)
                })
        }
    }

    res.send();
}

// 获取当前用户聊天列表
exports.getUsersHasFriends = async (req, res) => {

    let param = req.body // 请求的参数

    console.log(param);

    let list = []

    await Friends.findOne({ fromId: param.id })
        .then(res => {
            console.log(`查询到的数据`, res)
            if (res.toIds) list = res.toIds
        })
        .catch(error => {
            console.log(`查询报错`, error)
        })

    res.send({
        status: 0,
        message: '查询聊天列表成功！',
        data: list
    })
}

// 获取历史聊天记录
exports.getOldMsg = async (req, res) => {

    let param = req.body // 请求的参数
    console.log(param);

    let msg = []
    await Records.find({ fromId: param.useId, toId: param.friendId })
        .then(res => {
            console.log(`查询到的数据`, res)
            msg = [...res]
        })
        .catch(error => {
            console.log(`查询报错`, error)
        })

    await Records.find({ fromId: param.friendId, toId: param.useId })
        .select('fromId toId dateTime message')
        .then(res => {
            console.log(`查询到的数据`, res)
            msg = [...msg, ...res]
        })
        .catch(error => {
            console.log(`查询报错`, error)
        })

    // 排序
    msg.sort(sortObjValue.objSort('dateTime'));

    console.log(`排序后的值`, msg);

    res.send({
        status: 0,
        message: '获取聊天信息成功！',
        msg
    })
}

// 保存新的聊天记录
exports.saveMsg = async (req, res) => {

    let param = req.body // 请求的参数

    console.log(`聊天记录`, param.message);

    await Records.create(param.message)
        .then(res => {
            console.log(`添加成功`, res)
        })
        .catch(error => {
            console.log(`添加失败`, error)
        })

    res.send({
        status: 0,
        message: '记录保存成功！'
    })
}