<template>
  <el-dialog
    custom-class="mint-success-dialog"
    @closed="onClose()"
    top="0vh"
    :visible.sync="show"
    width="945px"
  >
    <img
      style="width: 104px; height: 104px; margin-top: 85px"
      src="@/assets/images/create/mint-success.png"
    />
    <div class="mint-success-title">{{ $t("create.congratulations") }}</div>
    <div class="mint-success-label text-color">
      {{ $t("create.minted_success") }}
    </div>
    <div class="mint-success-info">
      <div class="info-label">
        <div class="info-label-item">{{ $t("create.tx_id") }}</div>
        <div class="info-label-item">{{ $t("create.token_address") }}</div>
        <div class="info-label-item">{{ $t("create.token_id") }}</div>
      </div>
      <div class="info-value" v-if="tx.events">
        <div class="info-value-item">{{ tx.transactionHash }}</div>
        <div class="info-value-item">{{ tx.to }}</div>
        <div class="info-value-item">
          {{ tx.events.Authorised.returnValues.tokenId }}
        </div>
      </div>
    </div>
    <div class="btn-container">
      <el-button @click="toViewNft()" class="common-btn2">{{
        $t("create.view_nft")
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "mint-success-dialog",
  props: {
    tx: {
      type: Object,
      default: () => {
        return {
          transactionHash: undefined,
          to: undefined,
          events: {
            Authorised: {
              returnValues: {
                tokenId: undefined,
              },
            },
          },
        };
      },
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
    onClose() {
      this.$emit("close");
    },
    toViewNft() {
      this.$router.replace({
        path: "/news-detail",
        query: { tokenId: this.tx.events.Authorised.returnValues.tokenId },
      });
    },
  },
};
</script>

<style lang="scss">
.mint-success-dialog {
  background: #1a2027;
  border: 1px solid #2c3638;
  border-radius: 12px 6px 6px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .mint-success-title {
    font-size: 30px;
    font-family: Arial;
    font-weight: bold;
    color: #00f9e5;
    margin-top: 35px;
  }

  .mint-success-label {
    font-size: 18px;
    font-family: Arial;
    font-weight: bold;
    margin-top: 23px;
  }

  .mint-success-info {
    background: #212831;
    border-radius: 15px;
    padding: 48px 0 51px 0;
    margin-top: 56px;
    width: 848px;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .info-label {
      text-align: left;

      .info-label-item {
        font-size: 14px;
        font-family: Arial;
        font-weight: 400;
        color: #87a2b7;
        margin-bottom: 22px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .info-value {
      text-align: left;
      margin-left: 41px;

      .info-value-item {
        font-size: 14px;
        font-family: Arial;
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 22px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .btn-container {
    margin: 49px 0 70px 0;
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
