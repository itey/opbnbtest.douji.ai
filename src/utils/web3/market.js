import i18n from "@/i18n"
import store from "@/store"
import Vue from "vue"
import marketJson from "./abi/market"
import { checkAccount, getWeb3FromCache, updateGasPrice } from "./chain"
import { mbdToWei } from "../common"

var contract = undefined

/** 获取市场合约 */
function getMarketContract() {
    const web3 = getWeb3FromCache()
    if (!web3) {
        Vue.$toast(i18n.t("common.need_reconnect_wallet"))
        return null
    }
    if (contract) {
        return contract
    } else {
        contract = new web3.eth.Contract(
            marketJson.abi,
            process.env.VUE_APP_MARKET
        )
        return contract
    }
}

/** 创建市场销售订单 */
export function createSaleOrder(tokenId, count, price) {
    if (!checkAccount()) {
        return
    }
    const marketContract = getMarketContract()
    if (!marketContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        // nftType 0-721 1-1155
        updateGasPrice().then((gasPrice) => {
            marketContract.methods
                .create(
                    process.env.VUE_APP_NFT,
                    tokenId + "",
                    count + "",
                    1,
                    mbdToWei(price) + ""
                )
                .estimateGas({ from: fromAddress })
                .then((gasAmount) => {
                    marketContract.methods
                        .create(
                            process.env.VUE_APP_NFT,
                            tokenId + "",
                            count + "",
                            1,
                            mbdToWei(price) + ""
                        )
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

/** 取消订单 */
export function cancelSaleOrder(orderId) {
    if (!checkAccount()) {
        return
    }
    const marketContract = getMarketContract()
    if (!marketContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        // nftType 0-721 1-1155
        updateGasPrice().then((gasPrice) => {
            marketContract.methods
                .cancel(orderId)
                .estimateGas({ from: fromAddress })
                .then((gasAmount) => {
                    marketContract.methods
                        .cancel(orderId)
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

/** 交易下单 */
export function swapOrder(orderId) {
    if (!checkAccount()) {
        return
    }
    const marketContract = getMarketContract()
    if (!marketContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        // nftType 0-721 1-1155
        updateGasPrice().then((gasPrice) => {
            marketContract.methods
                .swap(orderId)
                .estimateGas({ from: fromAddress })
                .then((gasAmount) => {
                    marketContract.methods
                        .swap(orderId)
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

/** 批量结算 */
export function marketSettleBatch(tokenIdArr) {
    if (!checkAccount()) {
        return
    }
    const marketContract = getMarketContract()
    if (!marketContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            marketContract.methods
                .settles(tokenIdArr)
                .estimateGas({ from: fromAddress })
                .then((gasAmount) => {
                    marketContract.methods
                        .settles(tokenIdArr)
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
