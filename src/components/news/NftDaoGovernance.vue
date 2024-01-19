<template>
  <div
    class="form-attr-container"
    v-loading="loading"
    :element-loading-background="$store.state.common.theme | maskByTheme"
  >
    <div class="form-attr-title text-color">
      {{ $t("news-detail.dao_governance") }}
    </div>
    <div class="form-dao">
      <div class="dao-title text-color">{{ $t("news-detail.dao_earn") }}</div>
      <div class="dao-income-item" style="margin-top: 22px">
        <div class="dao-income-label">{{ $t("news-detail.dao_share_tx") }}</div>
        <div class="dao-income-value text-color">
          {{ daoFeeShow | fee2Percent }}
        </div>
      </div>
      <div class="dao-title text-color" style="margin-top: 22px">
        {{ $t("news-detail.dao_gov") }}
      </div>
      <div class="dao-income-item" style="margin-top: 22px">
        <div class="dao-income-label">
          {{ $t("news-detail.dao_threshold") }}
        </div>
        <div class="dao-income-value text-color">{{ thresholdCount }}</div>
      </div>
      <div class="dao-title text-color" style="margin-top: 39px">
        {{ $t("news-detail.dao_dividend_pool") }}
      </div>
      <div class="dividend-pool">
        <div class="dividend-pool-item">
          <div class="dividend-pool-label">
            {{ $t("news-detail.dao_balance") }}
          </div>
          <div class="dividend-pool-value text-color">
            {{ settlePoolBalance | toFixedString }} MBD
          </div>
        </div>
        <div class="dividend-pool-item">
          <div class="dividend-pool-label">
            {{ $t("news-detail.dao_all_staked") }}
          </div>
          <div class="dividend-pool-value text-color">
            {{ totalStakeCount }}
          </div>
        </div>
        <template v-if="$store.state.user.account">
          <div class="dividend-pool-item">
            <div class="dividend-pool-label">
              {{ $t("news-detail.dao_you_staked") }}
            </div>
            <div
              class="dividend-pool-value text-color"
              v-if="userStakeInfo && userStakeInfo[0]"
            >
              {{ userStakeInfo[0] }} ({{ stakePercent }})
            </div>
            <div class="dividend-pool-value text-color" v-else>0 (0.00%)</div>
          </div>
          <div class="dividend-pool-item">
            <div class="dividend-pool-label">
              {{ $t("news-detail.dao_retrieve_num") }}
            </div>
            <div class="dividend-pool-value text-color">
              {{
                userStakeInfo[1] != "0"
                  ? Number(userStakeInfo[1]) + Number(cycleLen)
                  : "No stake"
              }}
            </div>
          </div>
          <div class="dividend-pool-item">
            <div class="dividend-pool-label">
              {{ $t("news-detail.dao_curr_num") }}
            </div>
            <div class="dividend-pool-value text-color">
              {{ currentHeight }}
            </div>
          </div>
        </template>
      </div>
      <div class="dao-btn-container" v-if="operable">
        <div class="dao-btn" @click="handleOpenStake()">
          {{ $t("news-detail.dao_stake") }}
        </div>
        <div class="dao-btn-border" @click="handleRetrieve()">
          {{ $t("news-detail.dao_retrieve") }}
        </div>
      </div>
    </div>
    <StakeDialog :tokenId="tokenId" :userOwned="userOwned" ref="stakeDialog" />
    <RetrieveDialog
      :tokenId="tokenId"
      :blockHeight="currentHeight"
      :userStakeInfo="userStakeInfo"
      ref="retrieveDialog"
    />
  </div>
</template>

