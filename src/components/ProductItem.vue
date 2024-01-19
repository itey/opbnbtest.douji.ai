<template>
  <div class="product-item theme-background-color" v-if="item && item.image">
    <img
      style="width: 100%; height: 194px"
      :src="item.image"
      @click="
        $router.push({
          path: '/news-detail',
          query: { tokenId: item.token_id },
        })
      "
    />
    <span class="type" v-if="item.pltform">{{ item.pltform }}</span>
    <div
      class="label text-color"
      @click="
        $router.push({
          path: '/news-detail',
          query: { tokenId: item.token_id },
        })
      "
    >
      {{ item.title }}
    </div>
    <div class="product-bottom">
      <div class="bottom-left">
        <span class="value text-color"
          >{{ item.price | toLocalString | removeEndZero }} MBD</span
        >
        <span class="transform text-sub-color">
          ≈ ${{
            ($store.state.chain.mbdPrice * item.price) | decimalPlace8
          }}</span
        >
      </div>
      <div class="bottom-right">
        <img style="width: 16px; height: 16px" src="@/assets/images/star.png" />
        <span class="star text-sub-color">{{ item.praise_count }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductItem",
  props: {
    item: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
.product-item {
  position: relative;
  cursor: pointer;
  border-radius: 8px;

  img {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:hover .label {
    color: #00f9e5;
  }

  .type {
    position: absolute;
    top: 12px;
    left: 15px;
    background: rgba(13, 18, 18, 0.66);
    border-radius: 4px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
    height: 30px;
    line-height: 30px;
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

  .product-bottom {
    padding: 15px 14px 17px 14px;
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
        margin-right: 5px;
      }

      .star {
        font-size: 14px;
        line-height: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
      }
    }
  }
}
</style>
