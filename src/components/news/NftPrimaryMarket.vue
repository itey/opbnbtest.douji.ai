<template>
  <div
    class="form-attr-container"
    v-loading="loading"
    :element-loading-background="$store.state.common.theme | maskByTheme"
  >
    <div class="form-attr-title text-color">
      {{ $t("news-detail.pri_title") }}
    </div>
    <div class="form-attr-market">
      <div class="form-attr-market-top">
        <div class="form-attr-available">
          {{ $t("news-detail.pri_ava") }} :
          <span class="text-color">{{ availableSupply | toLocalString }}</span>
        </div>
        <div class="form-attr-available" v-if="$store.state.user.account">
          {{ $t("news-detail.pri_own") }} :
          <span class="text-color">{{ userOwned }}</span>
        </div>
      </div>
      <template
        v-if="
          $store.state.user.account &&
          discountPrice &&
          discountPrice != currentPrice
        "
      >
        <div class="form-attr-mbd">
          <div class="mbd-value text-color">
            {{ discountPrice | decimalPlace4 }} MBD
          </div>
          <div class="mbd-transform">
            ≈${{
              (discountPrice * $store.state.chain.mbdPrice) | decimalPlace8
            }}
          </div>
        </div>
        <div class="form-attr-discount">
          {{ $t("news-detail.pri_ori") }}:
          {{ currentPrice | decimalPlace4 }} MBD
        </div>
      </template>
      <template v-else>
        <div class="form-attr-mbd">
          <div class="mbd-value text-color">
            {{ currentPrice | decimalPlace4 }} MBD
          </div>
          <div class="mbd-transform">
            ≈${{ (currentPrice * $store.state.chain.mbdPrice) | decimalPlace8 }}
          </div>
        </div>
      </template>
      <el-button
        @click="handleMint()"
        :disabled="editShow || availableSupply <= 0"
        class="common-btn2 form-attr-mint"
        >{{ $t("news-detail.pri_mint") }}</el-button
      >
      <div class="form-attr-tip" v-if="discountJson && discountJson.isOpen">
        <div>
          {{ $t("news-detail.pri_owning") }}
          <span class="text-color">{{ discountJson.discounts }}</span>
          {{ $t("news-detail.pri_to_get") }}
          <span class="text-color">{{
            discountJson.discountsFee | fee2Percent
          }}</span>
          {{ $t("news-detail.pri_dis") }}
        </div>
        <div>
          {{ $t("news-detail.pri_contract") }}:
          <span
            class="text-color contract-address"
            @click="toBnbScan(discountJson.cAddress)"
            >{{ discountJson.cAddress | omitAddress }}</span
          >
          ({{ discountJson.sptType | sptType2Name }})
          <span v-if="discountJson.tokenId"
            >{{ $t("news-detail.pri_token_id") }}:{{
              discountJson.tokenId
            }}</span
          >
        </div>
        <div
          v-if="
            $store.state.user.account && discountJson && discountJson.isOpen
          "
        >
          {{ $t("news-detail.pri_token_own") }}:
          <span class="text-color">{{ disTokenOwned }}</span>
          <span v-if="disTokenOwned > 0"
            >({{ unusedCount || "0" }} {{ $t("news-detail.pri_unused") }})</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { weiToMbd } from "@/utils/common";
