import router from "@/router"
import store from "@/store"
import { eventBus } from "@/utils/event-bus"
import { checkInContract } from "@/utils/web3/operator"
import {
    checkIn,
    login,
    getUserInfo,
    contractSign,
    isCheckIn,
} from "@/utils/http"
import { beginEventBus, endEventBus } from "@/utils/task"
import {
    checkInSign,
    loginWalletSign,
    getWeb3FromCache,
} from "@/utils/web3/chain"
import { i18n } from "element-ui/lib/locale"
import Vue from "vue"

const user = {
    state: {
        token: undefined,
        userId: undefined,
        account: undefined,
        logout: false,
        creatorPlan: false,
        userInfo: {},
        ifCheckIn: undefined,
    },

    mutations: {
        setToken: (state, token) => {
            state.token = token
        },
        setUserId: (state, userId) => {
            state.userId = userId
        },
        setUserAccount: (state, account) => {
            state.account = account
        },
        setLogout: (state, logout) => {
            state.logout = logout
        },
        setUserInfo: (state, userInfo) => {
            state.userInfo = userInfo
        },
        setCreatorPlan: (state, plan) => {
            state.creatorPlan = plan
        },
        setIfCheckIn: (state, ifCheckIn) => {
            state.ifCheckIn = ifCheckIn
        },
    },

    actions: {
        // 登录
        Login({ commit }, payload) {
            if (!payload.address) {
                return
            }
            if (!getWeb3FromCache()) {
                return
            }
            const currentAccount = store.state.user.account
            if (
                currentAccount &&
                currentAccount.toUpperCase() == payload.address.toUpperCase()
            ) {
                return
            }
            return new Promise((resolve) => {
                loginWalletSign(payload.address)
                    .then((signed) => {
                        login({ address: payload.address, signed: signed })
                            .then((res) => {
                                const userId = res.data.id
                                const token = res.data.token
                                commit("setToken", token)
                                commit("setUserId", userId)
                                commit("setUserAccount", payload.address)
                                commit("setChainAccount", payload.address)
                                beginEventBus()
                                eventBus.$emit("user_login")
                                getUserInfo().then((u) => {
                                    if (u.code == 1) {
                                        commit("setUserInfo", u.data)
                                        return resolve()
                                    } else {
                                        console.log(u.message)
                                        endEventBus()
                                        commit("setLogout", true)
                                        Vue.$toast.warning(u.message)
                                    }
                                })
                            })
                            .catch((error) => {
                                console.log(error)
                                endEventBus()
                                commit("setLogout", true)
                                Vue.$toast.warning(error)
                            })
                    })
                    .catch((error) => {
                        console.log(error)
                        endEventBus()
                        commit("setLogout", true)
                        Vue.$toast.warning(error)
                    })
            })
        },
        // 更新签到状态
        UpdateCheckStatus({ commit }) {
            if (!store.state.user.account) {
                return
            }
            isCheckIn().then((checkRes) => {
                if (checkRes.code == 1) {
                    commit("setIfCheckIn", checkRes.data.is_check_in == 1)
                }
            })
        },
        // 每日签到
        CheckInDaily({ commit }) {
            return new Promise((resolve, reject) => {
                const ifCheckIn = store.state.user.ifCheckIn
                if (ifCheckIn) {
                    return reject(i18n.t("common.already_check_in"))
                }
                if (store.state.user.userInfo.isge8model) {
                    // 合约签到
                    checkInContract()
                        .then((txJson) => {
                            contractSign(txJson.transactionHash)
                                .then((r) => {
                                    if (r.code == 1) {
                                        commit("setIfCheckIn", true)
                                        return resolve(r.data)
                                    } else {
                                        if (
                                            r.message.indexOf("已签过到") >= 0
                                        ) {
                                            commit("setIfCheckIn", true)
                                            return resolve()
                                        }
                                        return reject(r.message)
                                    }
                                })
                                .catch((e) => {
                                    reject(e)
                                })
                        })
                        .catch((e) => {
                            reject(e)
                        })
                } else {
                    // 本地签到
                    checkInSign()
                        .then((signed) => {
                            checkIn(signed)
                                .then((res) => {
                                    if (res.code == 1) {
                                        commit("setIfCheckIn", true)
                                        return resolve(res.data)
                                    } else {
                                        if (
                                            res.message.indexOf("已签过到") >= 0
                                        ) {
                                            commit("setIfCheckIn", true)
                                            return resolve()
                                        }
                                        return reject(res.message)
                                    }
                                })
                                .catch((e) => {
                                    console.log(e)
                                    if (e && e.indexOf("已签过到") >= 0) {
                                        commit("setIfCheckIn", true)
                                        return resolve()
                                    }
                                    return reject(e)
                                })
                        })
                        .catch((e) => {
                            return reject(e)
                        })
                }
            })
        },
        // 退出登录
        Logout({ commit }) {
            endEventBus()
            commit("setToken", "")
            commit("setUserId", "")
            commit("setUserAccount", "")
            commit("setChainAccount", "")
            commit("setBalanceMbd", "")
            commit("setBalanceBnb", "")
            commit("setLogout", true)
            router.replace("/")
        },
        // 检查登录状态，未登录则弹窗登录
        CheckLogin({ commit }, ifOpenConnect) {
            return new Promise((resolve) => {
                if (store.state.user.token && getWeb3FromCache()) {
                    return resolve(true)
                } else {
                    if (ifOpenConnect) {
                        commit("setOpenConnect", true)
                    }
                    return resolve(false)
                }
            })
        },
    },
}

export default user
