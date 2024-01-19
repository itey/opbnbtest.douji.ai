<template>
  <el-dialog custom-class="stake-dialog" :visible.sync="show" width="946px">
    <div class="stake-header text-color" slot="title">
      {{ $t('news-detail.stk_title') }}
    </div>
    <div class="stake-content">
      <div class="stake-desc">
        {{ $t('news-detail.stk_desc') }}
      </div>
      <div class="stake-label text-color">
        {{ $t('news-detail.stk_quantity') }}
      </div>
      <div class="stake-input">
        <el-input
          v-model="stakeCount"
          class="input"
          placeholder
          style="width: 640px"
        ></el-input>
      </div>
      <div class="error-tip" v-if="error">{{ error }}</div>
      <div class="stake-tip" v-else>
        {{ $t('news-detail.stk_tip') }}
        <span class="text-color">{{ userOwned }}</span>
      </div>
    </div>
    <div class="btn-container">
      <el-button @click="handleStake()" class="common-btn2">{{
        $t('news-detail.stk_btn')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { eventBus } from '@/utils/event-bus'
import { notifyPledge } from '@/utils/http'
import { stakeNft } from '@/utils/web3/nft'
export default {
  name: 'stake-dialog',
  props: {
    tokenId: {
      type: String,
      default: undefined,
    },
    userOwned: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      show: false,
      stakeCount: undefined,
      error: undefined,
      ifPass: true,
    }
  },
  methods: {
    showDialog() {
      this.show = true
    },
    async handleStake() {
      if (!this.checkInput()) {
        return
      }
      var loadingInstance = this.$loading({
        background: 'rgba(0, 0, 0, 0.8)',
      })
      try {
        const txJson = await stakeNft(this.tokenId, this.stakeCount)
        console.log(txJson)
        this.$toast.success(this.$t('news-detail.stake_success'))
        eventBus.$emit('refresh_stake_info')
        notifyPledge(this.tokenId)
        this.show = false
      } catch (error) {
        console.log(error)
        this.$toast.error(this.$t('news-detail.stake_failed'))
      } finally {
        loadingInstance.close()
      }
    },
    checkInput() {
      var ifPass = true
      var reg = /^\+?[1-9][0-9]*$/
      if (!this.stakeCount) {
        this.error = this.$t('news-detail.stake_count_required')
        ifPass = false
        return
      }
      if (
        !reg.test(this.stakeCount) ||
        Number(this.stakeCount) <= 0 ||
        Number(this.stakeCount) > this.userOwned
      ) {
        this.error = this.$t('news-detail.stake_count_invalid')
        ifPass = false
      }
      if (ifPass) {
        this.error = undefined
      }
      return ifPass
    },
  },
}
</script>

<style lang="scss">
.stake-dialog {
  background: #1a2027;
  border: 1px solid #2c3638;
  border-radius: 16px 8px 8px 8px;

  .stake-header {
    text-align: left;
    font-size: 24px;
    font-family: Arial;
    font-weight: bold;
  }

  .stake-content {
    background: #212831;
    border-radius: 15px;
    padding: 38px 36px;
    margin: 36px 47px;
    text-align: left;

    .stake-desc {
      font-size: 16px;
      font-family: Arial;
      font-weight: bold;
      color: #9faec0;
      line-height: 24px;
    }

    .stake-label {
      margin-top: 45px;
      font-size: 18px;
      font-family: Arial;
      font-weight: bold;
    }

    .stake-input {
      margin-top: 17px;
    }

    .stake-tip {
      margin-top: 12px;
      font-size: 12px;
      font-family: Arial;
      font-weight: 400;
      color: #747c7c;
    }

    .error-tip {
      margin-top: 12px;
      font-size: 12px;
      font-family: Arial;
      font-weight: 400;
      color: #a50507;
    }
  }

  .btn-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 84px;
    margin-bottom: 54px;

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

.el-dialog__header {
  padding: 39px 48px 29px 48px;
}

.el-dialog__headerbtn {
  top: 47px;
  right: 45px;
  font-size: 26px;
}

.el-dialog__body {
  padding: 0 0;
}

.el-input__inner {
  height: 48px;
  line-height: 48px;
}
</style>
