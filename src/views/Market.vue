<template>
  <div class="market-container">
    <el-breadcrumb
      style="margin-top: 38px"
      separator-class="el-icon-arrow-right"
    >
      <el-breadcrumb-item :to="{ path: '/' }">{{
        $t("marketplace.home")
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{
        $t("marketplace.marketplace")
      }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title-container">
      <span class="text-color title">{{ $t("marketplace.all_nft") }}</span>
      <span class="text-sub-color sub"
        >{{ totalCount | toLocalString }} {{ $t("marketplace.result") }}</span
      >
    </div>
    <div class="search-container">
      <el-select
        v-model="typeValue"
        @change="onTypeChange"
        clearable
        filterable
        :popper-append-to-body="false"
        popper-class="market-el-select"
        :placeholder="$t('marketplace.all_types')"
      >
        <el-option
          class="select-time"
          v-for="item in typeOptions"
          :key="item.value"
          :label="$i18n.locale == 'en' ? item.e_name : item.c_name"
          :value="item.e_name"
        ></el-option>
      </el-select>
      <el-select
        v-model="categoryValue"
        @change="onCategoryChange"
        clearable
        filterable
        :popper-append-to-body="false"
        popper-class="market-el-select"
        :placeholder="$t('marketplace.all_category')"
      >
        <el-option
          class="select-time"
          v-for="item in categoryOptions"
          :key="item.value"
          :label="$i18n.locale == 'en' ? item.e_name : item.c_name"
          :value="item.e_name"
        ></el-option>
      </el-select>
      <el-select
        v-model="platformValue"
        @change="onPlatformChange"
        clearable
        filterable
        :popper-append-to-body="false"
        popper-class="market-el-select"
        :placeholder="$t('marketplace.all_platform')"
      >
        <el-option
          class="select-time"
          v-for="item in platformOptions"
          :key="item.value"
          :label="$i18n.locale == 'en' ? item.e_name : item.c_name"
          :value="item.e_name"
        ></el-option>
      </el-select>
      <el-select
        v-model="viewedValue"
        @change="onViewedChange"
        clearable
        filterable
        :popper-append-to-body="false"
        popper-class="market-el-select"
        :placeholder="$t('marketplace.most_viewed')"
      >
        <el-option
          class="select-time"
          v-for="item in viewedOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        v-model="searchValue"
        @keyup.native.enter="onSearch"
        @blur="closeSearch"
        style="width: 344px"
        :placeholder="$t('marketplace.search_tip')"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <div
      class="content"
      v-loading="loading"
      :element-loading-background="$store.state.common.theme | maskByTheme"
    >
      <div class="list">
        <div v-for="(item, index) in list" :key="index" class="item">
          <product-item :item="item"></product-item>
        </div>
      </div>
      <el-pagination
        @current-change="onPageChange"
        style="width: 100%; margin: 20px 0"
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="totalCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import ProductItem from "@/components/ProductItem";
import {
  getNftCategoriesByType,
  getNftPlatformsByType,
  getNftTypes,
  nftListPage,
} from "@/utils/http";
export default {
  name: "market-view",
  components: {
    ProductItem,
  },
  watch: {
    "$store.state.common.language": function (val, od) {
      if (val != od) {
        this.initOptions();
      }
    },
  },
  data() {
    return {
      loading: false,
      typeOptions: [],
      typeValue: "",
      categoryOptions: [],
      categoryValue: "",
      platformOptions: [],
      platformValue: "",
      viewedOptions: [],
      viewedValue: "time_late",
      list: [],
      pageNo: 1,
      pageSize: 20,
      totalCount: 0,
      orderBy: 1,
      orderByDesc: "desc",
      searchValue: undefined,
    };
  },
  created() {
    this.$route.query.type && (this.typeValue = this.$route.query.type);
    this.$route.query.category &&
      (this.categoryValue = this.$route.query.category);
    this.$route.query.platform &&
      (this.platformValue = this.$route.query.platform);
    this.loadTypeList();
    this.loadPageList();
    this.initOptions();
  },
  methods: {
    initOptions() {
      this.viewedOptions = [
        {
          value: "time_late",
          label: this.$t("marketplace.sort_late_time"),
        },
        {
          value: "time_early",
          label: this.$t("marketplace.sort_early_time"),
        },
        {
          value: "price_high",
          label: this.$t("marketplace.sort_high_price"),
        },
        {
          value: "price_low",
          label: this.$t("marketplace.sort_low_price"),
        },
      ];
    },
    /** 页码变化 */
    onPageChange(page) {
      this.pageNo = page;
      this.loadPageList();
    },
    /** 列表加载 */
    loadPageList() {
      const param = {
        page: this.pageNo,
        content_type: this.typeValue,
        category: this.categoryValue,
        pltform: this.platformValue,
        orderField: this.orderBy,
        orderBy: this.orderByDesc,
      };
      this.searchValue && (param.keyW = this.searchValue);
      this.loading = true;
      nftListPage(param)
        .then((r) => {
          if (r.code == 1) {
            this.list = r.data.list;
            this.totalCount = r.data.pageCount;
            this.pageNo = r.data.page;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /** 分类变化 */
    onTypeChange(value) {
      this.categoryOptions = [];
      this.platformOptions = [];
      this.loadCategoryList(value);
      this.loadPlatformList(value);
      this.categoryValue = "";
      this.pageNo = 1;
      this.loadPageList();
    },
    /** 获取分类 */
    loadTypeList() {
      getNftTypes()
        .then((r) => {
          if (r.code == 1) {
            this.typeOptions = r.data.list;
          } else {
            this.$toast.error(r.message);
          }
        })
        .catch((e) => {
          console.log(e);
          this.$toast.error(this.$t("common.network_error"));
        });
    },
    /** 加载类别 */
    loadCategoryList(type) {
      if (type) {
        getNftCategoriesByType(type)
          .then((r) => {
            if (r.code == 1) {
              this.categoryOptions = r.data.list;
            } else {
              this.$toast.error(r.message);
            }
          })
          .catch((e) => {
            console.log(e);
            this.$toast.error(this.$t("common.network_error"));
          });
      }
    },
    /** 获取平台 */
    loadPlatformList(type) {
      getNftPlatformsByType(type)
        .then((r) => {
          if (r.code == 1) {
            this.platformOptions = r.data.list;
          } else {
            this.$toast.error(r.message);
          }
        })
        .catch((e) => {
          console.log(e);
          this.$toast.error(this.$t("common.network_error"));
        });
    },
    /** 类型发生变化 */
    onCategoryChange(value) {
      this.platformOptions = [];
      this.loadPlatformList(value);
      this.pageNo = 1;
      this.loadPageList();
    },
    /** 平台发生变化 */
    onPlatformChange() {
      this.pageNo = 1;
      this.loadPageList();
    },
    /** 排序发生变化 */
    onViewedChange(sort) {
      switch (sort) {
        case "time_late":
          this.orderBy = 1;
          this.orderByDesc = "desc";
          break;
        case "time_early":
          this.orderBy = 1;
          this.orderByDesc = "asc";
          break;
        case "price_high":
          this.orderBy = 2;
          this.orderByDesc = "desc";
          break;
        case "price_low":
          this.orderBy = 2;
          this.orderByDesc = "asc";
          break;
        default:
          break;
      }
      this.pageNo = 1;
      // this.typeValue = undefined
      // this.categoryValue = undefined
      // this.platformValue = undefined
      this.loadPageList();
    },
    /** 搜索 */
    onSearch() {
      this.pageNo = 1;
      this.typeValue = undefined;
      this.categoryValue = undefined;
      this.platformValue = undefined;
      this.loadPageList();
    },
    closeSearch(val) {
      if (!val.target.value) {
        this.pageNo = 1;
        this.loadPageList();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.market-container {
  .title-container {
    text-align: left;
    margin: 35px 0;
    display: flex;
    align-items: baseline;

    .title {
      font-size: 36px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      line-height: 36px;
      text-align: left;
    }

    .sub {
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #99b5c4;
      line-height: 12px;
      margin-left: 10px;
    }
  }

  .search-container {
    height: 72px;
    border-radius: 8px;
    padding: 0px 20px;
    margin: 21px 0 19px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-select {
      width: 250px;
    }
  }

  .content {
    flex: 1;

    .list {
      width: 1440px;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;

      .item {
        width: 342px;
        margin: 0 24px 24px 0;

        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}

.select-time {
  font-size: 14px;
}
.select-time:hover {
  color: #17e7d6;
}
</style>
