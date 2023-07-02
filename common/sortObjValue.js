// 根据某一对象的值排序数组
function objSort(value) {
    return function (i, j) {
        let f = i[value];
        let s = j[value];
        return f - s
    }
}

module.exports = {
    objSort
}