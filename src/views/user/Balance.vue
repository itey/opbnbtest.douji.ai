<template>
  <div class="balance-container">
    <div class="balance">
      <div class="text-big text-color">{{ $t("user.balance") }}</div>
      <div class="balance-address-container" @click="handleCopyAddress()">
        <img
          style="width: 16px; height: 16px"
          src="@/assets/images/user/user.png"
        />
        <div class="balance-address">
          {{ $store.state.user.account | omitAddress }}
        </div>
        <img
          style="width: 14px; height: 14px"
          src="@/assets/images/user/copy.png"
        />
      </div>
    </div>
    <div class="balance-value">
      <div class="item">
        <div class="value text-color">
          {{ $store.state.chain.balanceMbd | decimalPlace4 }}
        </div>
        <div class="sub-value text-sub-color">
          ≈${{
            $store.state.chain.balanceMbd * $store.state.chain.mbdPrice ||
            "0.0000" | decimalPlace4
          }}
        </div>
        <div class="unit text-color">MBD</div>
      </div>
      <div class="item">
        <div class="value text-color">0.0000</div>
        <div class="sub-value text-sub-color">≈$0.00</div>
        <div class="unit text-color">MS</div>
      </div>
      <div class="item">
        <div class="value text-color">{{ bjxBalance }}</div>
        <div class="sub-value text-color">
          ≈${{ (bjxBalance * bjxUsdtPrice) | decimalPlace4 }}
        </div>
        <div class="unit text-color">BJXStar NFT</div>
      </div>
      <div class="item">
        <div class="value text-color">0</div>
        <div class="sub-value text-color">&nbsp;</div>
        <div class="unit text-color">DJPlanet NFT</div>
      </div>
    </div>
    <template v-if="false">
      <div class="text-middle text-color">{{ $t("user.ba_dist") }}</div>
      <div class="settle-container">
        <div class="unit text-color">MBD</div>
        <div class="value text-color">0.0000</div>
        <div class="sub-value text-sub-color">≈$0.0000</div>
      </div>
      <div class="settle-button">
        <el-button class="common-btn1" type="primary">{{
          $t("user.settlement")
        }}</el-button>
      </div>
    </template>
    <div class="text-middle text-color">{{ $t("user.ba_income") }}</div>
    <div class="settle-button">
      <el-button
        @click="$refs['creationDialog'].showDialog()"
        class="common-btn1"
        type="primary"
        >{{ $t("user.ba_go_sett") }}</el-button
      >
    </div>
    <div class="divider"></div>
    <div class="text-middle text-color">{{ $t("user.ba_st_in") }}</div>
    <div class="settle-button">
      <el-button
        @click="$refs['incomeDialog'].showDialog()"
        class="common-btn1"
        type="primary"
        >{{ $t("user.ba_go_sett") }}</el-button
      >
    </div>
    <div class="divider"></div>
    <div class="text-middle text-color">{{ $t("user.ba_plat_rew") }}</div>
    <div class="settle-containers">
      <div class="settle-container">
        <div class="unit text-color">MBD</div>
        <div class="value text-color">{{ mbdSettleBalance.balance }}</div>
        <div class="sub-value text-sub-color">
          ≈${{
            (mbdSettleBalance.balance * $store.state.chain.mbdPrice)
              | decimalPlace8
          }}
        </div>
      </div>
      <div class="settle-container" style="margin-left: 32px">
        <div class="unit">BJXStar NFT</div>
        <div class="value text-color">
          {{ Number(bjxSettleBalance.balance) | toFixedString }}
        </div>
        <div class="sub-value text-sub-color">
          ≈${{ bjxUsdtPrice * bjxSettleBalance.balance }}
        </div>
      </div>
    </div>
    <div class="settle-button" style="margin-top: 30px; margin-bottom: 0px">
      <el-button
        @click="$refs['settleConfirmDialog'].showDialog()"
        class="common-btn1"
        type="primary"
        :disabled="
          !settleFee || Number(settleFee) >= Number(mbdSettleBalance.balance)
        "
        >{{ $t("user.settlement") }}</el-button
      >
    </div>
    <div class="text-color settle-label">
      {{ $t("user.ba_sett_fee") }}:
      <span
        :class="
          Number(settleFee) >= Number(mbdSettleBalance.balance)
            ? 'enough'
            : 'not_enough'
        "
        >{{ settleFee }}</span
      >
      MBD
    </div>
    <IncomeDialog ref="incomeDialog" />
    <CreationIncomeDialog ref="creationDialog" />
    <SettleConfirmDialog
      ref="settleConfirmDialog"
      :settleFee="settleFee"
      @confirm="handleSettle()"
    />
  </div>
</template>

