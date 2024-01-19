<template>
  <el-dialog
    custom-class="set-dao-dialog"
    :visible.sync="show"
    width="800px"
    @open="onOpen()"
  >
    <div class="set-dao-header text-color" slot="title">
      {{ $t("create.set_dao") }}
    </div>
    <div class="set-dao-top">
      <el-form ref="form" :rules="rules" :model="form" label-position="top">
        <el-form-item prop="daoFee">
          <div class="label text-color">{{ $t("create.dao_earn") }}</div>
          <div class="set-dao-value" style="margin-left: 0">
            <el-input
              v-model="form.daoFee"
              @blur="handleInputFee"
              class="input"
              placeholder
              style="width: 72px"
            ></el-input>
            <div class="set-dao-unit">%</div>
          </div>
          <div class="set-dao-tip" style="margin-left: 0">
            {{ $t("create.dao_member_receive") }}
            <span class="text-color">{{ form.daoFee }}%</span>
            {{ $t("create.for_sale") }}
          </div>
        </el-form-item>
        <el-form-item prop="mVoteCount">
          <div class="label text-color">{{ $t("create.execution_vote") }}</div>
          <div class="set-dao-value" style="margin-left: 0">
            <el-input
              v-model="form.mVoteCount"
              class="input"
              placeholder
              style="width: 105px"
            ></el-input>
          </div>
          <div class="set-dao-tip" style="margin-left: 0">
            {{ $t("create.modification_value") }}
          </div>
        </el-form-item>
      </el-form>
      <div class="btn-container">
        <el-button class="common-border-btn" plain @click="show = false">{{
          $t("create.cancel")
        }}</el-button>
        <el-button
          :disabled="!isModification"
          class="common-btn2"
          style="margin-left: 59px"
          @click="handleSubmit()"
          >{{ $t("create.apply") }}</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { startSetDaoRule } from "@/utils/web3/nft";
