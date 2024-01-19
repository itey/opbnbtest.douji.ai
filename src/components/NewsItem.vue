<template>
  <div class="news-item" v-if="item">
    <img
      style="width: 100%; height: 194px; cursor: pointer"
      @click="
        $router.push({
          path: '/news-detail',
          query: { tokenId: item.token_id },
        })
      "
      :src="item.image"
    />
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
    <div class="bottom">
      <div class="sub text-sub-color">
        by
        <span
          @click="
            $router.push({
              path: '/creator',
              query: { address: item.owner_address },
            })
          "
          v-if="item.nickname"
          >{{ item.nickname }}</span
        >
        <span
          @click="
            $router.push({
              path: '/creator',
              query: { address: item.owner_address },
            })
          "
          v-else
          >{{ item.owner_address | omitAddress }}</span
        >
      </div>
      <div class="sub text-sub-color">
        {{ item.create_time | localTimeFormat }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewsItem",
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped>
.news-item {
  img {
    border-radius: 8px;
  }
  .label {
    cursor: pointer;
    height: 60px;
    font-size: 14px;
    line-height: 20px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    text-align: left;
    margin-top: 20px;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
  }
  .label:hover {
    color: #00f9e5;
  }

  .bottom {
    padding: 15px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .sub {
      font-size: 12px;
      line-height: 12px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      span {
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
}
</style>
