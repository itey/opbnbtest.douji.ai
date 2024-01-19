<template>
  <div class="product-item theme-background-color" v-if="item && item.image">
    <img
      :src="item.image"
      @click="
        $router.push({
          path: '/news-detail',
          query: { tokenId: item.token_id },
        })
      "
    />
    <span class="type" v-if="item.pltform">{{ item.pltform }}</span>
    <span class="hold" v-if="item.holdCount > 1">x{{ item.holdCount }}</span>
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
  name: "UserItem",
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
  width: 270px;
  // box-shadow: 0px 8px 18px 0px rgba(9, 11, 12, 0.25);
  border-radius: 8px;

  img {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    width: 270px;
    height: 153px;
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

  .hold {
    position: absolute;
    padding: 0px 5px 0px 5px;
    top: 12px;
    right: 15px;
    background: rgba(20, 25, 30, 0.75);
    border-radius: 5px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #f7f8f9;
    line-height: 30px;
  }

  .label {
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    text-align: left;
    margin: 10px 14px 0 14px;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
  }

  .product-bottom {
    padding: 10px 14px 10px 14px;
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