<script>
import RetrieveDialog from "@/components/news/RetrieveDialog";
import StakeDialog from "@/components/news/StakeDialog";
import { weiToMbd } from "@/utils/common";
import { eventBus } from "@/utils/event-bus";
import { userPledgeCount } from "@/utils/web3/nft";
import {
  blockHeight,
  getSettlePoolBalance,
  getStakeCycleLen,
  tokensData,
  totalPledgeCount,
} from "@/utils/web3/open";
export default {
  name: "nft-dao-governance",
  props: {
    tokenId: {
      type: String,
      default: "",
    },
    operable: {
      type: Boolean,
      default: false,
    },
    userOwned: {
      type: String,
      default: "",
    },
    showRevision: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    StakeDialog,
    RetrieveDialog,
  },
  watch: {
    "$store.state.user.account": function (val, od) {
      if (val !== od) {
        this.getUserStakeCount();
      }
    },
  },
  computed: {
    retrieveUseable() {
      if (
        !this.userStakeInfo ||
        !this.userStakeInfo[1] ||
        !this.currentHeight ||
        !this.cycleLen
      ) {
        return false;
      }
      if (
        this.currentHeight >
        Number(this.userStakeInfo[1]) + Number(this.cycleLen)
      ) {
        return true;
      } else {
        return false;
      }
    },
    stakePercent() {
      if (
        !this.userStakeInfo ||
        !this.userStakeInfo[0] ||
        this.userStakeInfo[0] == 0
      ) {
        return "0.00%";
      }
      if (!this.totalStakeCount || this.userStakeInfo[0] == 0) {
        return "0.00%";
      }
      return (
        ((this.userStakeInfo[0] / this.totalStakeCount) * 100)
          .toFixed(2)
          .toString() + "%"
      );
    },
    thresholdCount() {
      if (
        this.showRevision &&
        this.tokenSupplyInfo.isVoting &&
        this.tokenSupplyInfo.vote.voteType == "1"
      ) {
        return this.tokenSupplyInfo.vote.tmpToken.mVoteCount;
      } else {
        return this.tokenSupplyInfo.mVoteCount;
      }
    },
    daoFeeShow() {
      if (
        this.showRevision &&
        this.tokenSupplyInfo.isVoting &&
        this.tokenSupplyInfo.vote.voteType == "1"
      ) {
        return this.tokenSupplyInfo.vote.tmpToken.daoFee;
      } else {
        return this.tokenSupplyInfo.daoFee;
      }
    },
  },
  data() {
    return {
      loading: false,
      currentHeight: undefined,
      cycleLen: undefined,
      settlePoolBalance: undefined,
      totalStakeCount: undefined,
      userStakeInfo: [],
      tokenSupplyInfo: {},
    };
  },
  mounted() {
    this.loading = true;
    setTimeout(() => {
      Promise.all([
        this.getCurrentHeight(),
        this.getUserStakeCount(),
        this.getTotalStakeCount(),
        this.getMbdSettleBalance(),
        this.loadSupplyInfo(),
        this.getStakeLength(),
      ]).then(() => {
        this.loading = false;
        eventBus.$on("refresh_stake_info", this.handleReload);
      });
    }, 4000);
  },
  destroyed() {
    eventBus.$off("refresh_stake_info");
  },
  methods: {
    /** 点击质押按钮 */
    handleOpenStake() {
      this.$store.dispatch("CheckLogin", true).then((c) => {
        if (!c) {
          return;
        }
        if (this.$store.state.chain.balanceBnb < 0.01) {
          this.$bnbConfirm(this.$store.state.common.language, () => {
            this.$refs["stakeDialog"].showDialog();
          });
          return;
        }
        this.$refs["stakeDialog"].showDialog();
      });
    },
    /** 加载数据 */
    handleReload() {
      this.loading = true;
      Promise.all([
        this.loadSupplyInfo(),
        this.getCurrentHeight(),
        this.getUserStakeCount(),
        this.getTotalStakeCount(),
        this.getMbdSettleBalance(),
        this.getStakeLength(),
      ]).then(() => {
        this.loading = false;
      });
    },
    /** 获取用户质押信息 */
    getUserStakeCount() {
      if (!this.tokenId || !this.$store.state.user.account) {
        return;
      }
      return new Promise((resolve) => {
        userPledgeCount(this.tokenId)
          .then((data) => {
            this.userStakeInfo[0] = data[0];
            this.userStakeInfo[1] = data[1];
            return resolve();
          })
          .catch((e) => {
            this.$toast.error(e && e.message ? e.message : e);
          });
      });
    },
    /** 获取质押总量 */
    getTotalStakeCount() {
      if (!this.tokenId) {
        return;
      }
      return new Promise((resolve) => {
        totalPledgeCount(this.tokenId)
          .then((count) => {
            this.totalStakeCount = count ? count : 0;
            return resolve();
          })
          .catch((e) => {
            this.$toast.error(e && e.message ? e.message : e);
          });
      });
    },
    /** 取合约里DAO 质押奖金池子的额度 */
    getMbdSettleBalance() {
      if (!this.tokenId) {
        return;
      }
      return new Promise((resolve) => {
        getSettlePoolBalance(this.tokenId)
          .then((balance) => {
            this.settlePoolBalance = weiToMbd(balance);
            return resolve();
          })
          .catch((e) => {
            this.$toast.error(e && e.message ? e.message : e);
          });
      });
    },
    /**获取质押周期 */
    getStakeLength() {
      return new Promise((resolve, reject) => {
        getStakeCycleLen()
          .then((r) => {
            this.cycleLen = r;
            return resolve();
          })
          .catch(() => {
            return reject();
          });
      });
    },
    /** 获取当前区块高度 */
    getCurrentHeight() {
      return new Promise((resolve, reject) => {
        blockHeight()
          .then((height) => {
            this.currentHeight = height;
            return resolve();
          })
          .catch(() => {
            return reject();
          });
      });
    },
    /** 加载数据 */
    loadSupplyInfo() {
      return new Promise((resolve) => {
        if (!this.tokenId) {
          return;
        }
        tokensData(this.tokenId)
          .then((res) => {
            this.tokenSupplyInfo = res;
            return resolve(res);
          })
          .catch((e) => {
            this.$toast.error(e && e.message ? e.message : e);
          });
      });
    },
    /** 点击赎回 */
    handleRetrieve() {
      this.$store.dispatch("CheckLogin", true).then((c) => {
        if (!c) {
          return;
        }
        if (!this.retrieveUseable) {
          this.$toast.info(this.$t("news-detail.retrieve_unable"));
          return;
        }
        if (this.$store.state.chain.balanceBnb < 0.01) {
          this.$bnbConfirm(this.$store.state.common.language, () => {
            this.$refs["retrieveDialog"].showDialog();
          });
          return;
        }
        this.$refs["retrieveDialog"].showDialog();
      });
    },
  },
};
</script>

