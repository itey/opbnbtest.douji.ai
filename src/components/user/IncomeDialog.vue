<template>
  <el-dialog
    custom-class="income-dialog"
    @open="onOpen()"
    :row-key="RowKey"
    :visible.sync="show"
    width="1100px"
  >
    <div class="income-header text-color" slot="title">
      {{ $t("user.inc_d_title") }}
    </div>
    <div class="income-content">
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 1000px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          width="47px"
        ></el-table-column>
        <el-table-column
          :label="$t('user.st_token_id')"
          prop="token_id"
          width="119px"
        ></el-table-column>
        <el-table-column
          prop="name"
          :label="$t('user.st_name')"
          width="211px"
        ></el-table-column>
        <el-table-column
          prop="settlePoolBalance"
          :label="$t('user.st_pool_balance')"
          width="249px"
        ></el-table-column>
        <el-table-column :label="$t('user.st_rate')" width="209px">
          <template slot-scope="scope">
            <span
              >{{ scope.row.userStake }} / {{ scope.row.totalStakeCount }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="userStake"
          :label="$t('user.st_income')"
          width="165px"
        >
          <template slot-scope="scope">
            <span>{{
              ((scope.row.settlePoolBalance * 0.2 * scope.row.userStake) /
                scope.row.totalStakeCount)
                | decimalPlace8
            }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="onPageChange"
        style="width: 100%; margin: 20px 0"
        background
        layout="prev,pager,next"
        :total="totalCount"
        :page-size="20"
      ></el-pagination>
    </div>
    <div class="income-btn">
      <el-button
        :disabled="!multipleSelection || !multipleSelection.length"
        class="common-btn2"
        @click="handleSubmit()"
        >{{ $t("user.settlement") }}</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { pledgeSettleList, notifyPledge } from "@/utils/http";
import { userPledgeCount } from "@/utils/web3/nft";
import { weiToMbd } from "@/utils/common";
import { totalPledgeCount, getSettlePoolBalance } from "@/utils/web3/open";
import { marketSettleBatch } from "@/utils/web3/market";
export default {
  name: "income-dialog",
  data() {
    return {
      show: false,
      pageNo: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: [],
      multipleSelection: [],
    };
  },
  methods: {
    RowKey(row) {
      return row.token_id;
    },
    showDialog() {
      this.show = true;
    },
    onOpen() {
      this.pageNo = 1;
      this.pageLoad();
    },
    /** 选择的数据发生变化 */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onPageChange(page) {
      this.pageNo = page;
      this.pageLoad();
    },
    /** 加载数据 */
    async pageLoad() {
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      try {
        const r = await pledgeSettleList(this.pageNo);
        if (r.code == 1) {
          var stakeList = r.data.list;
          if (stakeList && stakeList.length > 0) {
            await this.batchQueryStakeInfo(stakeList);
            this.tableData = r.data.list;
          }
          this.totalCount = r.data.pageCount;
        } else {
          this.$toast.error(r.message);
        }
      } catch (e) {
        this.$toast.error(e && e.message ? e.message : e);
      } finally {
        loadingInstance.close();
      }
    },
    /** 批量请求查询质押信息 */
    async batchQueryStakeInfo(stakeList) {
      var promise = [];
      for (var i = 0; i < stakeList.length; i++) {
        var stake = stakeList[i];
        promise.push(this.getUserStakeCount(stake));
        promise.push(this.getTotalStakeCount(stake));
        promise.push(this.getMbdSettleBalance(stake));
      }
      await Promise.all(promise);
    },
    /** 获取用户质押信息 */
    getUserStakeCount(stake) {
      if (!this.$store.state.user.account) {
        return;
      }
      return new Promise((resolve) => {
        userPledgeCount(stake.token_id)
          .then((data) => {
            stake.userStake = data[0];
            return resolve();
          })
          .catch((e) => {
            this.$toast.error(e && e.message ? e.message : e);
            return resolve();
          });
      });
    },
    /** 获取质押总量 */
    getTotalStakeCount(stake) {
      return new Promise((resolve) => {
        totalPledgeCount(stake.token_id)
          .then((count) => {
            stake.totalStakeCount = count ? count : 0;
            return resolve();
          })
          .catch((e) => {
            this.$toast.error(e && e.message ? e.message : e);
            return resolve();
          });
      });
    },
    /** 取合约里DAO 质押奖金池子的额度 */
    getMbdSettleBalance(stake) {
      return new Promise((resolve) => {
        getSettlePoolBalance(stake.token_id)
          .then((balance) => {
            stake.settlePoolBalance = weiToMbd(balance);
            return resolve();
          })
          .catch((e) => {
            this.$toast.error(e && e.message ? e.message : e);
            return resolve();
          });
      });
    },
    /** 点击结算按钮 */
    handleSubmit() {
      if (!this.multipleSelection || !this.multipleSelection.length) {
        return;
      }
      const tokenArr = this._.map(this.multipleSelection, "token_id");
      if (this.$store.state.chain.balanceBnb < 0.01) {
        this.$bnbConfirm(this.$store.state.common.language, () => {
          this.executeProcess(tokenArr);
        });
        return;
      }
      this.executeProcess(tokenArr);
    },
    /** 执行结算 */
    executeProcess(arr) {
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      marketSettleBatch(arr)
        .then(() => {
          this.$toast.success(this.$t("user.settle_success_1"));
          this.multipleSelection = [];
          this.onOpen();
          loadingInstance.close();
          arr.forEach((tokenId) => {
            notifyPledge(tokenId);
          });
        })
        .catch((e) => {
          this.$toast.error(e && e.message ? e.message : e);
          loadingInstance.close();
        });
    },
  },
};
</script>

<style lang="scss">
.income-dialog {
  background: #1a2027;
  border: 1px solid #2c3638;
  border-radius: 12px 6px 6px 6px;

  .income-header {
    text-align: left;
    font-size: 17px;
    font-family: Arial;
    font-weight: bold;
  }

  .income-content {
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

  .income-form {
    background: #212831;
    border-radius: 11px;
    margin: 22px 0 60px 0;
    padding: 27px 0 32px 0;
  }

  .income-title {
    font-size: 14px;
    font-family: Arial;
    font-weight: bold;
    color: #17e7d6;
    margin: 0 25px;
  }

  .income-label {
    font-size: 13px;
    font-family: Arial;
    font-weight: bold;
    margin: 35px 25px 0 25px;
  }

  .income-value {
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

    .income-unit {
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

  .income-add {
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

  .income-tip {
    font-size: 9px;
    font-family: Arial;
    font-weight: 400;
    color: #747c7c;
    margin: 9px 25px 0 25px;
  }

  .income-btn {
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

.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden;
}

.el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: transparent;
}
</style>
