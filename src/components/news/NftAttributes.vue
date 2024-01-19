<template>
  <div class="form-attr-container">
    <div class="form-attr-title">
      {{ $t('news-detail.attributes') }}
    </div>
    <div class="form-attr-list">
      <div class="form-attr-item">
        <div class="form-attr-label">{{ $t('news-detail.content_type') }}</div>
        <div class="form-attr-value">{{ metadata.contentType }}</div>
      </div>
      <div class="form-attr-item">
        <div class="form-attr-label">{{ $t('news-detail.category') }}</div>
        <div class="form-attr-value">{{ metadata.category }}</div>
      </div>
      <div class="form-attr-item" v-if="metadata.prompt">
        <div class="form-attr-label">{{ $t('news-detail.platform') }}</div>
        <div class="form-attr-value">{{ metadata.prompt }}</div>
      </div>
      <div class="form-attr-item" v-if="metadata.language">
        <div class="form-attr-label">{{ $t('news-detail.language') }}</div>
        <div class="form-attr-value">{{ metadata.language }}</div>
      </div>
      <div class="form-attr-item">
        <div class="form-attr-label">{{ $t('news-detail.max_supply') }}</div>
        <div class="form-attr-value">
          {{ tokensInfo.maxSupply | toLocalString }}
        </div>
      </div>
      <div class="form-attr-item">
        <div class="form-attr-label">
          {{ $t('news-detail.available_supply') }}
        </div>
        <div class="form-attr-value">{{ availableSupply | toLocalString }}</div>
      </div>
      <div class="form-attr-item">
        <div class="form-attr-label">{{ $t('news-detail.curr_supply') }}</div>
        <div class="form-attr-value">
          {{ tokensInfo.currentSupply | toLocalString }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'nft-attributes',
  props: {
    metadata: {
      type: Object,
      default: () => {},
    },
    tokensInfo: {
      type: Object,
      default: () => {},
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
        this.tokensInfo.vote.voteType == '2'
      ) {
        return this.tokensInfo.vote.tmpToken.availableSupply
      } else if (this.tokensInfo) {
        return this.tokensInfo.availableSupply
      } else {
        return null
      }
    },
  },
}
</script>

<style lang="scss">
.form-attr-container {
  border-radius: 6px;
  margin-bottom: 22px;
  height: auto;

  .form-attr-title {
    height: 66px;
    line-height: 66px;
    padding: 0 23px;
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
      border-radius: 6px;
      margin-bottom: 18px;

      .form-attr-label {
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        margin-left: 12px;
      }

      .form-attr-value {
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: bold;
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

    .form-attr-mint {
      margin: 17px 0 9px 0;
      border-radius: 18px;
      font-size: 13px;
      font-family: Arial;
      font-weight: bold;
      color: #1a2027;
      width: 100%;
    }

    .form-attr-tip {
      font-size: 10px;
      font-family: Arial;
      font-weight: 400;
      color: #88a2b8;
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