import { getDaoRule, tokensData } from "@/utils/web3/open";
export default {
  name: "set-dao-dialog",
  props: {
    tokenId: {
      type: String,
      default: "",
    },
  },
  computed: {
    isModification() {
      if (
        this.currentJson.mVoteCount == this.form.mVoteCount &&
        this.currentJson.daoFee == this.form.daoFee * 100
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  data() {
    var reg = /^\+?[1-9][0-9]*$/;
    var validateDecimal = (rule, value, callback) => {
      if (isNaN(Number(value)) || Number(value) < 0) {
        callback(new Error("Input value invalid"));
      }
      callback();
    };
    var validateNumber = (rule, value, callback) => {
      if (!reg.test(value)) {
        callback(new Error("Please enter a integer"));
      }
      if (value <= 0) {
        callback(new Error("Must be greater than 0"));
      }
      callback();
    };
    return {
      show: false,
      currentJson: {},
      daoRule: [],
      form: {
        daoFee: undefined,
        mVoteCount: undefined,
      },
      rules: {
        daoFee: [
          {
            required: true,
            message: "Please enter the DAO fee",
            trigger: "blur",
          },
          {
            validator: validateDecimal,
            trigger: "blur",
          },
        ],
        mVoteCount: [
          {
            required: true,
            message: "Please enter the mVoteCount",
            trigger: "blur",
          },
          { validator: validateNumber, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    showDialog() {
      this.show = true;
    },
    /** 提交数据 */
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          var loadingInstance = this.$loading({
            background: "rgba(0, 0, 0, 0.8)",
          });
          var param = JSON.parse(JSON.stringify(this.currentJson));
          param.daoFee = (this.form.daoFee * 100).toFixed();
          param.mVoteCount = this.form.mVoteCount;
          const { daoFee, mVoteCount } = param;
          startSetDaoRule(this.tokenId, {
            daoFee,
            mVoteCount,
          })
            .then(() => {
              this.$toast.success(this.$t("news-detail.submit_success"));
              this.$emit("handleReload");
              this.show = false;
            })
            .catch((e) => {
              this.$toast.error(e && e.message ? e.message : e);
            })
            .finally(() => {
              loadingInstance.close();
            });
        }
      });
    },
    /** 加载数据 */
    onOpen() {
      if (this.tokenId) {
        var loadingInstance = this.$loading({
          background: "rgba(0, 0, 0, 0.8)",
        });
        Promise.all([this.getTokenInfoData(), this.getDaoRuleData()]).then(
          () => {
            this.currentJson.creatorAddress = this.daoRule[3];
            this.currentJson.curCreatorFees = this.daoRule[4];
            loadingInstance.close();
          }
        );
      }
    },
    /** 加载tokenInfo */
    getTokenInfoData() {
      return new Promise((resolve, reject) => {
        tokensData(this.tokenId)
          .then((res) => {
            this.currentJson = res;
            this.form.mVoteCount = res.mVoteCount;
            this.form.daoFee = (res.daoFee / 100).toFixed(2);
            return resolve();
          })
          .catch((e) => {
            return reject(e);
          });
      });
    },
    /** 加载DaoRule */
    getDaoRuleData() {
      return new Promise((resolve, reject) => {
        getDaoRule(this.tokenId)
          .then((daoRule) => {
            this.daoRule = daoRule;
            return resolve();
          })
          .catch((e) => {
            return reject(e);
          });
      });
    },
    handleInputFee(e) {
      this.form.daoFee = e.target.value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
    },
  },
};
</script>

<style lang="scss">
.set-dao-dialog {
  background: #1a2027;
  border: 1px solid #2c3638;
  border-radius: 12px 6px 6px 6px;

  .set-dao-header {
    text-align: left;
    font-size: 24px;
    font-family: Arial;
    font-weight: bold;
  }

  .set-dao-top {
    border: 1px solid #1f272f;
    margin: 33px 47px 20px 47px;
    padding: 20px;
    text-align: left;

    .label {
      font-size: 18px;
      font-family: Arial;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 17px;
    }
  }

  .set-dao-form {
    background: #212831;
    border-radius: 11px;
    padding: 38px 0 44px 0;
  }

  .set-dao-title {
    font-size: 20px;
    font-family: Arial;
    font-weight: bold;
    color: #17e7d6;
    margin: 0 35px;
  }

  .set-dao-label {
    font-size: 13px;
    font-family: Arial;
    font-weight: bold;
    margin: 38px 35px 0 35px;
  }

  .set-dao-value {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 20px 35px 0 35px;

    .set-dao-unit {
      margin-left: 8px;
      font-size: 14px;
      font-family: Arial;
      font-weight: bold;
      color: #00f9e5;
    }

    .verify {
      width: 76px;
      height: 48px;
      line-height: 48px;
      background: #31cad7;
      border: 1px solid #313838;
      border-radius: 8px;
      font-size: 10px;
      font-family: Arial;
      font-weight: bold;
      color: #212831;
      text-align: center;
      margin-left: 8px;
    }
  }

  .set-dao-add {
    width: 624px;
    height: 48px;
    line-height: 48px;
    background: #0e161d;
    border: 1px solid #313838;
    border-radius: 8px;
    font-size: 10px;
    font-family: Arial;
    font-weight: 400;
    color: #87a2b7;
    text-align: center;
    margin: 22px 0 0 35px;
  }

  .set-dao-tip {
    font-size: 12px;
    font-family: Arial;
    font-weight: 400;
    color: #747c7c;
  }

  .btn-container {
    margin-top: 95px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 74px;

    .common-border-btn,
    .common-btn2 {
      width: 188px;
    }

    .common-border-btn {
      border: 1px solid #26beef;
      border-radius: 7px;
      font-size: 16px;
      font-family: Arial;
      font-weight: bold;
      color: #14daeb;
      background: transparent;
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
}
</style>
