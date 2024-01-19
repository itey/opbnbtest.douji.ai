<template>
  <el-dialog
    custom-class="blind-dialog"
    top="0vh"
    :fullscreen="true"
    :destroy-on-close="true"
    :visible.sync="show"
    @close="handleClose"
    @open="onOpen"
    width="789px"
  >
    <div class="title" slot="title">{{ $t("news-detail.receive_box") }}</div>
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
      <img
        style="width: 388px; height: 347px"
        src="@/assets/images/news/blind-box-icon.png"
      />
      <el-button @click="handleReceiveBox()" class="btn">{{
        $t("news-detail.receive")
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getBlindBoxFlagCache,
  setBlindBoxCache,
  setBlindBoxFlagState,
} from "@/utils/common";
import { getBoxContract } from "@/utils/web3/operator";
import { getBlindBox, contractGetBox } from "@/utils/http";
import { getBlindBoxSign } from "@/utils/web3/chain";
export default {
  name: "blind-dialog",
  props: {
    tokenId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      show: false,
      showTimer: false,
      leftTime: undefined,
      userInfo: this.$store.state.user.userInfo,
      boxFlag: {},
    };
  },
  methods: {
    onOpen() {
      this.boxFlag = getBlindBoxFlagCache(this.$store.state.user.userId);
      const endTime = Number(this.boxFlag.time) + 120000;
      this.leftTime = endTime - new Date().getTime();
      if (this.leftTime <= 0) {
        this.onFinished();
      } else {
        this.showTimer = true;
      }
    },
    /** 接收盲盒 */
    handleReceiveBox() {
      const executeProcess = () => {
        // 合约接收
        var loadingInstance = this.$loading({
          background: "rgba(0, 0, 0, 0.8)",
        });
        getBoxContract(this.tokenId)
          .then((txJson) => {
            const txId = txJson.transactionHash;
            contractGetBox(txId)
              .then((r) => {
                if (r.code == 1) {
                  const openFlag = r.data.open_box_flag;
                  setBlindBoxCache(this.$store.state.user.userId, openFlag);
                  this.show = false;
                  this.$emit("handleReceive");
                } else {
                  console.log(r.message);
                  this.$toast.error(
                    this.$t("news-detail.get_blind_box_failed")
                  );
                  loadingInstance.close();
                }
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
      };
      if (this.userInfo.isge8model) {
        if (this.$store.state.chain.balanceBnb < 0.01) {
          this.$bnbConfirm(this.$store.state.common.language, () => {
            executeProcess();
          });
          return;
        }
        executeProcess();
      } else {
        getBlindBoxSign().then((signed) => {
          var loadingInstance = this.$loading({
            background: "rgba(0, 0, 0, 0.8)",
          });
          getBlindBox(signed, this.boxFlag.flag, this.tokenId)
            .then((r) => {
              if (r.code == 1) {
                const openFlag = r.data.open_box_flag;
                setBlindBoxCache(this.$store.state.user.userId, openFlag);
                this.show = false;
                this.$emit("handleReceive");
              } else {
                console.log(r.message);
                this.$toast.error(this.$t("news-detail.get_blind_box_failed"));
              }
            })
            .catch((e) => {
              console.log(e);
              this.$toast.error(this.$t("news-detail.get_blind_box_failed"));
            })
            .finally(() => {
              loadingInstance.close();
            });
        });
      }
    },
    showDialog() {
      if (!this.show) {
        this.show = true;
      }
    },
    /** 倒计时结束 */
    onFinished() {
      setBlindBoxFlagState(this.$store.state.user.userId, true);
      this.showTimer = false;
      this.show = false;
    },
    /** 用户关闭 */
    handleClose() {
      setBlindBoxFlagState(this.$store.state.user.userId, true);
      this.show = false;
    },
  },
};
</script>

<style lang="scss">
.blind-dialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;

  &.el-dialog {
    background-color: black;
    opacity: 0.8;
    border: none;
  }

  .el-dialog__header {
    position: absolute;
    top: 76px;
    width: 789px;
    z-index: 10;
    padding-top: 0;
    text-align: center;

    .el-dialog__headerbtn {
      top: 0;
    }
  }

  .el-dialog__body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
  }

  .title {
    align-items: center;
    align-self: center;
    font-size: 30px;
    font-family: Arial;
    font-weight: bold;
    color: #ffffff;
    text-align: center;

    background: linear-gradient(
      0deg,
      #4195f6 0%,
      #00f9e5 48.2421875%,
      #14e7a9 83.3251953125%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .content {
    background-image: url("@/assets/images/news/gift-bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: absolute;
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
      margin-bottom: 20px !important;

      .time {
        margin-left: 14px;
      }
    }

    .btn {
      width: 188px;
      height: 50px;
      background: linear-gradient(0deg, #4195f6, #d0677d);
      border-radius: 25px;
      margin-top: 35px;
      cursor: pointer;
      color: #ffffff;
    }
  }
}
</style>
