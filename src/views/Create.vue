<template>
  <div class="create-container">
    <div class="step-container" v-if="step > 0">
      <div
        class="step"
        :class="{
          step: step < 1,
          'step-light': step >= 1,
        }"
      >
        <div class="step-title">{{ $t('create.step_1') }}</div>
        <div class="step-sub">{{ $t('create.set_information') }}</div>
      </div>
      <div style="margin: 0 31px 0 36px">
        <img
          style="width: 39px; height: 6px"
          :src="
            require(`@/assets/images/create/arrow${
              step >= 1 ? '-light' : ''
            }.png`)
          "
        />
      </div>
      <div
        class="step"
        :class="{
          step: step < 2,
          'step-light': step >= 2,
        }"
      >
        <div class="step-title">{{ $t('create.step_2') }}</div>
        <div class="step-sub">{{ $t('create.write_content') }}</div>
      </div>
      <div style="margin: 0 31px 0 36px">
        <img
          style="width: 39px; height: 6px"
          :src="
            require(`@/assets/images/create/arrow${
              step >= 2 ? '-light' : ''
            }.png`)
          "
        />
      </div>
      <div
        class="step"
        :class="{
          step: step < 3,
          'step-light': step >= 3,
        }"
      >
        <div class="step-title">{{ $t('create.step_3') }}</div>
        <div class="step-sub">{{ $t('create.mint_nft') }}</div>
      </div>
    </div>
    <create-step0 v-if="step == 0" @itemClick="itemClick"></create-step0>
    <create-step1
      v-if="step == 1"
      :metadata="metadata"
      @saveClick="saveData"
      @backClick="backClick"
      @nextClick="nextClick"
    ></create-step1>
    <create-step2
      v-if="step == 2"
      :metadata="metadata"
      @saveClick="saveData"
      @backClick="backClick"
      @nextClick="nextClick"
    ></create-step2>
    <create-step3
      v-if="step == 3"
      :metadata="metadata"
      @saveClick="saveData"
      @backClick="backClick"
      @reload="pageReload"
    ></create-step3>
  </div>
</template>

<script>
import CreateStep0 from '@/components/create/CreateStep0'
import CreateStep1 from '@/components/create/CreateStep1'
import CreateStep2 from '@/components/create/CreateStep2'
import CreateStep3 from '@/components/create/CreateStep3'
import cache from '@/utils/cache'
export default {
  name: 'create-view',
  components: {
    CreateStep0,
    CreateStep1,
    CreateStep2,
    CreateStep3,
  },
  inject: ['reload'],
  data() {
    return {
      contractJson: {
        initialPrice: undefined,
      },
      metadata: {
        contentType: undefined,
        category: undefined,
        prompt: undefined,
        language: undefined,
        keyword: [],
        maxSupply: undefined,
        initialQuantity: undefined,
        initialPrice: undefined,
      },
      step: 0,
    }
  },
  created() {
    this.loadCache()
  },
  methods: {
    loadCache() {
      const cacheData = cache.local.getJSON('NFT_MINT_CACHE')
      if (cacheData) {
        this.metadata = cacheData
        this.step = cacheData.step ? cacheData.step : 1
      }
    },
    saveData(form) {
      this.metadata = form
      cache.local.setJSON('NFT_MINT_CACHE', this.metadata)
    },
    itemClick(contentType) {
      this.metadata.contentType = contentType
      this.step = 1
    },
    backClick(val) {
      this.step = val
    },
    nextClick(val) {
      this.step = val
    },
    /** 刷新页面 */
    pageReload() {
      this.reload()
    },
  },
}
</script>
<style lang="scss" scoped>
.create-container {
  display: flex;
  flex-direction: column;

  .step-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 86px;

    .step {
      text-align: left;

      .step-title {
        font-size: 26px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #747c7c;
      }

      .step-sub {
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #747c7c;
        margin-top: 15px;
      }
    }

    .step-light {
      .step-title {
        font-size: 26px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #4cc9ce;
        background: linear-gradient(-16deg, #4195f6 0%, #00f9e5 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .step-sub {
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #50ced5;
        margin-top: 15px;
      }
    }
  }
}
</style>
