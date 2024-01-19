<template>
  <el-dialog
    custom-class="history-dialog"
    :visible.sync="show"
    @open="onOpen()"
    width="946px"
  >
    <div class="history-header text-color" slot="title">
      {{ $t("news-detail.revision_hist") }}
    </div>
    <div class="history-content">
      <el-table ref="multipleTable" :data="tableData" style="width: 850px">
        <el-table-column label="Timestamp" width="390px">
          <template slot-scope="scope">{{ scope.row.create_time }}</template>
        </el-table-column>
        <el-table-column prop="name" label="IPFS hash address" width="460px">
          <template slot-scope="scope">
            <a style="color: azure" :href="scope.row.uri" target="_bank">{{
              scope.row.uri | ipfsUri
            }}</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="onPageChange"
        style="width: 100%; margin: 20px 0"
        background
        layout="prev,pager,next"
        :page-size="20"
        :total="totalCount"
      ></el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import { nftUpdateLog } from "@/utils/http";
export default {
  name: "revision-history-dialog",
  props: {
    tokenId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      show: false,
      tableData: [{}, {}],
      page: 1,
      totalCount: null,
    };
  },
  methods: {
    onPageChange(page) {
      this.page = page;
      this.onOpen();
    },
    showDialog() {
      this.show = true;
    },
    onOpen() {
      nftUpdateLog(this.tokenId, this.page).then((r) => {
        console.log(r);
        if (r.code == 1) {
          this.tableData = r.data.list;
          this.totalCount = r.data.pageCount;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.history-dialog {
  background: #1a2027;
  border: 1px solid #2c3638;
  border-radius: 12px 6px 6px 6px;

  .history-header {
    text-align: left;
    font-size: 17px;
    font-family: Arial;
    font-weight: bold;
  }

  .history-content {
    border: 1px solid #1f272f;
    padding: 30px 52px 0 52px;
    text-align: left;

    .label {
      font-size: 13px;
      font-family: Arial;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 14px;
    }
  }

  .history-form {
    background: #212831;
    border-radius: 11px;
    margin: 22px 0 60px 0;
    padding: 27px 0 32px 0;
  }

  .history-title {
    font-size: 14px;
    font-family: Arial;
    font-weight: bold;
    color: #17e7d6;
    margin: 0 25px;
  }

  .history-label {
    font-size: 13px;
    font-family: Arial;
    font-weight: bold;
    margin: 35px 25px 0 25px;
  }

  .history-value {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 14px 25px 0 25px;

    .type-item {
      min-width: 115px;
      height: 35px;
      line-height: 35px;
      background: #0e161d;
      border: 1px solid #313838;
      border-radius: 6px;
      font-size: 10px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
      margin-right: 6px;
      text-align: center;
      cursor: pointer;

      &.light {
        background: #18252f;
        border: 1px solid #2fc9bd;
        border-radius: 6px;
        font-size: 10px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #00fbe6;
      }
    }

    .history-unit {
      margin-left: 4px;
      font-size: 10px;
      font-family: Arial;
      font-weight: bold;
      color: #00f9e5;
    }

    .verify {
      width: 72px;
      height: 35px;
      line-height: 35px;
      background: #31cad7;
      border: 1px solid #313838;
      border-radius: 6px;
      font-size: 10px;
      font-family: Arial;
      font-weight: bold;
      color: #212831;
      text-align: center;
      margin-left: 4px;
    }
  }

  .history-add {
    width: 449px;
    height: 35px;
    line-height: 35px;
    background: #0e161d;
    border: 1px solid #313838;
    border-radius: 6px;
    font-size: 10px;
    font-family: Arial;
    font-weight: 400;
    color: #87a2b7;
    text-align: center;
    margin: 16px 0 0 25px;
  }

  .history-tip {
    font-size: 9px;
    font-family: Arial;
    font-weight: 400;
    color: #747c7c;
    margin: 9px 25px 0 25px;
  }

  .history-btn {
    margin: 43px 52px 68px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    .common-btn2 {
      height: 50px;
      width: 135px;
    }
  }

  .el-dialog {
    background: #1a2027;
    border: 1px solid #2c3638;
    border-radius: 12px 6px 6px 6px;
  }

  .el-dialog__body {
    padding: 0 0;
  }

  .el-switch.is-checked .el-switch__core {
    border-color: #00f9e5;
    background-color: #00f9e5;
  }

  .el-input__inner {
    height: 35px;
    line-height: 35px;
  }

  .el-table {
    font-size: 9px;
  }

  .el-table,
  .el-table tr,
  .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background-color: transparent;
  }

  .el-table th.el-table__cell {
    background-color: #252d36;
  }

  .el-table td.el-table__cell,
  .el-table th.el-table__cell.is-leaf {
    border-bottom: 1px solid #1f262e;
  }

  .el-table-column--selection .cell {
    padding-left: 11px;
    padding-right: 11px;
  }

  .el-checkbox__inner {
    background-color: transparent;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #acbcc9;
    border-color: transparent;
  }

  .el-table th.el-table__cell,
  .el-table td.el-table__cell {
    &:first-child {
      text-align: center;
    }

    &:last-child {
      padding-right: 14px;
      text-align: right;
    }

    &:nth-child(4),
    &:nth-child(5) {
      text-align: center;
    }
  }

  .el-table--fit {
    border-bottom: 1px solid #1f262e;
  }

  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden;
  }

  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: transparent;
  }

  .el-table th.el-table__cell:first-child,
  .el-table td.el-table__cell:first-child {
    text-align: left;
  }

  .el-table th.el-table__cell:last-child,
  .el-table td.el-table__cell:last-child {
    text-align: left;
  }
}
</style>
