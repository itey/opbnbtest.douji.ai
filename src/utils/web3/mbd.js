import i18n from "@/i18n"
import store from "@/store"
import Vue from "vue"
import { mbdToWei } from "../common"
import mbd from "./abi/mbd"
import { checkAccount, getWeb3FromCache, updateGasPrice } from "./chain"
import { getAllowance } from "./open"

/** 获取MBD合约 */
function getMBDContract() {
    const web3 = getWeb3FromCache()
    if (!web3) {
        Vue.$toast.warning(i18n.t("common.need_reconnect_wallet"))
        return
    }
    return new web3.eth.Contract(mbd.abi, process.env.VUE_APP_MBD)
}

/** 授权MBD */
export function approveMbd(spender, count) {
    if (!checkAccount()) {
        return
    }
    const mbdContract = getMBDContract()
    if (!mbdContract) {
        return
    }
    const userAccount = store.state.chain.account
    return new Promise((resolve, reject) => {
        getAllowance(userAccount, spender).then((allowance) => {
            if (Number(allowance) >= Number(mbdToWei(count))) {
                resolve()
            } else {
                updateGasPrice().then((gasPrice) => {
                    mbdContract.methods
                        .approve(spender, mbdToWei(count) + "")
                        .estimateGas({ from: userAccount })
                        .then((gasAmount) => {
                            mbdContract.methods
                                .approve(spender, mbdToWei(count) + "")
                                .send({
                                    from: userAccount,
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
                                    reject(error.message)
                                })
                        })
                        .catch((error) => {
                            reject(error)
                        })
                })
            }
        })
    })
}

/** MBD转账 */
export function transferMbd(to, count) {
    if (!checkAccount()) {
        return
    }
    const mbdContract = getMBDContract()
    if (!mbdContract) {
        return
    }
    const userAccount = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            mbdContract.methods
                .transfer(to, mbdToWei(count) + "")
                .estimateGas({ from: userAccount })
                .then((gasAmount) => {
                    mbdContract.methods
                        .transfer(to, mbdToWei(count) + "")
                        .send({
                            from: userAccount,
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
                            reject(error.message)
                        })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    })
}
