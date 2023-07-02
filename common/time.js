// 格式化剩余时间方法
function changeTime(time) {
    let unit = '秒'
    let newTime = time / 1000  // 秒
    if (newTime > 60) {
        newTime = newTime / 60 // 分
        unit = '分钟'
        if (newTime > 60) {
            newTime = newTime / 60  // 时
            unit = '个小时'
            if (newTime > 24) {
                newTime = newTime / 24 // 天
                unit = '天'
            }
        }
    }
    // console.log(`>>>`, newTime);
    return Math.floor(newTime) + unit + '前'
}

module.exports = {
    changeTime
}