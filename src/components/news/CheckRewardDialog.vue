<template>
  <el-dialog
    custom-class="check-dialog"
    :fullscreen="true"
    @open="onOpen"
    :visible.sync="show"
    width="789px"
  >
    <div class="title" slot="title">
      {{ $t("news-detail.congratulations") }}
    </div>
    <img class="gift-bg" src="@/assets/images/news/gift-bg.png" />
    <div class="content">
      <div class="tip">
        {{ $t("news-detail.gift_account") }}
      </div>
      <img
        style="width: 102px; height: 102px"
        src="@/assets/images/news/mbd-icon.png"
      />
      <div class="value">{{ amount }} MBD</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "checkReward-dialog",
  props: {
    amount: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    showDialog() {
      this.show = true;
    },
    onOpen() {
      setTimeout(() => {
        this.show = false;
      }, 3000);
    },
  },
};
</script>

<style lang="scss">
.check-dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  &.el-dialog {
    background-color: black;
    opacity: 0.8;
    border: none;
  }

  .gift-bg {
    width: 789px;
    height: 800px;
  }

  .el-dialog__header {
    position: absolute;
    top: 160px;
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
    text-align: center;
    color: #ffffff;

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
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 789px;

    .tip {
      font-size: 18px;
      font-family: Arial;
      font-weight: bold;
      color: #ffffff;
      margin: 226px 0 68px 0;
    }

    .value {
      margin-top: 22px;
      font-size: 32px;
      font-family: Arial;
      font-weight: bold;
      color: #ffffff;
    }
  }
}
</style>
