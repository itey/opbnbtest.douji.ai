import store from "@/store"
import { weiToEth, weiToMbd } from "@/utils/common"
import { balanceOfBnb, balanceOfMbd, getMbdPrice } from "@/utils/web3/open"
import { opBNBTestnet } from "@particle-network/chains"
import Vue from "vue"

const projectId = process.env.VUE_APP_PROJECT_ID
const clientKey = process.env.VUE_APP_CLIENT_KEY
const appId = process.env.VUE_APP_APP_ID
const walletProjectId = process.env.VUE_APP_WALLETCONNECT_PROJECT_ID

const chain = {
    state: {
        chainId: opBNBTestnet.id,
        projectId: projectId,
        clientKey: clientKey,
        appId: appId,
        walletProjectId: walletProjectId,
        account: undefined,
        balanceBnb: undefined,
        balanceMbd: undefined,
        mbdPrice: undefined,
        gasPriceCache: undefined,
        gasTimeOut: undefined,
    },

    mutations: {
        setChainAccount(state, account) {
            state.account = account
        },
        setBalanceBnb(state, balance) {
            state.balanceBnb = balance
        },
        setBalanceMbd(state, balance) {
            state.balanceMbd = balance
        },
        setMbdPrice: (state, mbdPrice) => {
            state.mbdPrice = mbdPrice
        },
        setGasPriceCache(state, gasPrice) {
            state.gasPriceCache = gasPrice
        },
        setGasTimeOut(state, gasTimeOut) {
            state.gasTimeOut = gasTimeOut
        },
    },

    actions: {
        // 获取BNB余额
        GetBalanceOfBnb({ commit }) {
            const account = store.state.chain.account
            balanceOfBnb(account)
                .then((balance) => {
                    commit("setBalanceBnb", balance)
                })
                .catch((e) => {
                    Vue.$toast.warning(e.message ? e.message : e)
                })
        },
        // 获取MBD余额
        GetBalanceOfMbd({ commit }) {
            const account = store.state.chain.account
            balanceOfMbd(account)
                .then((balance) => {
                    commit("setBalanceMbd", balance)
                })
                .catch((e) => {
                    Vue.$toast.warning(e.message ? e.message : e)
                })
        },
        // 获取Mbd价格
        LoadMbdPrice({ commit }) {
            getMbdPrice().then((res) => {
                const price = weiToEth(res[0]) / weiToMbd(res[1])
                commit("setMbdPrice", price.toFixed(8))
            })
        },
    },
}

export default chain
