import BigNumber from "bignumber.js"
import { SHA256 } from "crypto-js"
import cache from "./cache"

/** 通用脱敏 */
export function desensitization(str, beginLen, endLen) {
    var tempStr = ""

    var len = str.length

    var firstStr = str.substr(0, beginLen)

    var lastStr = str.substr(endLen)

    var middleStr = str
        .substring(beginLen, len - Math.abs(endLen))
        .replace(/[\s\S]/gi, "*")

    tempStr = firstStr + middleStr + lastStr

    return tempStr
}

/**
 * 通用js方法封装處理
 * Copyright (c) 2019 ruoyi
 */

// 日期格式化
export function parseTime(time, pattern) {
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}"
    let date
    if (typeof time === "object") {
        date = time
    } else {
        if (typeof time === "string" && /^[0-9]+$/.test(time)) {
            time = parseInt(time)
        } else if (typeof time === "string") {
            time = time
                .replace(new RegExp(/-/gm), "/")
                .replace("T", " ")
                .replace(new RegExp(/\.[\d]{3}/gm), "")
        }
        if (typeof time === "number" && time.toString().length === 10) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === "a") {
            return ["日", "一", "二", "三", "四", "五", "六"][value]
        }
        if (result.length > 0 && value < 10) {
            value = "0" + value
        }
        return value || 0
    })
    return time_str
}

// 表單更新
export function resetForm(refName) {
    if (this.$refs[refName]) {
        this.$refs[refName].resetFields()
    }
}

// 新增日期范围
export function addDateRange(params, dateRange, propName) {
    let search = params
    search.params =
        typeof search.params === "object" &&
        search.params !== null &&
        !Array.isArray(search.params)
            ? search.params
            : {}
    dateRange = Array.isArray(dateRange) ? dateRange : []
    if (typeof propName === "undefined") {
        search.params["beginTime"] = dateRange[0]
        search.params["endTime"] = dateRange[1]
    } else {
        search.params["begin" + propName] = dateRange[0]
        search.params["end" + propName] = dateRange[1]
    }
    return search
}

// 回显数据字典
export function selectDictLabel(datas, value) {
    if (value === undefined) {
        return ""
    }
    var actions = []
    Object.keys(datas).some((key) => {
        if (datas[key].value == "" + value) {
            actions.push(datas[key].label)
            return true
        }
    })
    if (actions.length === 0) {
        actions.push(value)
    }
    return actions.join("")
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
    if (value === undefined) {
        return ""
    }
    var actions = []
    var currentSeparator = undefined === separator ? "," : separator
    var temp = value.split(currentSeparator)
    Object.keys(value.split(currentSeparator)).some((val) => {
        var match = false
        Object.keys(datas).some((key) => {
            if (datas[key].value == "" + temp[val]) {
                actions.push(datas[key].label + currentSeparator)
                match = true
            }
        })
        if (!match) {
            actions.push(temp[val] + currentSeparator)
        }
    })
    return actions.join("").substring(0, actions.join("").length - 1)
}

// 字符串格式化(%s )
export function sprintf(str) {
    var args = arguments,
        flag = true,
        i = 1
    str = str.replace(/%s/g, function () {
        var arg = args[i++]
        if (typeof arg === "undefined") {
            flag = false
            return ""
        }
        return arg
    })
    return flag ? str : ""
}

// 转换字符串，undefined,null等转化为""
export function parseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
        return ""
    }
    return str
}

// 数据合并
export function mergeRecursive(source, target) {
    for (var p in target) {
        try {
            if (target[p].constructor == Object) {
                source[p] = mergeRecursive(source[p], target[p])
            } else {
                source[p] = target[p]
            }
        } catch (e) {
            source[p] = target[p]
        }
    }
    return source
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
    let config = {
        id: id || "id",
        parentId: parentId || "parentId",
        childrenList: children || "children",
    }

    var childrenListMap = {}
    var nodeIds = {}
    var tree = []

    for (let d of data) {
        let parentId = d[config.parentId]
        if (childrenListMap[parentId] == null) {
            childrenListMap[parentId] = []
        }
        nodeIds[d[config.id]] = d
        childrenListMap[parentId].push(d)
    }

    for (let d of data) {
        let parentId = d[config.parentId]
        if (nodeIds[parentId] == null) {
            tree.push(d)
        }
    }

    for (let t of tree) {
        adaptToChildrenList(t)
    }

    function adaptToChildrenList(o) {
        if (childrenListMap[o[config.id]] !== null) {
            o[config.childrenList] = childrenListMap[o[config.id]]
        }
        if (o[config.childrenList]) {
            for (let c of o[config.childrenList]) {
                adaptToChildrenList(c)
            }
        }
    }
    return tree
}

