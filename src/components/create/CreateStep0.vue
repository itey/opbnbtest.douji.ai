<template>
  <div class="create-step0">
    <div class="create-label">{{ $t("create.create") }}</div>
    <div class="create-title text-color">
      {{ $t("create.create_your_collection") }}
    </div>
    <div class="type-container" v-for="(arr, index) in typeList" :key="index">
      <div
        class="type-item"
        v-for="(item, i) in arr"
        :key="i"
        @click="itemClick(item.e_name)"
      >
        <!-- <img style="width: 72px;height: 67px;" src="@/assets/images/create/article.png" /> -->
        <div :class="showClass(i)">
          {{ $i18n.locale == "en" ? item.e_name : item.c_name }}
        </div>
      </div>
    </div>
    <div class="tip">{{ $t("create.the_soon") }}</div>
    <div class="question text-color">{{ $t("create.how_create") }}</div>
  </div>
</template>

<script>
import { getNftTypes } from "@/utils/http";
export default {
  name: "create-step0",
  data() {
    return {
      typeList: [],
    };
  },
  methods: {
    /** 获取分类 */
    loadTypeList() {
      getNftTypes().then((r) => {
        const arr = r.data.list;
        if (arr) {
          this.typeList = this._.chunk(arr, 3);
        }
      });
    },
    showClass(i) {
      const r = i % 3;
      switch (r) {
        case 0:
          return "article";
        case 1:
          return "prompt";
        case 2:
          return "art";
        default:
          return "article";
      }
    },
    itemClick(type) {
      this.$emit("itemClick", type);
    },
  },
  mounted() {
    this.loadTypeList();
  },
};
</script>

<style lang="scss" scoped>
.create-step0 {
  .create-label {
    font-size: 26px;
    font-family: Arial;
    font-weight: bold;
    color: #00f9e5;
    margin-top: 47px;
  }

  .create-title {
    margin-top: 19px;
    font-size: 26px;
    font-family: Source Han Sans CN;
    font-weight: bold;
  }

  .type-container {
    width: 1440px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 68px;

    .type-item {
      width: 454px;
      height: 140px;
      background-image: url("@/assets/images/home/item-back2.png");
      background-size: 100% 100%;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .article {
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #ffffff;
      background: linear-gradient(-73deg, #00abf1 0%, #01eeff 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .prompt {
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #ffffff;
      background: linear-gradient(-73deg, #3874fc 0%, #8a8dff 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .art {
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #ffffff;
      background: linear-gradient(-73deg, #00d487 0%, #00dafd 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .tip {
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #99b5c4;
    margin-top: 100px;
  }

  .question {
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    margin: 27px;
  }
}
</style>
