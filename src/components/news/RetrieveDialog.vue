<template>
  <el-dialog custom-class="retrieve-dialog" :visible.sync="show" width="946px">
    <div class="retrieve-header text-color" slot="title">
      {{ $t('news-detail.ret_title') }}
    </div>
    <div class="retrieve-content">
      <div class="retrieve-desc">
        {{ $t('news-detail.ret_desc') }}
      </div>
      <div class="retrieve-label text-color">
        {{ $t('news-detail.ret_quantity') }}
      </div>
      <div class="retrieve-input">
        <el-input
          v-model="unStakeCount"
          @change="checkInput()"
          class="input"
          placeholder
          style="width: 640px"
        ></el-input>
      </div>
      <div class="error-tip" v-if="error">{{ error }}</div>
      <div class="retrieve-tip" v-else-if="userStakeInfo && userStakeInfo[0]">
        {{ $t('news-detail.ret_tip') }}
        <span class="text-color">{{ userStakeInfo[0] }}</span>
      </div>
    </div>
    <div class="btn-container">
      <el-button
        :disabled="!retrieveUseable"
        @click="handleRetrieve()"
        class="common-btn2"
        >{{ $t('news-detail.ret_btn') }}</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { eventBus } from '@/utils/event-bus'
import { notifyPledge } from '@/utils/http'
import { unStakeNft } from '@/utils/web3/nft'
export default {
  name: 'retrieve-dialog',
  props: {
    blockHeight: {
      type: Number,
      default: undefined,
    },
    userStakeInfo: {
      type: Array,
      default: undefined,
    },
    tokenId: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    retrieveUseable() {
      if (!this.blockHeight) {
        return false
      }
      if (!this.userStakeInfo || this.userStakeInfo[0] <= 0) {
        return false
      }
      if (this.userStakeInfo[1] > this.blockHeight) {
        return false
      }
      return true
    },
  },
  data() {
    return {
      show: false,
      unStakeCount: undefined,
      error: undefined,
    }
  },
  methods: {
    showDialog() {
      this.show = true
    },
    /** 点击赎回 */
    async handleRetrieve() {
      if (!this.checkInput()) {
        return
      }
      var loadingInstance = this.$loading({
        background: 'rgba(0, 0, 0, 0.8)',
      })
      try {
        const txJson = await unStakeNft(this.tokenId, this.unStakeCount)
        console.log(txJson)
        this.$toast.success(this.$t('news-detail.retrieve_success'))
        eventBus.$emit('refresh_stake_info', this.tokenId)
        notifyPledge(this.tokenId)
        this.show = false
      } catch (error) {
        console.log(error)
        this.$toast.error(this.$t('news-detail.retrieve_failed'))
      } finally {
        loadingInstance.close()
      }
    },
    /** 检查输入项 */
    checkInput() {
      var ifPass = true
      var reg = /^\+?[1-9][0-9]*$/
      if (!this.unStakeCount) {
        this.error = this.$t('news-detail.retrieve_count_required')
        ifPass = false
        return
      }
      if (
        !reg.test(this.unStakeCount) ||
        Number(this.unStakeCount) <= 0 ||
        Number(this.unStakeCount) > this.userStakeInfo[0]
      ) {
        this.error = this.$t('news-detail.retrieve_count_invalid')
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
.retrieve-dialog {
  background: #1a2027;
  border: 1px solid #2c3638;
  border-radius: 16px 8px 8px 8px;

  .retrieve-header {
    text-align: left;
    font-size: 24px;
    font-family: Arial;
    font-weight: bold;
  }

  .retrieve-content {
    background: #212831;
    border-radius: 15px;
    padding: 38px 36px;
    margin: 36px 47px;
    text-align: left;

    .retrieve-desc {
      font-size: 16px;
      font-family: Arial;
      font-weight: bold;
      color: #9faec0;
      line-height: 24px;
    }

    .retrieve-label {
      margin-top: 45px;
      font-size: 18px;
      font-family: Arial;
      font-weight: bold;
    }

    .retrieve-input {
      margin-top: 17px;
    }

    .retrieve-tip {
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
