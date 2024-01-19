<template>
  <el-dialog custom-class="settle-confirm" :visible.sync="show" width="1100px">
    <div class="income-header text-color" slot="title">
      {{ $t("user.plat_d_title") }}
    </div>
    <div
      class="desc-content"
      v-html="$t('user.plat_d_desc', [settleFee])"
    ></div>
    <div class="confirm">
      <el-button class="confirm-btn" @click="handleConfirm()">{{
        $t("user.settlement")
      }}</el-button>
      <el-button class="cancel-btn" @click="show = false">{{
        $t("user.cancel")
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "settle-confirm",
  props: {
    settleFee: {
      type: String,
      default: "0.0000",
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
    handleConfirm() {
      this.$emit("confirm");
      this.show = false;
    },
  },
};
</script>

<style lang="scss">
.settle-confirm {
  background: #1a2027;
  border: 1px solid #2c3638;
  border-radius: 12px 6px 6px 6px;

  .income-header {
    text-align: left;
    font-size: 17px;
    font-family: Arial;
    font-weight: bold;
    margin-left: 35px;
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
