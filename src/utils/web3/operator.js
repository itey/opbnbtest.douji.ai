import i18n from "@/i18n"
import store from "@/store"
import Vue from "vue"
import operator from "./abi/operator"
import { checkAccount, getWeb3FromCache, updateGasPrice } from "./chain"

var contract = undefined

/** 获取市场合约 */
function getOperatorContract() {
    const web3 = getWeb3FromCache()
    if (!web3) {
        Vue.$toast(i18n.t("common.need_reconnect_wallet"))
        return null
    }
    if (contract) {
        return contract
    } else {
        contract = new web3.eth.Contract(
            operator.abi,
            process.env.VUE_APP_OPERATOR
        )
        return contract
    }
}

/** 合约签到 */
export function checkInContract() {
    if (!checkAccount()) {
        return
    }
    const operatorContract = getOperatorContract()
    if (!operatorContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            operatorContract.methods
                .checkIn()
                .estimateGas({ from: fromAddress })
                .then((gasAmount) => {
                    operatorContract.methods
                        .checkIn()
                        .send({
                            from: fromAddress,
                            gas: Math.ceil(gasAmount * 1.5) + "",
                            gasPrice: Math.ceil(gasPrice * 1.2),
                        })
                        .on("transactionHash", (hash) => {
                            console.log("transactionHash:", hash)
                        })
                        .on("receipt", (receipt) => {
                            resolve(receipt)
                        })
                        .on("error", (error) => {
                            reject(error)
                        })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    })
}

/** 检查盲盒 */
export function checkBoxContract() {
    const operatorContract = getOperatorContract()
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        operatorContract.methods
            .checkBox()
            .call({ from: fromAddress })
            .then((r) => {
                resolve(r)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/** 获取盲盒 */
export function getBoxContract(tokenId) {
    if (!checkAccount()) {
        return
    }
    const operatorContract = getOperatorContract()
    if (!operatorContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            operatorContract.methods
                .getBox(tokenId)
                .estimateGas({ from: fromAddress })
                .then((gasAmount) => {
                    operatorContract.methods
                        .getBox(tokenId)
                        .send({
                            from: fromAddress,
                            gas: Math.ceil(gasAmount * 1.5) + "",
                            gasPrice: Math.ceil(gasPrice * 1.2),
                        })
                        .on("transactionHash", (hash) => {
                            console.log("transactionHash:", hash)
                        })
                        .on("receipt", (receipt) => {
                            resolve(receipt)
                        })
                        .on("error", (error) => {
                            reject(error)
                        })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    })
}

/** 打开盲盒 */
export function openBoxContract() {
    if (!checkAccount()) {
        return
    }
    const operatorContract = getOperatorContract()
    if (!operatorContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            operatorContract.methods
                .openBox()
                .estimateGas({ from: fromAddress })
                .then((gasAmount) => {
                    operatorContract.methods
                        .openBox()
                        .send({
                            from: fromAddress,
                            gas: Math.ceil(gasAmount * 1.5) + "",
                            gasPrice: Math.ceil(gasPrice * 1.2),
                        })
                        .on("transactionHash", (hash) => {
                            console.log("transactionHash:", hash)
                        })
                        .on("receipt", (receipt) => {
                            resolve(receipt)
                        })
                        .on("error", (error) => {
                            reject(error)
                        })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    })
}

/** 关注创作者 */
export function subscribeAuthorContract(address) {
    if (!checkAccount()) {
        return
    }
    const operatorContract = getOperatorContract()
    if (!operatorContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            operatorContract.methods
                .followUser(address)
                .estimateGas({ from: fromAddress })
                .then((gasAmount) => {
                    operatorContract.methods
                        .followUser(address)
                        .send({
                            from: fromAddress,
                            gas: Math.ceil(gasAmount * 1.5) + "",
                            gasPrice: Math.ceil(gasPrice * 1.2),
                        })
                        .on("transactionHash", (hash) => {
                            console.log("transactionHash:", hash)
                        })
                        .on("receipt", (receipt) => {
                            resolve(receipt)
                        })
                        .on("error", (error) => {
                            reject(error)
                        })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    })
}

/** 查询我是否关注了 */
export function isFollow(account) {
    if (!checkAccount()) {
        return
    }
    const operatorContract = getOperatorContract()
    if (!operatorContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        operatorContract.methods
            .checkFollow(account)
            .call({ from: fromAddress })
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 是否已加入计划 */
export function ifCreativePlanIn() {
    const operatorContract = getOperatorContract()
    if (!operatorContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        operatorContract.methods
            .creativePlan(fromAddress)
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 查询用户的粉丝数 */
export function getUserFansCount() {
    const operatorContract = getOperatorContract()
    if (!operatorContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        operatorContract.methods
            .userFans(fromAddress)
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 加入计划 */
export function joinCreativePlan() {
    if (!checkAccount()) {
        return
    }
    const operatorContract = getOperatorContract()
    if (!operatorContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            operatorContract.methods
                .joinCreativePlan()
                .estimateGas({ from: fromAddress })
                .then((gasAmount) => {
                    operatorContract.methods
                        .joinCreativePlan()
                        .send({
                            from: fromAddress,
                            gas: Math.ceil(gasAmount * 1.5) + "",
                            gasPrice: Math.ceil(gasPrice * 1.2),
                        })
                        .on("transactionHash", (hash) => {
                            console.log("transactionHash:", hash)
                        })
                        .on("receipt", (receipt) => {
                            resolve(receipt)
                        })
                        .on("error", (error) => {
                            reject(error)
                        })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    })
}

/** 结算计划 */
export function settleCreativeBonus(tokenIdArr) {
    if (!checkAccount()) {
        return
    }
    const operatorContract = getOperatorContract()
    if (!operatorContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            operatorContract.methods
                .settleCreativeBonus(tokenIdArr)
                .estimateGas({ from: fromAddress })
                .then((gasAmount) => {
                    operatorContract.methods
                        .settleCreativeBonus(tokenIdArr)
                        .send({
                            from: fromAddress,
                            gas: Math.ceil(gasAmount * 1.5) + "",
                            gasPrice: Math.ceil(gasPrice * 1.2),
                        })
                        .on("transactionHash", (hash) => {
                            console.log("transactionHash:", hash)
                        })
                        .on("receipt", (receipt) => {
                            resolve(receipt)
                        })
                        .on("error", (error) => {
                            reject(error)
                        })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    })
}