<script>
import IncomeDialog from "@/components/user/IncomeDialog.vue";
import CreationIncomeDialog from "@/components/user/CreationIncomeDialog.vue";
import SettleConfirmDialog from "@/components/user/SettleConfirmDialog.vue";
import { accountSettle, getPledgeSettleAccount } from "@/utils/http";
import { getBjxBalanceOf, getBjxUsdtPrice } from "@/utils/web3/open";
import { confirmSettleSign } from "@/utils/web3/chain";
export default {
  name: "balance-view",
  components: {
    IncomeDialog,
    SettleConfirmDialog,
    CreationIncomeDialog,
  },
  computed: {
    userAccount() {
      return this.$store.state.user.account;
    },
    settleFee() {
      if (!this.$store.state.chain.mbdPrice || !this.mbdSettleBalance.balance) {
        return null;
      }
      var fee =
        0.5 / this.$store.state.chain.mbdPrice +
        this.mbdSettleBalance.balance * 0.003;
      return fee.toFixed(8);
    },
    isInPlan() {
      return this.$store.state.user.creatorPlan;
    },
  },
  data() {
    return {
      bjxBalance: 0,
      bjxUsdtPrice: 0,
      settleAccount: [],
      mbdSettleBalance: {},
      bjxSettleBalance: {},
    };
  },
  mounted() {
    this.getBjxBalance();
    this.getSettleAccount();
    this.getBjxPrice();
  },
  methods: {
    /** 点击复制地址 */
    handleCopyAddress() {
      this.$copyText(this.$store.state.user.account).then(
        () => {
          this.$toast.success(this.$t("common.copied_success"));
        },
        () => {
          this.$toast.error(this.$t("copied_failed"));
        }
      );
    },
    /** BJX余额 */
    async getBjxBalance() {
      this.bjxBalance = await getBjxBalanceOf(this.userAccount);
    },
    /** 待结算账户 */
    getSettleAccount() {
      getPledgeSettleAccount()
        .then((r) => {
          if (r.code == 1) {
            this.settleAccount = r.data.list;
            this.mbdSettleBalance = this._.find(this.settleAccount, {
              wallet_type: 1,
            });
            this.bjxSettleBalance = this._.find(this.settleAccount, {
              wallet_type: 2,
            });
          }
        })
        .catch((e) => {
          this.$toast.error(e && e.message ? e.message : e);
        });
    },
    /** BJX的USDT价格 */
    getBjxPrice() {
      getBjxUsdtPrice().then((r) => {
        this.bjxUsdtPrice = r;
      });
    },
    /** 执行结算 */
    handleSettle() {
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      confirmSettleSign()
        .then((signed) => {
          accountSettle(signed)
            .then((r) => {
              if (r.code == 1) {
                this.$toast.success(this.$t("user.settle_success"));
              } else {
                this.$toast.error(r.message);
              }
            })
            .catch((e) => {
              this.$toast.error(e && e.message ? e.message : e);
            })
            .finally(() => {
              loadingInstance.close();
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

<style lang="scss" scoped>
.balance-container {
  width: 100%;
  padding: 0 25px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .text-big {
    font-size: 32px;
    line-height: 32px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    margin-bottom: auto;
  }

  .text-middle {
    font-size: 24px;
    line-height: 24px;
    font-family: Arial;
    font-weight: bold;
    margin: 30px 0px;
  }

  .balance {
    display: flex;
    align-items: flex-end;
    margin-top: 44px;

    .balance-address-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 24px;
      border-radius: 5px;
      padding: 0 9px;
      cursor: pointer;
      margin-left: 21px;

      .balance-address {
        font-size: 14px;
        font-family: Arial;
        font-weight: bold;
        color: #99b1c4;
        padding: 0 10px 0 7px;
      }
    }
  }

  .balance-value {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 34px;

    .item {
      min-width: 150px;
      border-radius: 8px;
      padding: 28px 27px 31px 27px;
      flex: 1;
      margin-right: 33px;
      text-align: left;

      &:last-child {
        margin-right: 0;
      }

      .value {
        line-height: 24px;
        font-size: 24px;
        font-family: Source Han Sans CN;
        font-weight: bold;
      }

      .sub-value {
        line-height: 40px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
      }

      .unit {
        line-height: 16px;
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: bold;
      }
    }
  }

  .divider {
    width: 85%;
    height: 1px;
  }

  .settle-containers {
    display: flex;
    flex-direction: row;
  }

  .settle-container {
    padding: 32px 31px 38px 31px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 416px;
    border-radius: 8px;

    .unit {
      line-height: 16px;
      font-size: 16px;
      font-family: Arial;
      font-weight: bold;
    }

    .value {
      line-height: 24px;
      font-size: 24px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      margin-top: 20px;
    }

    .sub-value {
      line-height: 14px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      margin-top: 38px;
    }
  }

  .settle-button {
    display: flex;
    flex-direction: row;
    margin-bottom: 30px;
  }

  .settle-label {
    line-height: 12px;
    font-size: 12px;
    font-family: Arial;
    font-weight: 400;
    margin: 12px 0 44px 0;
  }
  .common-btn1 {
    height: auto;
  }
}
</style>
