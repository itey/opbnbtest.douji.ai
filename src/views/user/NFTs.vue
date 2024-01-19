<template>
  <div class="container">
    <div class="top">
      <div>
        <span class="text-big text-color">{{ $t("user.my_nft") }}</span>
        <span class="sub-value"
          >{{ totalOwner + totalOther }} {{ $t("user.items") }}</span
        >
      </div>
    </div>
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
    <div class="content">
      <div class="list" v-if="isOwner == 1">
        <div v-for="(item, index) in listOwner" :key="index" class="item">
          <UserItem :item="item" />
        </div>
      </div>
      <div class="list" v-if="isOwner == 0">
        <div v-for="(item, index) in listOther" :key="index" class="item">
          <UserItem :item="item" />
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
</template>

<script>
import UserItem from "@/components/UserItem";
import { getMyNftList } from "@/utils/http";
export default {
  name: "nft-view",
  components: {
    UserItem,
  },
  data() {
    return {
      isOwner: 1,
      listOwner: [],
      listOther: [],
      searchValue: undefined,
      totalOwner: 0,
      totalOther: 0,
      pageNo: 1,
    };
  },
  created() {
    this.initTabList();
  },
  methods: {
    changeTab(val) {
      if (val != this.isOwner) {
        this.isOwner = val;
        this.pageNo = 1;
        this.searchValue = undefined;
        this.nftListLoad();
      }
    },
    onPageChange(page) {
      this.pageNo = page;
      this.nftListLoad();
    },
    /** 回车搜索 */
    onSearch() {
      this.nftListLoad();
    },
    closeSearch(val) {
      if (!val.target.value) {
        this.nftListLoad();
      }
    },
    initTabList() {
      getMyNftList({ page: 1, isOwner: 1 })
        .then((r) => {
          if (r.code == 1) {
            this.listOwner = r.data.list;
            this.totalOwner = r.data.pageCount;
          }
        })
        .catch((e) => {
          this.$toast.error(e.message);
        });
      getMyNftList({ page: 1, isOwner: 0 })
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
    /** 加载数据 */
    nftListLoad() {
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      var param = {
        page: this.pageNo,
        isOwner: this.isOwner,
      };
      this.searchValue && (param.keyW = this.searchValue);
      getMyNftList(param)
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
          this.$toast.error(e.message);
        })
        .finally(() => {
          loadingInstance.close();
        });
    },
  },
};
</script>

<style lang="scss">
.container {
  padding: 0 25px;
  display: flex;
  flex-direction: column;

  .top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 50px 0;

    .text-big {
      font-size: 32px;
      line-height: 32px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      margin-bottom: auto;
    }

    .sub-value {
      line-height: 40px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #a9b7c3;
      margin-left: 10px;
    }
  }

  .middle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .mid-tab {
      display: flex;
      align-items: center;

      .tab {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
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
  }

  .content {
    flex: 1;
    margin: 20px 0px 50px 0px;

    .list {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      .item {
        width: calc((100% - 39px) / 4);
        margin: 0 13px 13px 0;

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
.search .el-input__inner {
  width: 284px;
}
</style>
