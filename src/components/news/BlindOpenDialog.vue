<template>
  <div>
    <el-dialog
      custom-class="blind-dialog"
      top="0vh"
      :fullscreen="true"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="show"
      @open="onOpen"
      @close="handleClose"
      width="789px"
    >
      <div class="title" slot="title">{{ $t("news-detail.open_box") }}</div>
      <img
        style="width: 789px; height: 800px"
        src="@/assets/images/news/gift-bg.png"
      />
      <div class="content">
        <div class="time-container">
          <img
            style="width: 38px; height: 38px"
            src="@/assets/images/news/blind-date.png"
          />
          <div class="time">
            <countdown v-if="showTimer" :time="leftTime" @end="onFinished()">
              <template slot-scope="{ totalSeconds }">{{
                totalSeconds
              }}</template>
            </countdown>
          </div>
        </div>
        <div class="label">
          {{ $t("news-detail.open_rewards") }}
        </div>
        <div class="blind-list">
          <div
            v-for="(item, index) in rewardsOptions"
            class="blind-item"
            :key="index"
            :style="getStyle(index)"
          >
            <img
              v-if="item.coin == 'NFT'"
              :src="require(`@/assets/images/news/bi-icon.png`)"
              style="width: 52px; height: 52px"
            />
            <img
              v-else
              :src="require(`@/assets/images/news/mbd-icon.png`)"
              style="width: 52px; height: 52px"
            />
            <div class="blind-label">
              {{ item.count }} {{ item.coin == "MBD" ? "MBD" : "BJXStar NFT" }}
            </div>
            <div class="blind-value">{{ item.percent }}</div>
          </div>
        </div>
        <div class="btn-container">
          <el-button @click="openClick" class="btn-open">{{
            $t("news-detail.open")
          }}</el-button>
          <el-button @click="giveUpClick" class="btn-give-up">{{
            $t("news-detail.give_up")
          }}</el-button>
        </div>
        <div class="blind-tip">
          {{ $t("news-detail.open_fee") }}
          <span style="color: #ffffff">500 MBD</span>
        </div>
      </div>
    </el-dialog>
    <CongratulationsDialog :boxPrizes="boxPrizes" ref="successDialog" />
  </div>
</template>

<script>
import CongratulationsDialog from "@/components/news/CongratulationsDialog";
import { setBlindBoxState, getBlindBoxCache } from "@/utils/common";
import { openBlindBox, contractOpenBox } from "@/utils/http";
import { transferMbd, approveMbd } from "@/utils/web3/mbd";
import { openBoxContract } from "@/utils/web3/operator";
export default {
  name: "blind-open-dialog",
  components: {
    CongratulationsDialog,
  },
  data() {
    return {
      blindBox: {},
      rewardsOptions: [
        {
          coin: "MBD",
          count: 500,
          percent: "40%",
        },
        {
          coin: "MBD",
          count: 1000,
          percent: "30%",
        },
        {
          coin: "MBD",
          count: 3000,
          percent: "15%",
        },
        {
          coin: "MBD",
          count: 8000,
          percent: "10%",
        },
        {
          coin: "MBD",
          count: 20000,
          percent: "4%",
        },
        {
          coin: "MBD",
          count: 50000,
          percent: "0.9%",
        },
        {
          coin: "NFT",
          count: 5,
          percent: "0.1%",
        },
      ],
      userInfo: this.$store.state.user.userInfo,
      centerAddress: process.env.VUE_APP_RECEIVE_ADDR,
      operatorAddress: process.env.VUE_APP_OPERATOR,
      show: false,
      showTimer: false,
      leftTime: undefined,
      boxPrizes: {},
    };
  },
  methods: {
    /** 打开盲盒 */
    openClick() {
      const executeProcess = () => {
        this.show = false;
        // 合约调用
        var loadingInstance = this.$loading({
          background: "rgba(0, 0, 0, 0.8)",
        });
        if (this.userInfo.isge8model) {
          approveMbd(this.operatorAddress, 500)
            .then(() => {
              openBoxContract()
                .then((txJson) => {
                  contractOpenBox(txJson.transactionHash, this.blindBox.box)
                    .then((r) => {
                      if (r.code == 1) {
                        this.boxPrizes = r.data;
                        this.onFinished();
                        this.$refs["successDialog"].showDialog();
                        this.$emit("handleReload");
                      } else {
                        this.$toast.error(r.message);
                      }
                    })
                    .catch((e) => {
                      this.$toast.error(e && e.message ? e.message : e);
                    })
                    .finally(() => {
                      loadingInstance.close();
                    });
                })
                .catch((e) => {
                  this.$toast.error(e && e.message ? e.message : e);
                  loadingInstance.close();
                });
            })
            .catch((e) => {
              this.$toast.error(e && e.message ? e.message : e);
              loadingInstance.close();
            });
        } else {
          transferMbd(this.centerAddress, 500)
            .then((txJson) => {
              openBlindBox(this.blindBox.box, txJson.transactionHash)
                .then((r) => {
                  if (r.code == 1) {
                    this.boxPrizes = r.data;
                    this.onFinished();
                    this.$refs["successDialog"].showDialog();
                    this.$emit("handleReload");
                  } else {
                    this.$toast.error(r.message);
                  }
                })
                .catch((e) => {
                  this.$toast.error(e && e.message ? e.message : e);
                })
                .finally(() => {
                  loadingInstance.close();
                });
            })
            .catch((e) => {
              this.$toast.error(e && e.message ? e.message : e);
              loadingInstance.close();
            });
        }
      };

      if (this.$store.state.chain.balanceBnb < 0.01) {
        this.$bnbConfirm(this.$store.state.common.language, () => {
          executeProcess();
        });
        return;
      }

      executeProcess();
    },
    onOpen() {
      this.blindBox = getBlindBoxCache(this.$store.state.user.userId);
      const endTime = Number(this.blindBox.time) + 120000;
      this.leftTime = endTime - new Date().getTime();
      if (this.leftTime <= 0) {
        this.onFinished();
      } else {
        this.showTimer = true;
      }
    },
    /** 倒计时结束 */
    onFinished() {
      setBlindBoxState(this.$store.state.user.userId, true);
      this.showTimer = false;
      this.show = false;
    },
    /** 放弃盲盒 */
    giveUpClick() {
      setBlindBoxState(this.$store.state.user.userId, true);
      this.show = false;
    },
    /** 点击关闭 */
    handleClose() {
      setBlindBoxState(this.$store.state.user.userId, true);
      this.show = false;
    },
    showDialog() {
      if (!this.show) {
        this.show = true;
      }
    },
    getStyle(index) {
      return {
        marginRight: index == 3 || index == 6 ? 0 : "8px",
        marginBottom: index > 3 ? 0 : "14px",
      };
    },
  },
};
</script>

