<template>
  <el-dialog
    custom-class="list-your-item-dialog"
    :visible.sync="show"
    @open="getUserOwned()"
    width="946px"
  >
    <div class="list-your-item-header text-color" slot="title">
      {{ $t("news-detail.list_item") }}
    </div>
    <div class="list-your-item-content">
      <div class="item-input-container">
        <div class="item-label text-color">
          {{ $t("news-detail.sale_price") }}
        </div>
        <div class="item-value">
          <div class="item-input">
            <el-input
              v-model="salePrice"
              class="input"
              placeholder
              style="width: 200px"
            ></el-input>
            <div class="item-unit">MBD</div>
          </div>
          <div class="error-tip" v-if="error.salePrice">
            {{ error.salePrice }}
          </div>
          <div class="item-tip" v-else>
            {{ $t("news-detail.min_price_tip") }}
          </div>
        </div>
      </div>
      <div class="item-input-container">
        <div class="item-label text-color">
          {{ $t("news-detail.item_quantity") }}
        </div>
        <div class="item-value">
          <div class="item-input">
            <el-input
              v-model="saleQuantity"
              class="input"
              placeholder
              style="width: 200px"
            ></el-input>
          </div>
          <div class="error-tip" v-if="error.saleQuantity">
            {{ error.saleQuantity }}
          </div>
          <div class="item-tip" v-else>
            {{ $t("news-detail.max_quantity") }}
            <span class="text-color">{{ userOwned }}</span>
          </div>
        </div>
      </div>
      <div class="btn-container">
        <el-button @click="handleCreate()" class="common-btn2">{{
          $t("news-detail.create_order")
        }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { createSaleOrder } from "@/utils/web3/market";
import { balanceOf, nftApproval } from "@/utils/web3/nft";
export default {
  name: "list-your-item-dialog",
  props: {
    tokenId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      show: false,
      salePrice: null,
      saleQuantity: null,
      marketAddress: process.env.VUE_APP_MARKET,
      userOwned: 0,
      error: {
        salePrice: undefined,
        saleQuantity: undefined,
      },
      ifPass: {
        salePrice: true,
        saleQuantity: true,
      },
    };
  },
  methods: {
    /** 点击创建订单 */
    async handleCreate() {
      if (!this.formCheck()) {
        return;
      }
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      try {
        await nftApproval(this.marketAddress);
      } catch (error) {
        console.log(error);
        this.$toast.error(error);
        loadingInstance.close();
        return;
      }
      try {
        await createSaleOrder(
          this.tokenId,
          Number(this.saleQuantity),
          Number(this.salePrice)
        );
        loadingInstance.close();
        this.$toast.success(this.$t("news-detail.order_create_success"));
        this.show = false;
      } catch (error) {
        console.log(error);
        this.$toast.error(error);
      } finally {
        loadingInstance.close();
      }
    },
    /** 数据校验 */
    formCheck() {
      this.ifPass = {
        salePrice: true,
        saleQuantity: true,
      };
      var ifSuccess = true;
      var reg = /^\+?[1-9][0-9]*$/;
      if (!this.salePrice) {
        this.error.salePrice = this.$t("news-detail.order_price_required");
        ifSuccess = false;
        this.ifPass.salePrice = false;
      }
      if (isNaN(Number(this.salePrice)) || Number(this.salePrice) <= 0) {
        this.error.salePrice = this.$t("news-detail.order_price_invalid");
        ifSuccess = false;
        this.ifPass.salePrice = false;
      }
      if (!this.saleQuantity) {
        this.error.saleQuantity = this.$t(
          "news-detail.order_quantity_required"
        );
        ifSuccess = false;
        this.ifPass.saleQuantity = false;
      }
      if (
        !reg.test(this.saleQuantity) ||
        Number(this.saleQuantity) <= 0 ||
        Number(this.saleQuantity) > this.userOwned
      ) {
        this.error.saleQuantity = this.$t("news-detail.order_quantity_invalid");
        ifSuccess = false;
        this.ifPass.saleQuantity = false;
      }

      if (this.ifPass.salePrice) {
        this.error.salePrice = "";
      }

      if (this.ifPass.saleQuantity) {
        this.error.saleQuantity = "";
      }
      return ifSuccess;
    },
    /** 显示控制 */
    showDialog() {
      this.show = true;
    },
    /** 获取用户拥有数量 */
    getUserOwned() {
      return new Promise((resolve, reject) => {
        balanceOf(this.tokenId)
          .then((balance) => {
            this.userOwned = balance;
            return resolve();
          })
          .catch((e) => {
            return reject(e);
          });
      });
    },
  },
};
</script>

<style lang="scss">
.list-your-item-dialog {
  background: #1a2027;
  border: 1px solid #2c3638;
  border-radius: 12px 6px 6px 6px;

  .list-your-item-header {
    text-align: left;
    font-size: 17px;
    font-family: Arial;
    font-weight: bold;
  }

  .list-your-item-content {
    margin-top: 21px;

    .item-input-container {
      margin-top: 34px;
      display: flex;
      flex-direction: row;

      .item-label {
        margin-left: 193px;
        width: 152px;
        font-size: 18px;
        line-height: 48px;
        font-family: Arial;
        font-weight: bold;
        color: #9faec0;
      }

      .item-value {
        .item-input {
          display: flex;
          flex-direction: row;
          align-items: center;

          .input {
            background: #0e161d;
            border-radius: 8px;
          }

          .item-unit {
            font-size: 14px;
            line-height: 48px;
            font-family: Arial;
            font-weight: bold;
            color: #00f9e5;
            margin-left: 10px;
          }
        }

        .item-tip {
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #747c7c;
          margin-top: 16px;
          text-align: left;
        }

        .error-tip {
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #a50507;
          margin-top: 16px;
          text-align: left;
        }
      }
    }
  }

  .btn-container {
    margin: 71px 0 89px 351px;
    text-align: left;

    .common-btn2 {
      width: 188px;
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

.el-input__inner {
  height: 48px;
  line-height: 48px;
}
</style>
