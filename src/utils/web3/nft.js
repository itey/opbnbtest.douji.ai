import i18n from "@/i18n"
import store from "@/store"
import Vue from "vue"
import { mbdToWei } from "../common"
import nft from "./abi/nft"
import { checkAccount, getWeb3FromCache, updateGasPrice } from "./chain"

var nftContract = undefined

/** 获取NFT合约 */
function getNFTContract() {
    const web3 = getWeb3FromCache()
    if (!web3) {
        Vue.$toast(i18n.t("common.need_reconnect_wallet"))
        return null
    }
    if (nftContract) {
        return nftContract
    } else {
        nftContract = new web3.eth.Contract(nft.abi, process.env.VUE_APP_NFT)
        return nftContract
    }
}

/** 创作者铸造NFT */
export function possessorMint(
    tokenURI,
    initAmount,
    priceTokenIdOrAmount,
    maxSupply
) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const toAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .authorise(
                    tokenURI,
                    initAmount + "",
                    mbdToWei(priceTokenIdOrAmount) + "",
                    maxSupply + ""
                )
                .estimateGas({ from: toAddress })
                .then((gasAmount) => {
                    nftContract.methods
                        .authorise(
                            tokenURI,
                            initAmount + "",
                            mbdToWei(priceTokenIdOrAmount) + "",
                            maxSupply + ""
                        )
                        .send({
                            from: toAddress,
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

/** 其他用户mint NFT */
export function userMint(tokenId, count) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const toAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .mint(toAddress, tokenId, count + "", "0x")
                .estimateGas({ from: toAddress })
                .then((gasAmount) => {
                    nftContract.methods
                        .mint(toAddress, tokenId, count + "", "0x")
                        .send({
                            from: toAddress,
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

/** 获取余额 */
export function balanceOf(tokenId) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const userAccount = store.state.chain.account
    return new Promise((resolve, reject) => {
        nftContract.methods
            .balanceOf(userAccount, tokenId)
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 投票 */
export function voteByBallot(tokenId) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const userAccount = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .voteByBallot(tokenId)
                .estimateGas({ from: userAccount })
                .then((gasAmount) => {
                    nftContract.methods
                        .voteByBallot(tokenId)
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

/** 取消投票 */
export function cancelVote(tokenId) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const userAccount = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .cancelVote(tokenId)
                .estimateGas({ from: userAccount })
                .then((gasAmount) => {
                    nftContract.methods
                        .cancelVote(tokenId)
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

/** update-step1 */
export function startSetTokenPrice(tokenId, price, availableSupply) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const userAccount = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .startSetTokenPrice(
                    tokenId,
                    mbdToWei(price) + "",
                    availableSupply + ""
                )
                .estimateGas({ from: userAccount })
                .then((gasAmount) => {
                    nftContract.methods
                        .startSetTokenPrice(
                            tokenId,
                            mbdToWei(price) + "",
                            availableSupply + ""
                        )
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

/** 执行 */
export function setTokenPriceDao(tokenId) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const userAccount = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .setTokenPrice(tokenId)
                .estimateGas({ from: userAccount })
                .then((gasAmount) => {
                    nftContract.methods
                        .setTokenPrice(tokenId)
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

/** update-step2 */
export function startSetTokenURI(tokenId, url) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const userAccount = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .startSetTokenURI(tokenId, url)
                .estimateGas({ from: userAccount })
                .then((gasAmount) => {
                    nftContract.methods
                        .startSetTokenURI(tokenId, url)
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

/** 执行 */
export function setTokenURIDao(tokenId) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const userAccount = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .setTokenURI(tokenId)
                .estimateGas({ from: userAccount })
                .then((gasAmount) => {
                    nftContract.methods
                        .setTokenURI(tokenId)
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

/** update-sale */
export function startSetNsp(tokenId, param) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const userAccount = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .startSetNsp(
                    tokenId,
                    param.isOpen,
                    param.sptType,
                    param.cAddress,
                    param.discounts + "",
                    (param.discountsFee * 100).toFixed(0) + "",
                    param.tokenId
                )
                .estimateGas({ from: userAccount })
                .then((gasAmount) => {
                    nftContract.methods
                        .startSetNsp(
                            tokenId,
                            param.isOpen,
                            param.sptType,
                            param.cAddress,
                            param.discounts + "",
                            (param.discountsFee * 100).toFixed(0) + "",
                            param.tokenId
                        )
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

/** 执行 */
export function setNspDao(tokenId) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const userAccount = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .setNsp(tokenId)
                .estimateGas({ from: userAccount })
                .then((gasAmount) => {
                    nftContract.methods
                        .setNsp(tokenId)
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

/** update-dao */
export function startSetDaoRule(tokenId, param) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const userAccount = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .startSetDaoRule(
                    tokenId,
                    param.daoFee + "",
                    param.mVoteCount + ""
                )
                .estimateGas({ from: userAccount })
                .then((gasAmount) => {
                    nftContract.methods
                        .startSetDaoRule(
                            tokenId,
                            param.daoFee + "",
                            param.mVoteCount + ""
                        )
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

/** 执行 */
export function setDaoRuleDao(tokenId) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const userAccount = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .setDaoRule(tokenId)
                .estimateGas({ from: userAccount })
                .then((gasAmount) => {
                    nftContract.methods
                        .setDaoRule(tokenId)
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

/** 查询是否已经投票 */
export function isAlreadyVote(voteNo) {
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const userAccount = store.state.chain.account
    return new Promise((resolve, reject) => {
        nftContract.methods
            .checkAV(voteNo, userAccount)
            .call({ from: userAccount })
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** stake NFT */
export function stakeNft(tokenId, count) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .pledgeNft(tokenId, count + "")
                .estimateGas({ from: fromAddress })
                .then((gasAmount) => {
                    nftContract.methods
                        .pledgeNft(tokenId, count + "")
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
                            reject(error.message)
                        })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    })
}

/** 取回 NFT */
export function unStakeNft(tokenId, count) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .unPledgeNft(tokenId, count + "")
                .estimateGas({ from: fromAddress })
                .then((gasAmount) => {
                    nftContract.methods
                        .unPledgeNft(tokenId, count + "")
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
                            reject(error.message)
                        })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    })
}

/** 我的质押数量 */
export function userPledgeCount(tokenId) {
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        nftContract.methods
            .pledgeBalanceOf(fromAddress, tokenId)
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 授权 NFT */
export function nftApproval(operator) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .setApprovalForAll(operator, true)
                .estimateGas({ from: fromAddress })
                .then((gasAmount) => {
                    nftContract.methods
                        .setApprovalForAll(operator, true)
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
                            reject(error.message)
                        })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    })
}

/** 我已经抵扣的数量 */
export function getAlreadyDiscounts(cAddress) {
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        nftContract.methods
            .alreadyDiscounts(fromAddress, cAddress)
            .call()
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 是否点赞收藏 */
export function isAlreadyPraiseCollect(tokenId) {
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const userAccount = store.state.chain.account
    return new Promise((resolve, reject) => {
        nftContract.methods
            .checkP_C(tokenId)
            .call({ from: userAccount })
            .then((res) => {
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}

/** 收藏NFT */
export function nftPraise(tokenId) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .setPraiseCount(tokenId)
                .estimateGas({ from: fromAddress })
                .then((gasAmount) => {
                    nftContract.methods
                        .setPraiseCount(tokenId)
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
                            reject(error.message)
                        })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    })
}

/** 收藏NFT */
export function nftCollect(tokenId) {
    if (!checkAccount()) {
        return
    }
    const nftContract = getNFTContract()
    if (!nftContract) {
        return
    }
    const fromAddress = store.state.chain.account
    return new Promise((resolve, reject) => {
        updateGasPrice().then((gasPrice) => {
            nftContract.methods
                .setCollectCount(tokenId)
                .estimateGas({ from: fromAddress })
                .then((gasAmount) => {
                    nftContract.methods
                        .setCollectCount(tokenId)
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
                            reject(error.message)
                        })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    })
}
