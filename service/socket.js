const Friends = require('../db/friends')

module.exports = function (io) {

    const users = {}

    io.on('connection', socket => {
        // console.log(`客户端连接成功`);

        // 用户登录注册
        socket.on('login', id => {
            console.log(`id`, id);
            socket.emit('login', socket.id)
            socket.name = id;
            users[id] = socket.id
            console.log(`当前进入链接的用户`, users)
        })

        socket.on('chat message', (msg, fromId, toId) => {
            console.log(`msg`, msg, fromId, toId);
            console.log(socket.id);
            socket.to(users[toId]).emit('chat message', msg, fromId);
            // socket.emit('chat message', msg);

            // 保存最新消息到消息列表
            saveMsg(msg, fromId, toId);
        })
        socket.on('disconnect', () => {
            if (users.hasOwnProperty(socket.name)) {
                delete users[socket.name]
            }
            console.log(`断开连接了`);
        })
    })

    // 保存最新消息到消息列表
    const saveMsg = async (msg, fromId, toId) => {

        // 修改对应的值
        await Friends.updateOne({ 'fromid': toId, 'toIds.toId': fromId }, { $set: { 'toIds.$.newMsg': msg } })
            .then(res => {
                console.log(`socket修改成功`, res);
            })
            .catch(error => {
                console.log(`查询报错`, error)
            })
    }
}