<style lang="scss">
.blind-dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  &.el-dialog {
    background-color: black;
    // opacity: 0.8;
    border: none;
  }

  .el-dialog__header {
    position: absolute;
    top: 76px;
    width: 789px;
    z-index: 10;
    padding-top: 0;

    .el-dialog__headerbtn {
      top: 0;
    }
  }

  .title {
    font-size: 30px;
    font-family: Arial;
    font-weight: bold;
    color: #ffffff;

    background: linear-gradient(
      0deg,
      #4195f6 0%,
      #00f9e5 48.2421875%,
      #14e7a9 83.3251953125%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .content {
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 789px;
    padding-top: 158px;

    .time-container {
      width: 266px;
      height: 68px;
      background: rgba(18, 19, 21, 0.5);
      border-radius: 34px;
      font-size: 48px;
      font-family: Arial;
      font-weight: bold;
      color: #ffffff;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-bottom: 46px;

      .time {
        margin-left: 14px;
      }
    }

    .label {
      font-size: 18px;
      font-family: Arial;
      font-weight: bold;
      color: #ffffff;
    }

    .blind-list {
      width: 666px;
      background: linear-gradient(196deg, #f4a6a2 0%, #4195f7 100%);
      border-radius: 20px;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 23px 0;
      margin-top: 74px;

      .blind-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 146px;
        height: 160px;
        background: rgba(30, 118, 214, 0.57);
        border: 3px solid #c0ddff;
        border-radius: 15px;

        .blind-label {
          font-size: 18px;
          font-family: Arial;
          font-weight: bold;
          color: #ffffff;
          margin: 15px 0 18px 0;
        }

        .blind-value {
          font-size: 16px;
          font-family: Arial;
          font-weight: bold;
          color: #ffffff;
        }
      }
    }

    .btn-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 45px;

      .btn-open {
        width: 188px;
        height: 50px;
        background: linear-gradient(0deg, #4195f6, #d0677d);
        border-radius: 25px;
        cursor: pointer;
        color: #ffffff;
      }

      .btn-give-up {
        width: 188px;
        height: 50px;
        background: linear-gradient(0deg, #54687e, #999596);
        border-radius: 25px;
        cursor: pointer;
        margin-left: 46px;
        color: #ffffff;
      }
    }
    .blind-tip {
      font-size: 16px;
      font-family: Arial;
      font-weight: bold;
      color: #8b96a5;
      margin-top: 18px;
    }
  }
}
</style>
