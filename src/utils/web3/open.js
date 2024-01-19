import bjx from "./abi/bjx"
import erc1155 from "./abi/erc1155"
import erc20 from "./abi/erc20"
import erc721 from "./abi/erc721"
import marketJson from "./abi/market"
import mbd from "./abi/mbd"
import nft from "./abi/nft"
import pairJson from "./abi/pair"
import operator from "./abi/operator"

import { weiToEth, weiToMbd } from "@/utils/common"

const Web3 = require("web3")
const rpcUrl = process.env.VUE_APP_OPEN_RPC
const web3 = new Web3(rpcUrl)

const BJX_TOKEN_ID = process.env.VUE_APP_BJX_TOKEN_ID

///////////////////主链///////////////////
/** 检查是否为合约地址 */
export function checkIfContract(account) {
    return new Promise((resolve, reject) => {
        web3.eth
            .getCode(account)
            .then((code) => {
                if (code === "0x") {
                    resolve(false)
                }
                resolve(true)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 区块高度获取 */
export function blockHeight() {
    return new Promise((resolve, reject) => {
        web3.eth
            .getBlockNumber()
            .then((height) => {
                resolve(height)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** BNB余额查询 */
export function balanceOfBnb(account) {
    return new Promise((resolve, reject) => {
        web3.eth
            .getBalance(account)
            .then((balance) => resolve(weiToEth(balance)))
            .catch((e) => {
                reject(e)
            })
    })
}

///////////////////ERC系列///////////////////
/** erc20余额查询 */
export function getErc20BalanceOf(cAddress, account) {
    const contract = new web3.eth.Contract(erc20.abi, cAddress)
    return new Promise((resolve, reject) => {
        contract.methods
            .balanceOf(account)
            .call()
            .then((r) => {
                resolve(r)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/** erc721余额查询 */
export function getErc721BalanceOf(cAddress, account) {
    const contract = new web3.eth.Contract(erc721.abi, cAddress)
    return new Promise((resolve, reject) => {
        contract.methods
            .balanceOf(account)
            .call()
            .then((r) => {
                resolve(r)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/** erc1155余额查询 */
export function getErc1155BalanceOf(cAddress, account, tokenId) {
    const contract = new web3.eth.Contract(erc1155.abi, cAddress)
    return new Promise((resolve, reject) => {
        contract.methods
            .balanceOf(account, tokenId)
            .call()
            .then((r) => {
                resolve(r)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

///////////////////BJX///////////////////

/** 获取BJX合约 */
const getBjxContract = () => {
    return new web3.eth.Contract(bjx.abi, process.env.VUE_APP_BJX)
}

/** 查询BJXStar */
export const getBjxTokenInfo = () => {
    const contract = getBjxContract()
    return new Promise((resolve, reject) => {
        contract.methods
            .tokens(BJX_TOKEN_ID)
            .call()
            .then((r) => {
                resolve(r)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/** 查询BJXStar */
export const getBjxBalanceOf = (account) => {
    const contract = getBjxContract()
    return new Promise((resolve, reject) => {
        contract.methods
            .balanceOf(account, BJX_TOKEN_ID)
            .call()
            .then((r) => {
                resolve(r)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/** BJX的MBD价格 */
export const getBjxMbdPrice = () => {
    const contract = getBjxContract()
    return new Promise((resolve, reject) => {
        contract.methods
            .getTokenPrice(BJX_TOKEN_ID, process.env.VUE_APP_MBD)
            .call()
            .then((r) => {
                resolve(weiToMbd(r))
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/** BJX的USDT价格 */
export const getBjxUsdtPrice = () => {
    const contract = getBjxContract()
    return new Promise((resolve, reject) => {
        contract.methods
            .getTokenPrice(BJX_TOKEN_ID, process.env.VUE_APP_USDT)
            .call()
            .then((r) => {
                resolve(weiToEth(r))
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/** BJX的BNB价格 */
export const getBjxBnbPrice = () => {
    const contract = getBjxContract()
    return new Promise((resolve, reject) => {
        contract.methods
            .getBnbPrice(BJX_TOKEN_ID)
            .call()
            .then((r) => {
                resolve(weiToEth(r))
            })
            .catch((err) => {
                reject(err)
            })
    })
}

///////////////////MBD///////////////////

/** 获取MBD交易对合约 */
function getPairContract() {
    return new web3.eth.Contract(pairJson.abi, process.env.VUE_APP_PAIR)
}

/** 获取MBD合约 */
function getMBDContract() {
    return new web3.eth.Contract(mbd.abi, process.env.VUE_APP_MBD)
}

/** 查询MBD余额 */
export function balanceOfMbd(account) {
    const contract = getMBDContract()
    return new Promise((resolve, reject) => {
        contract.methods
            .balanceOf(account)
            .call()
            .then((balance) => {
                resolve(weiToMbd(balance))
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/** 获取MBD价格 */
export function getMbdPrice() {
    const pair = getPairContract()
    if (!pair) {
        return
    }
    return new Promise((resolve, reject) => {
        pair.methods
            .getReserves()
            .call()
            .then((reserves) => {
                resolve(reserves)
            })
            .catch((e) => {
                reject(e.message ? e.message : e)
            })
    })
}

/** 查询MBD授权数量 */
export function getAllowance(owner, spender) {
    const contract = getMBDContract()
    return new Promise((resolve, reject) => {
        contract.methods
            .allowance(owner, spender)
            .call()
            .then((r) => {
                resolve(r)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

///////////////////Market///////////////////

/** 获取市场合约 */
function getMarketContract() {
    return new web3.eth.Contract(marketJson.abi, process.env.VUE_APP_MARKET)
}

/** 取合约里DAO 质押奖金池子的额度 */
export function getSettlePoolBalance(tokenId) {
    const nftContract = getMarketContract()
    if (!nftContract) {
        return
    }
    return new Promise((resolve, reject) => {
        nftContract.methods
            .tokenSettlePool(tokenId)
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

///////////////////运营///////////////////
/** 获取运营合约 */
function getOperatorContract() {
    return new web3.eth.Contract(operator.abi, process.env.VUE_APP_OPERATOR)
}

/** 获取阅读时长阈值 */
export function getCreativeDuration() {
    const operatorContract = getOperatorContract()
    if (!operatorContract) {
        return
    }
    return new Promise((resolve, reject) => {
        operatorContract.methods
            .creativeStandardDuration()
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 获取关注阈值 */
export function getCreativeFans() {
    const operatorContract = getOperatorContract()
    if (!operatorContract) {
        return
    }
    return new Promise((resolve, reject) => {
        operatorContract.methods
            .creativeStandardFans()
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 获取创作者资金池 */
export function getCreatorSettlePool() {
    const operatorContract = getOperatorContract()
    if (!operatorContract) {
        return
    }
    return new Promise((resolve, reject) => {
        operatorContract.methods
            .createrSettlePool()
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

///////////////////NFT///////////////////
/** 获取NFT合约 */
function getNFTContract() {
    return new web3.eth.Contract(nft.abi, process.env.VUE_APP_NFT)
}

/** 查询DaoRule */
export function getDaoRule(tokenId) {
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    return new Promise((resolve, reject) => {
        nftContract.methods
            .getDaoRule(tokenId)
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 查询TokenOwner */
export function getTokenOwner(tokenId) {
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    return new Promise((resolve, reject) => {
        nftContract.methods
            .tokenOwners(tokenId)
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** nft信息查询 */
export function tokensData(tokenId) {
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    return new Promise((resolve, reject) => {
        nftContract.methods
            .tokens(tokenId)
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 获取metaURI */
export function tokenURI(tokenId) {
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    return new Promise((resolve, reject) => {
        nftContract.methods
            .uri(tokenId)
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 总质押数量 */
export function totalPledgeCount(tokenId) {
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    return new Promise((resolve, reject) => {
        nftContract.methods
            .pledgeAllBalanceOf(tokenId)
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 质押解压周期时间 */
export function getStakeCycleLen() {
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    return new Promise((resolve, reject) => {
        nftContract.methods
            .cycleLen()
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 查询收藏点赞阅读时长 */
export function getCPD(tokenId) {
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    return new Promise((resolve, reject) => {
        nftContract.methods
            .getC_P_D(tokenId)
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 查询提案发起人 */
export function getVotePromoter(tokenId) {
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    return new Promise((resolve, reject) => {
        nftContract.methods
            .getVotePromoter(tokenId)
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 查询用户总的被阅读时长 */
export function getCreaterData(owner) {
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    return new Promise((resolve, reject) => {
        nftContract.methods
            .getCreaterData(owner)
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 查询总价值 */
export function getAllValueData() {
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    return new Promise((resolve, reject) => {
        nftContract.methods
            .allValue()
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}
