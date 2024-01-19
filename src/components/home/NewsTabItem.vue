<template>
  <div class="news-tab-item text-color" @mouseover="onHover">
    <div
      class="title text-color"
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
  name: "NewsTabItem",
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    onHover() {
      this.$emit("onHover", this.item);
    },
  },
};
</script>

<style lang="scss" scoped>
.news-tab-item {
  cursor: pointer;
  text-align: left;
  margin: 20px 0 14px 0;
  &:hover .title {
    color: #00f9e5;
  }
  .title {
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 800;
    line-height: 22px;
  }

  .bottom {
    margin-top: 22px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .sub {
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: 400;
    }
  }
}
</style>
