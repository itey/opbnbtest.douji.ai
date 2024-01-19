<template>
  <div>
    <el-dialog
      custom-class="check-in-dialog"
      :fullscreen="true"
      :visible.sync="show"
      width="789px"
    >
      <div class="title" slot="title">
        {{ $t("news-detail.daily_check_gift") }}
      </div>
      <div class="content">
        <!-- <div class="title">{{ $t("news-detail.daily_check_gift") }}</div> -->
        <img
          style="width: 244px; height: 256px"
          src="@/assets/images/news/gift-icon.png"
        />
        <el-button @click="handleCheckIn()" class="common-btn2">{{
          $t("news-detail.get_id")
        }}</el-button>
      </div>
    </el-dialog>
    <CheckRewardDialog ref="rewardDialog" :amount="rewardAmount" />
  </div>
</template>

<script>
import CheckRewardDialog from "./CheckRewardDialog";
export default {
  name: "check-in-dialog",
  data() {
    return {
      show: false,
      rewardAmount: undefined,
    };
  },
  components: {
    CheckRewardDialog,
  },
  methods: {
    showDialog() {
      this.show = true;
    },
    /** 点击签到 */
    handleCheckIn() {
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      this.$store
        .dispatch("CheckInDaily")
        .then((r) => {
          this.$toast.success(this.$t("common.check_in_success"));
          this.$emit("onCheckedIn");
          if (r && r.amount) {
            this.rewardAmount = r.amount;
            this.$refs["rewardDialog"].showDialog();
          }
          this.show = false;
        })
        .catch((e) => {
          console.log(e);
          this.$toast.error(this.$t("common.check_in_failed"));
        })
        .finally(() => {
          loadingInstance.close();
        });
    },
  },
};
</script>

<style lang="scss">
.check-in-dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

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
    top: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 789px;
    .title {
      margin-top: 20px;
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
      margin-bottom: 100px;
    }
    .common-btn2 {
      margin-top: 69px;
      width: 188px;
      height: 50px;
      background: linear-gradient(-16deg, #4195f6, #c469e1);
      border-radius: 25px;
      font-size: 18px;
      font-family: Arial;
      font-weight: bold;
      color: #ffffff;
    }
  }
}
</style>