<style lang="scss">
.form-attr-container {
  border: 1px solid #363e3e;
  border-radius: 6px;
  margin-bottom: 22px;
  height: auto;

  .form-attr-title {
    height: 66px;
    line-height: 66px;
    padding: 0 23px;
    background: #37434d;
    font-size: 18px;
    font-family: Arial;
    font-weight: bold;
    color: #ffffff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .form-attr-action {
      font-size: 14px;
      font-family: Arial;
      font-weight: bold;
      color: #00f9e5;
      line-height: 66px;
      cursor: pointer;
    }
  }

  .form-attr-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 16px 16px;

    .form-attr-item {
      width: 170px;
      padding: 14px 0;
      background: #1e252d;
      border-radius: 6px;
      margin-bottom: 18px;

      .form-attr-label {
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #88a2b8;
        margin-left: 12px;
      }

      .form-attr-value {
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #ffffff;
        margin-top: 14px;
        margin-left: 12px;
      }
    }
  }

  .form-attr-market {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 17px 17px 22px 17px;
    text-align: center;

    .form-attr-market-top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .form-attr-available {
        background: #1e252d;
        margin-left: 13px;
        border-radius: 6px;
        width: 144px;
        height: 34px;
        line-height: 34px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #acbcc9;
        min-width: 122px;
        text-align: left;
        padding: 0 13px;
        margin-top: 24px;

        &:first-child {
          margin-left: 0;
          text-align: center;
        }
      }
    }

    .form-attr-mbd {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      margin-top: 20px;

      .form-attr-mbd-value {
        font-size: 26px;
        font-family: Arial;
        font-weight: bold;
      }

      .form-attr-mbd-value {
        font-size: 10px;
        font-family: Arial;
        font-weight: 400;
        color: #88a2b8;
      }
    }

    .form-attr-mint {
      margin: 17px 0 9px 0;
      border-radius: 18px;
      font-size: 13px;
      font-family: Arial;
      font-weight: bold;
      color: #1a2027;
      width: 100%;
    }

    .form-attr-tip {
      font-size: 10px;
      font-family: Arial;
      font-weight: 400;
      color: #88a2b8;
    }
  }

  .form-second-market {
    display: flex;
    flex-direction: row;
    padding: 24px 16px;

    .second-market-column {
      line-height: 49px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #acbcc9;
    }

    .second-market-header {
      height: 34px;
      font-size: 12px;
      line-height: 34px;
      background: #252d36;
    }

    .second-market-td {
      font-size: 12px;
      font-family: Arial;
      font-weight: 400;
      color: #ffffff;
      line-height: 46px;
      border-bottom: 1px solid #252d36;

      .second-btn {
        margin: 8px 0;
        width: 60px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: linear-gradient(-16deg, #848d98, #97a8a7);
        border-radius: 15px;
        cursor: pointer;
      }
    }
  }

  .form-dao {
    padding: 17px 12px;

    .dao-title {
      padding: 0 13px;
      font-size: 16px;
      font-family: Arial;
      font-weight: bold;
      color: #ffffff;
    }

    .dao-sub {
      padding: 0 13px;
      font-size: 14px;
      font-family: Arial;
      font-weight: 400;
      color: #acbcc9;
      line-height: 17px;
      margin-top: 13px;
    }

    .dao-income-item {
      padding: 0 13px;
      margin-top: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      .dao-income-label {
        font-size: 14px;
        font-family: Arial;
        font-weight: bold;
        color: #9ab8db;
        word-break: keep-all;
      }

      .dao-income-value {
        font-size: 14px;
        font-family: Arial;
        font-weight: bold;
        color: #ffffff;
      }
    }

    .dao-member {
      padding: 0 14px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      &.dao-member-header {
        margin-top: 19px;
        height: 34px;
        background: #1e252d;

        .dao-member-left {
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #acbcc9;
          line-height: 34px;
        }

        .dao-member-right {
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #acbcc9;
          line-height: 34px;
        }
      }

      &.dao-member-td {
        height: 46px;

        .dao-member-left {
          font-size: 14px;
          font-family: Arial;
          font-weight: 400;
          line-height: 46px;
        }

        .dao-member-right {
          font-size: 14px;
          font-family: Arial;
          font-weight: 400;
          color: #acbcc9;
          line-height: 46px;
        }
      }
    }

    .dividend-pool {
      .dividend-pool-item {
        padding: 19px 13px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #1f262e;

        &:last-child {
          border: none;
        }

        .dividend-pool-label {
          font-size: 14px;
          font-family: Arial;
          font-weight: bold;
          color: #9ab8db;
        }

        .dividend-pool-value {
          font-size: 14px;
          font-family: Arial;
          font-weight: bold;
        }
      }
    }

    .dao-btn-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      text-align: center;

      .dao-btn {
        width: 110px;
        height: 36px;
        background: #3c9ef2;
        border-radius: 10px;
        font-size: 14px;
        font-family: Arial;
        font-weight: 400;
        color: #ffffff;
        line-height: 36px;
        cursor: pointer;
      }

      .dao-btn-border {
        margin-left: 20px;
        width: 110px;
        height: 36px;
        border: 1px solid #3c9ef2;
        border-radius: 10px;
        font-size: 14px;
        font-family: Arial;
        font-weight: 400;
        color: #5cb1fa;
        line-height: 36px;
        cursor: pointer;
      }
    }
  }

  .form-attr-setting {
    padding: 16px 13px;

    .form-attr-set {
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      background: linear-gradient(-16deg, #848d98, #97a8a7);
      border-radius: 4px;
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #acbcc9;
      padding: 0 17px;

      &:first-child {
        margin-bottom: 10px;
      }

      &:hover {
        color: #00f9e5;
      }
    }
  }
}
</style>
