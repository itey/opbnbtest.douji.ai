<template>
  <div class="news-container">
    <el-breadcrumb
      style="margin-top: 27px"
      separator-class="el-icon-arrow-right"
    >
      <el-breadcrumb-item :to="{ path: '/' }">{{
        $t("news.home")
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t("news.news") }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="text-color title">{{ $t("news.news") }}</div>
    <div class="content">
      <div class="list">
        <div v-for="(item, index) in list" :key="index" class="item">
          <NewsItem :item="item" />
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
import { nftListPage } from "@/utils/http";
import NewsItem from "@/components/NewsItem";
export default {
  name: "news-view",
  components: {
    NewsItem,
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 20,
      totalCount: 0,
      list: [],
    };
  },
  created() {
    this.loadPageList();
  },
  methods: {
    /** 列表加载 */
    loadPageList() {
      const param = {
        page: this.pageNo,
        content_type: "Article",
      };
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
    /** 页码变化 */
    onPageChange(page) {
      this.pageNo = page;
      this.loadPageList();
    },
  },
};
</script>
<style lang="scss" scoped>
.news-container {
  .title {
    font-size: 26px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    line-height: 26px;
    text-align: left;
    margin: 27px 0 40px 0;
  }

  .content {
    flex: 1;

    .list {
      display: flex;
      flex-wrap: wrap;
      //justify-content: space-between;

      .item {
        width: calc((100% - 72px) / 4);
        min-width: 185px;
        margin: 0 24px 31px 0;

        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
