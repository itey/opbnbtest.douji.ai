<template>
  <div class="creator-container">
    <div class="list-container">
      <div class="middle">
        <div class="mid-tab">
          <div
            :class="['tab', isOwner == 1 ? 'active' : '']"
            @click="changeTab(1)"
          >
            Created<span>({{ totalOwner }})</span>
          </div>
          <div
            :class="['tab', isOwner == 0 ? 'active' : '']"
            @click="changeTab(0)"
          >
            Other<span>({{ totalOther }})</span>
          </div>
        </div>
        <div class="search">
          <el-input
            v-model="searchValue"
            @keyup.native.enter="onSearch"
            @blur="closeSearch"
            :placeholder="$t('user.search_tip')"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>
      <div
        class="content"
        v-loading="loading"
        :element-loading-background="$store.state.common.theme | maskByTheme"
      >
        <div class="list" v-if="isOwner == 1">
          <div v-for="(item, index) in listOwner" :key="index" class="item">
            <ProductItem :item="item" />
          </div>
        </div>
        <div class="list" v-if="isOwner == 0">
          <div v-for="(item, index) in listOther" :key="index" class="item">
            <ProductItem :item="item" />
          </div>
        </div>
        <template v-if="isOwner == 1">
          <el-pagination
            v-if="totalOwner > 0"
            @current-change="onPageChange"
            style="width: 100%; margin: 20px 0"
            background
            layout="prev,pager,next"
            :page-size="20"
            :total="totalOwner"
          ></el-pagination>
          <div class="empty" v-else>No data</div>
        </template>
        <template v-if="isOwner == 0">
          <el-pagination
            v-if="listOther.length > 0"
            @current-change="onPageChange"
            style="width: 100%; margin: 20px 0"
            background
            layout="prev,pager,next"
            :page-size="20"
            :total="totalOther"
          ></el-pagination>
          <div class="empty" v-else>No data</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ProductItem from "@/components/ProductItem";
import { getUserNftList } from "@/utils/http";
export default {
  name: "creator-view",
  data() {
    return {
      address: undefined,
      isOwner: 1,
      listOwner: [],
      listOther: [],
      searchValue: undefined,
      totalOwner: 0,
      totalOther: 0,
      userInfo: {},
      page: 1,
      loading: false,
    };
  },
  components: {
    ProductItem,
  },
  created() {
    this.address = this.$route.query.address;
    this.initTabList();
  },
  methods: {
    changeTab(val) {
      if (val != this.isOwner) {
        this.isOwner = val;
        this.pageNo = 1;
        this.searchValue = undefined;
        this.userNftList();
      }
    },
    closeSearch(val) {
      if (!val.target.value) {
        this.userNftList();
      }
    },
    onPageChange(page) {
      this.page = page;
      this.userNftList();
    },
    initTabList() {
      getUserNftList({ page: this.page, address: this.address, isOwner: 1 })
        .then((r) => {
          if (r.code == 1) {
            this.listOwner = r.data.list;
            this.totalOwner = r.data.pageCount;
          }
        })
        .catch((e) => {
          this.$toast.error(e.message);
        });
      getUserNftList({ page: this.page, address: this.address, isOwner: 0 })
        .then((r) => {
          if (r.code == 1) {
            this.listOther = r.data.list;
            this.totalOther = r.data.pageCount;
          }
        })
        .catch((e) => {
          this.$toast.error(e.message);
        });
    },
    /** 回车搜索 */
    onSearch() {
      this.userNftList();
    },
    /** 查询用户的NFT列表  */
    userNftList() {
      if (!this.address) {
        return;
      }
      this.loading = true;
      var param = {
        page: this.page,
        address: this.address,
        isOwner: this.isOwner,
      };
      this.searchValue && (param.keyW = this.searchValue);
      getUserNftList(param)
        .then((r) => {
          if (r.code == 1) {
            if (this.isOwner == 1) {
              this.listOwner = r.data.list;
              this.totalOwner = r.data.pageCount;
            } else {
              this.listOther = r.data.list;
              this.totalOther = r.data.pageCount;
            }
          }
        })
        .catch((e) => {
          this.$toast.error(e.message ? e.message : e);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.creator-container {
  padding: 37px 0 32px 0;
  align-items: center;
  justify-content: center;

  .list-container {
    position: relative;

    .middle {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 40px;

      .mid-tab {
        display: flex;
        align-items: center;

        .tab {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #e8ecf0;
          font-family: Source Han Sans CN;
          font-weight: bold;
          margin-right: 5px;
          align-self: center;
          width: 140px;
          height: 40px;
          cursor: pointer;

          &:hover {
            color: #ffffff;
            background: #2b343f;
            border-radius: 20px;
          }

          &.active {
            background: #2b343f;
            border-radius: 20px;
            color: #00f9e5;
          }

          span {
            margin-left: 5px;
            font-size: 14px;
            color: #7a91ab;
          }
        }
      }

      .search {
        .el-input {
          width: 300px;
        }
      }
    }

    .title-container {
      text-align: left;
      margin: 23px 0 46px 0;
      display: flex;
      align-items: flex-end;

      .title {
        font-size: 36px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        line-height: 26px;
        text-align: left;
      }

      .sub {
        height: 18px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        margin-left: 9px;
        padding: 1px 8px 1px 8px;
        font-weight: bold;
        border-radius: 8px;
      }
    }

    .content {
      flex: 1;

      .list {
        display: flex;
        flex-wrap: wrap;

        .item {
          width: 342px;
          margin: 0 24px 24px 0;

          &:nth-child(4n) {
            margin-right: 0;
          }
        }
      }

      .empty {
        margin-top: 20px;
        color: #7a91ab;
      }
    }
  }
}
</style>