import { eventBus } from "@/utils/event-bus";
import { approveMbd } from "@/utils/web3/mbd";
import { getAlreadyDiscounts, userMint } from "@/utils/web3/nft";
import {
  getErc1155BalanceOf,
  getErc20BalanceOf,
  getErc721BalanceOf,
} from "@/utils/web3/open";
export default {
  name: "nft-attributes",
  props: {
    tokenId: {
      type: String,
      default: "",
    },
    metadata: {
      type: Object,
      default: () => {},
    },
    tokensInfo: {
      type: Object,
      default: () => {},
    },
    userOwned: {
      type: String,
      default: "0",
    },
    editShow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    availableSupply() {
      if (
        this.editShow &&
        this.tokensInfo &&
        this.tokensInfo.isVoting &&
        this.tokensInfo.vote.voteType == "2"
      ) {
        return this.tokensInfo.vote.tmpToken.availableSupply;
      } else if (this.tokensInfo) {
        return this.tokensInfo.availableSupply;
      } else {
        return null;
      }
    },
    currentPrice() {
      if (
        this.editShow &&
        this.tokensInfo &&
        this.tokensInfo.isVoting &&
        this.tokensInfo.vote.voteType == "2"
      ) {
        return weiToMbd(this.tokensInfo.vote.tmpToken.price.price);
      } else if (this.tokensInfo.price) {
        return weiToMbd(this.tokensInfo.price.price);
      } else {
        return null;
      }
    },
    discountJson() {
      if (
        this.editShow &&
        this.tokensInfo &&
        this.tokensInfo.isVoting &&
        this.tokensInfo.vote.voteType == "3"
      ) {
        return {
          cAddress: this.tokensInfo.vote.tmpToken.nsp.cAddress,
          discounts: this.tokensInfo.vote.tmpToken.nsp.discounts,
          discountsFee: this.tokensInfo.vote.tmpToken.nsp.discountsFee,
          isOpen: this.tokensInfo.vote.tmpToken.nsp.isOpen,
          sptType: this.tokensInfo.vote.tmpToken.nsp.sptType,
          tokenId: this.tokensInfo.vote.tmpToken.nsp.tokenId,
        };
      } else if (this.tokensInfo.nsp) {
        return {
          cAddress: this.tokensInfo.nsp.cAddress,
          discounts: this.tokensInfo.nsp.discounts,
          discountsFee: this.tokensInfo.nsp.discountsFee,
          isOpen: this.tokensInfo.nsp.isOpen,
          sptType: this.tokensInfo.nsp.sptType,
          tokenId: this.tokensInfo.nsp.tokenId,
        };
      } else {
        return {};
      }
    },
  },
  watch: {
    "$store.state.user.account": function (val, od) {
      if (val != od) {
        this.getDiscountPrice();
      }
    },
    tokensInfo: function (val, od) {
      if (val != od) {
        this.getDiscountPrice();
      }
    },
  },
  data() {
    return {
      loading: false,
      nftContract: process.env.VUE_APP_NFT,
      bnbScanUrl: process.env.VUE_APP_BNB_SCAN_URL,
      discountPrice: undefined,
      unusedCount: undefined,
      disTokenOwned: 0,
      disTOkenUsed: 0,
    };
  },
  mounted() {
    this.getDiscountPrice();
  },
  methods: {
    /** 用户点击mint */
    async handleMint() {
      const c = await this.$store.dispatch("CheckLogin", true);
      if (!c) {
        return;
      }

      if (this.$store.state.chain.balanceBnb < 0.01) {
        this.$bnbConfirm(this.$store.state.common.language, () => {
          this.mintExecute();
        });
        return;
      }
      this.mintExecute();
    },
    /** 执行mint */
    async mintExecute() {
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      var mintPrice = this.currentPrice;
      if (this.discountPrice && this.discountPrice > 0) {
        mintPrice = this.discountPrice;
      }
      if (mintPrice && mintPrice > 0) {
        try {
          await approveMbd(this.nftContract, mintPrice);
        } catch (e) {
          console.log(e);
          this.$toast.error(e && e.message ? e.message : e);
          loadingInstance.close();
          return;
        }
      }
      try {
        await userMint(this.tokenId, 1);
      } catch (e) {
        console.log(e);
        this.$toast.warning(e);
        loadingInstance.close();
        return;
      }
      this.$toast.success(this.$t("news-detail.nft_mint_success"));
      loadingInstance.close();
      this.$emit("handleReload");
      eventBus.$emit("refresh_stake_info");
    },
    /** 计算折扣额 */
    async getDiscountPrice() {
      if (!this.$store.state.user.account) {
        return;
      }
      if (this.editShow) {
        return;
      }
      if (!this.discountJson || !this.discountJson.isOpen) {
        return;
      }
      const bepType = this.discountJson.sptType;
      this.disTOkenUsed = await this.getUserAlreadyDiscounts();
      if (bepType == "0") {
        // erc20
        this.disTokenOwned = await getErc20BalanceOf(
          this.discountJson.cAddress,
          this.$store.state.user.account
        );
      }
      if (bepType == "1") {
        // erc721
        this.disTokenOwned = await getErc721BalanceOf(
          this.discountJson.cAddress,
          this.$store.state.user.account
        );
      }
      if (bepType == "2") {
        // erc1155
        this.disTokenOwned = await getErc1155BalanceOf(
          this.discountJson.cAddress,
          this.$store.state.user.account,
          this.discountJson.tokenId
        );
      }
      if (this.disTokenOwned == 0) {
        return;
      }

      if (
        this.disTokenOwned - this.disTOkenUsed - this.discountJson.discounts <
        0
      ) {
        this.unusedCount = 0;
      }
      if (
        this.disTokenOwned - this.disTOkenUsed - this.discountJson.discounts >=
        0
      ) {
        this.unusedCount =
          this.disTokenOwned -
          this.disTOkenUsed -
          this.discountJson.discounts +
          1;
        this.discountPrice =
          this.currentPrice * (1 - this.discountJson.discountsFee / 10000);
      }
    },
    /** 获取我已经使用的折扣数量 */
    getUserAlreadyDiscounts() {
      if (!this.$store.state.user.userId) {
        return;
      }
      return new Promise((resolve, reject) => {
        getAlreadyDiscounts(this.discountJson.cAddress)
          .then((r) => {
            return resolve(r);
          })
          .catch((e) => {
            return reject(e);
          });
      });
    },
    /** 查看折扣Token信息 */
    toBnbScan(address) {
      window.open(this.bnbScanUrl + "/address/" + address, "_blank");
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
        }
      }
    }

    .form-attr-mbd {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      margin-top: 20px;

      .mbd-value {
        font-weight: bold;
        font-size: 36px;
      }

      .mbd-transform {
        color: #acbcc9;
        font-size: 14px;
      }

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

    .form-attr-discount {
      margin-top: 5px;
      font-size: 15px;
      color: #acbcc9;
    }

    .form-attr-mint {
      margin: 17px 0 9px 0;
      border-radius: 18px;
      font-size: 15px;
      font-family: Arial;
      font-weight: bold;
      color: #1a2027;
      width: 100%;
    }

    .form-attr-tip {
      font-size: 12px !important;
      font-family: Arial;
      font-weight: 400;
    }

    .contract-address {
      cursor: pointer;
    }
    .contract-address:hover {
      color: #3c9ef2;
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