/**
 * 參數處理
 * @param {*} params  參數
 */
export function tansParams(params) {
    let result = ""
    for (const propName of Object.keys(params)) {
        const value = params[propName]
        var part = encodeURIComponent(propName) + "="
        if (value !== null && typeof value !== "undefined") {
            if (typeof value === "object") {
                for (const key of Object.keys(value)) {
                    if (
                        value[key] !== null &&
                        typeof value[key] !== "undefined"
                    ) {
                        let params = propName + "[" + key + "]"
                        var subPart = encodeURIComponent(params) + "="
                        result += subPart + encodeURIComponent(value[key]) + "&"
                    }
                }
            } else {
                result += part + encodeURIComponent(value) + "&"
            }
        }
    }
    return result
}

// 验证是否为blob格式
export async function blobValidate(data) {
    try {
        const text = await data.text()
        JSON.parse(text)
        return false
    } catch (error) {
        return true
    }
}

// 获取UUID
export function getUuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8
            return v.toString(16)
        }
    )
}

export function percentage(val, total) {
    if (!val || val == 0) {
        return "0.00%"
    } else {
        return ((val / total) * 100).toFixed(2) + "%"
    }
}

// wei->mbd
export function weiToMbd(wei) {
    if (!wei) {
        return wei
    }
    return Number(wei) / Math.pow(10, 8)
}

// mbd->wei
export function mbdToWei(eth) {
    if (!eth) {
        return eth
    }
    return new BigNumber(eth).shiftedBy(8).integerValue()
}

// wei->eth
export function weiToEth(wei) {
    if (!wei) {
        return wei
    }
    return Number(wei) / Math.pow(10, 18)
}

// eth->wei
export function ethToWei(eth) {
    if (!eth) {
        return eth
    }
    return new BigNumber(eth).shiftedBy(18).integerValue()
}

export function timestampToDate(timestamp) {
    var date = new Date(Number(timestamp)) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + "-"
    var M =
        (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-"
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " "
    return Y + M + D
}

/** 盲盒次数转时间格式显示 */
export function boxCount2Time(count) {
    count = count * 5 * 60
    const time = Math.floor(count / 3600)
    var hour = time < 10 ? "0" + time : time
    var minute = Math.floor((count - time * 3600) / 60)
    minute = minute < 10 ? "0" + minute : minute
    var second = Math.floor(count - time * 3600 - minute * 60)
    second = second < 10 ? "0" + second : second
    return hour + ":" + minute + ":" + second
}

/** 保存盲盒标志 */
export function setBlindBoxFlagCache(userId, flag) {
    const cacheData = {
        flag: flag,
        time: new Date().getTime(),
        invalid: false,
    }
    cache.local.setJSON("DOJI_BOX_FLAG_" + userId, cacheData)
}

/** 更新盲盒状态 */
export function setBlindBoxFlagState(userId, invalid) {
    var cacheData = getBlindBoxFlagCache(userId)
    cacheData && (cacheData.invalid = invalid)
    cache.local.setJSON("DOJI_BOX_FLAG_" + userId, cacheData)
}

/** 获取盲盒标志 */
export function getBlindBoxFlagCache(userId) {
    return cache.local.getJSON("DOJI_BOX_FLAG_" + userId)
}

/** 保存盲盒 */
export function setBlindBoxCache(userId, box) {
    var cacheData = {
        box: box,
        time: new Date().getTime(),
        invalid: false,
    }
    cache.local.setJSON("DOJI_BOX_" + userId, cacheData)
}

/** 更新盲盒 */
export function setBlindBoxState(userId, invalid) {
    var cacheData = getBlindBoxCache(userId)
    cacheData && (cacheData.invalid = invalid)
    cache.local.setJSON("DOJI_BOX_" + userId, cacheData)
}
/** 获取盲盒 */
export function getBlindBoxCache(userId) {
    return cache.local.getJSON("DOJI_BOX_" + userId)
}

/** 对比 null,undefined,'' 表示同类 */
export function emptyCompare(a, b) {
    const v1 = a ? a.toString().trim() : null
    const v2 = b ? b.toString().trim() : null

    if (!v1 && !v2) {
        return true
    }
    return SHA256(v1).toString() == SHA256(v2).toString()
}

/** 过滤特殊字符 */
export function specialCharFilter(val) {
    if (!val) {
        return val
    }
    return val.replace(/[`\\<>:"/;'\\·^……+={}“”‘’]/g, "").replace(/\s/g, "")
}

/** 秒转小时 */
export function secondsToHour(val) {
    if (!val) {
        return val
    }
    return Math.ceil(val / 3600)
}
