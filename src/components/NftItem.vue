<template>
  <div class="nft-item" v-if="item && item.image">
    <img :src="item.image" :style="{
			width: '100%',
			height: height,
		}" @click="$router.push({path: '/news-detail', query: {tokenId: item.token_id}})" />
    <div class="label text-color" @click="$router.push({path: '/news-detail', query: {tokenId: item.token_id}})">{{ item.title }}</div>
    <div class="nft-bottom">
      <div class="bottom-left">
        <span class="value text-color">2500</span>
        <span class="transform text-sub-color">≈$0.57</span>
      </div>
      <div class="bottom-right">
        <img style="width: 16px;height: 14px;" src="@/assets/images/star.png" />
        <span class="star text-sub-color">{{ item.praise_count }}</span>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'NftItem',
  props: {
    item: {
      type: Object,
    },
    height: {
      type: String,
      default: '105px',
    },
  },
}
</script>

<style lang="scss" scoped>
.nft-item {
  cursor: pointer;

  img {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  &:hover .label {
    color: #00f9e5;
  }
  .label {
    font-size: 14px;
    line-height: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    text-align: left;
    margin: 20px 14px 0 14px;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
  }

  .nft-bottom {
    padding: 15px 14px 15px 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .bottom-left {
      .value {
        font-size: 14px;
        line-height: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
      }

      .transform {
        font-size: 14px;
        line-height: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
      }
    }

    .bottom-right {
      display: flex;
      align-items: center;

      img {
        margin-right: 4px;
      }

      .star {
        font-size: 10px;
        line-height: 10px;
        font-family: Source Han Sans CN;
        font-weight: 400;
      }
    }
  }
}
</style>
