<template>
  <div
    class="reward-container"
    v-loading="loading"
    :element-loading-background="$store.state.common.theme | maskByTheme"
  >
    <div class="reward-top-title">{{ $t('news-detail.rew_title') }}</div>
    <div class="reward-value text-color" style="margin-top: 31px">
      {{ readReward.duration_sum | readSecondsFormat }}
    </div>
    <div class="reward-tip">{{ $t('news-detail.rew_time') }}</div>
    <div class="reward-value text-color" style="margin-top: 58px">
      {{ readReward.reads_count | zeroPadding2 }}/12
    </div>
    <div class="reward-tip">{{ $t('news-detail.rew_mission') }}</div>
    <div class="reward-mbd">
      <div class="reward-mbd-value">
        {{ readReward.income_sum | decimalPlace4 }} MBD
      </div>
      <div class="reward-mbd-transform">
        ≈${{
          (readReward.income_sum * $store.state.chain.mbdPrice) | decimalPlace4
        }}
      </div>
    </div>
    <div class="reward-tip">{{ $t('news-detail.rew_income') }}</div>
    <el-button @click="$router.push('/balance')" class="sett-btn">{{
      $t('news-detail.rew_settle')
    }}</el-button>
  </div>
</template>

<script>
import { getTodayReadData } from '@/utils/http'
export default {
  name: 'reading-reward',
  computed: {
    userId() {
      return this.$store.state.user.userId
    },
  },
  data() {
    return {
      loading: false,
      timer: undefined,
      readReward: {
        income_sum: 0,
        duration_sum: 0,
        reads_count: 0,
      },
    }
  },
  mounted() {
    this.getTodayReadData()
    this.timer = setInterval(() => {
      this.getTodayReadData()
    }, 10000)
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    async getTodayReadData() {
      if (!this.userId) {
        return
      }
      try {
        const res = await getTodayReadData()
        if (res.code == 1) {
          this.readReward = res.data
        } else {
          this.$toast.error(res.message)
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss">
.reward-container {
  border: 1px solid #17e7d6;
  border-radius: 8px;
  height: auto;
  text-align: center;
  background-image: url('@/assets/images/news/reward_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .reward-top-title {
    height: 66px;
    line-height: 66px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background: linear-gradient(-16deg, #4195f6, #17e7d6);
    font-size: 18px;
    font-family: Arial;
    font-weight: bold;
    color: #1a2027;
    padding-left: 23px;
    text-align: left;
  }

  .reward-value {
    font-size: 36px;
    font-family: Arial;
    font-weight: bold;
  }

  .reward-tip {
    font-size: 14px;
    font-family: Arial;
    font-weight: 400;
    color: #88a2b8;
    margin-top: 16px;
  }

  .reward-mbd {
    margin-top: 53px;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: center;

    .reward-mbd-value {
      font-size: 30px;
      font-family: Arial;
      font-weight: bold;
      color: #00f9e5;
    }

    .reward-mbd-transform {
      font-size: 14px;
      font-family: Arial;
      font-weight: 400;
      color: #88a2b8;
    }
  }

  .sett-btn {
    width: 338px;
    height: 50px;
    background: linear-gradient(-16deg, #4195f6, #17e7d6);
    border-radius: 25px;
    color: #1a2027;
    font-size: 18px;
    font-family: Arial;
    font-weight: bold;
    margin: 40px 0px;
  }
}
</style>
