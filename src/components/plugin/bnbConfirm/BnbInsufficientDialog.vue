<template>
  <el-dialog custom-class="bnb-dialog" :visible.sync="show" width="800px">
    <div class="income-header text-color" slot="title">
      {{ title }}
    </div>
    <div class="desc-content" v-html="content"></div>
    <br />
    <span class="how-to" @click="goBuyNbn()">{{ howTo }}</span>
    <div class="confirm">
      <el-button class="confirm-btn" @click="goBuyNbn()">{{
        getBnb
      }}</el-button>
      <el-button class="cancel-btn" @click="handleConfirm()">{{
        continueGo
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "bnb-dialog",
  props: {
    lang: {
      type: String,
      default: "en",
    },
    onConfirm: Function,
  },
  computed: {
    title() {
      if (this.lang == "en") {
        return "Important Reminder";
      } else {
        return "重要提醒";
      }
    },
    content() {
      if (this.lang == "en") {
        return "The amount of BNB in your current account is less than <span class='color-word'>0.01BNB</span>, which may prevent you from completing this operation. Please add BNB to your wallet address as soon as possible.";
      } else {
        return "您當前賬戶中的BNB數量已不足<span class='color-word'>0.01BNB</span>，可能導致您無法繼續完成本次操作，請盡快補充BNB到您的錢包地址。";
      }
    },
    howTo() {
      if (this.lang == "en") {
        return "How to get BNB?";
      } else {
        return "如何獲得BNB";
      }
    },
    getBnb() {
      if (this.lang == "en") {
        return "Get BNB";
      } else {
        return "獲取BNB";
      }
    },
    continueGo() {
      if (this.lang == "en") {
        return "Continue";
      } else {
        return "繼續";
      }
    },
  },
  data() {
    return {
      show: true,
    };
  },
  methods: {
    showDialog() {
      this.show = true;
    },
    handleConfirm() {
      this.onConfirm();
      this.show = false;
      this.$nextTick(() => {
        this.$destroy(); // 手动销毁组件实例
        this.$el.parentNode.removeChild(this.$el); // 从 DOM 中移除元素
      });
    },
    goBuyNbn() {
      if (this.lang == "en") {
        window.open(
          "https://docs.douji.ai/getting-started/how-to-get-bnb",
          "_blank"
        );
      } else {
        window.open(
          "https://docs.douji.ai/v/zh-hk/getting-started/how-to-get-bnb",
          "_blank"
        );
      }
    },
  },
};
</script>

<style lang="scss">
.bnb-dialog {
  background: #1a2027;
  border: 1px solid #2c3638;
  border-radius: 12px 6px 6px 6px;

  .income-header {
    text-align: left;
    font-size: 20px;
    font-family: Arial;
    font-weight: bold;
    margin-left: 10px;
    margin-top: 30px;
    color: #00f9e5;
  }

  .desc-content {
    border: 1px solid #1f272f;
    padding: 30px 52px 30px 52px;
    text-align: left;
    color: white;
    line-height: 30px;
    word-wrap: break-word;
    word-break: keep-all;

    .color-word {
      font-weight: bold;
      color: #00f9e5;
    }
  }

  .how-to {
    font-size: 18px;
    padding: 10px 52px 0 52px;
    color: rgb(27, 164, 153);
    cursor: pointer;
    font-weight: bold;
  }

  .how-to:hover {
    color: #00f9e5;
  }

  .confirm {
    margin: 43px 52px 68px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .confirm-btn {
      width: 188px;
      height: 50px;
      background: linear-gradient(-16deg, #4195f6, #17e7d6) !important;
      border-radius: 25px;
      cursor: pointer;
      color: black;
    }

    .cancel-btn {
      width: 188px;
      height: 50px;
      background: linear-gradient(0deg, #54687e, #999596);
      border-radius: 25px;
      cursor: pointer;
      margin-left: 46px;
      color: black;
    }
  }
}

.el-dialog {
  background: #1a2027;
  border: 1px solid #2c3638;
  border-radius: 12px 6px 6px 6px;
}

.el-dialog__body {
  padding: 0 0;
}

.el-switch.is-checked .el-switch__core {
  border-color: #00f9e5;
  background-color: #00f9e5;
}

.el-input__inner {
  height: 35px;
  line-height: 35px;
}

.el-table {
  font-size: 9px;
}

.el-table,
.el-table tr,
.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background-color: transparent;
}

.el-table th.el-table__cell {
  background-color: #252d36;
}

.el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border-bottom: 1px solid #1f262e;
}

.el-table-column--selection .cell {
  padding-left: 11px;
  padding-right: 11px;
}

.el-checkbox__inner {
  background-color: transparent;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #acbcc9;
  border-color: transparent;
}

.el-table th.el-table__cell,
.el-table td.el-table__cell {
  &:first-child {
    text-align: center;
  }

  &:last-child {
    padding-right: 14px;
    text-align: right;
  }

  &:nth-child(4),
  &:nth-child(5) {
    text-align: center;
  }
}

.el-table--fit {
  border-bottom: 1px solid #1f262e;
}

.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden;
}

.el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: transparent;
}
</style>
