<template>
  <el-dialog
    custom-class="congratulations-dialog"
    top="0vh"
    :fullscreen="true"
    @open="onOpen"
    :visible.sync="show"
    width="789px"
  >
    <div class="title" slot="title">
      {{ $t("news-detail.congratulations") }}
    </div>
    <img
      style="width: 789px; height: 800px"
      src="@/assets/images/news/gift-bg.png"
    />
    <template v-if="boxPrizes">
      <div class="content" v-if="boxPrizes.coin == 'MBD'">
        <div class="tip">
          {{ $t("news-detail.gift_account") }}
        </div>
        <img
          style="width: 102px; height: 102px"
          src="@/assets/images/news/mbd-icon.png"
        />
        <div class="value">{{ boxPrizes.amount }} MBD</div>
      </div>
      <div class="content" v-else>
        <div class="tip">
          {{ $t("news-detail.gift_account") }}
        </div>
        <img
          style="width: 102px; height: 102px"
          src="@/assets/images/news/bi-icon.png"
        />
        <div class="value">{{ boxPrizes.amount }} BJXStar NFT</div>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "congratulations-dialog",
  props: {
    boxPrizes: {
      type: Object,
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
.congratulations-dialog {
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
