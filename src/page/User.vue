<template>
  <el-container class="user-container">
    <el-aside width="246px" class="left">
      <el-menu :router="true" text-color="#FFFFFF" active-text-color="#00F9E5">
        <el-menu-item
          v-for="(item, index) in menuList"
          :key="index"
          :index="`/${item.path}`"
        >
          <div
            class="menu-item-content"
            :class="{
              select: $route.path.includes(item.path),
            }"
          >
            <img
              v-if="$store.state.common.theme == 'dark'"
              style="width: 20px; height: 20px"
              :src="
                require(`@/assets/images/user/${item.path}${
                  $route.path.includes(item.path) ? '-light' : ''
                }.png`)
              "
            />
            <img
              v-else
              style="width: 20px; height: 20px"
              :src="require(`@/assets/images/user/${item.path}-dark.png`)"
            />
            <div class="menu-text text-color">{{ item.text }}</div>
          </div>
        </el-menu-item>
      </el-menu>
      <template v-if="isPlanIn != undefined">
        <div class="left-b">
          <div class="title">{{ $t("user.plan_title") }}</div>
          <div class="desc" v-if="isPlanIn">
            {{ $t("user.plan_desc_1") }}
          </div>
          <div class="desc" v-else>
            {{ $t("user.plan_desc_2") }}
          </div>
          <div class="sub" v-if="!isPlanIn">
            <div class="num">{{ fansCount }} / {{ fansSt }}</div>
            <p class="sub-desc">{{ $t("user.plan_sub") }}</p>
          </div>
          <div class="sub" v-else>
            <div class="num">{{ fansCount }}</div>
            <p class="sub-desc">{{ $t("user.plan_sub") }}</p>
          </div>
          <div class="split"></div>
          <div class="sub" v-if="!isPlanIn">
            <div class="num">
              {{ durationSeconds }} / {{ durationSt
              }}<span>{{ $t("user.plan_h") }}</span>
            </div>
            <p class="sub-desc">{{ $t("user.plan_time") }}</p>
          </div>
          <div class="sub" v-else>
            <div class="num">
              {{ durationSeconds }}<span>{{ $t("user.plan_h") }}</span>
            </div>
            <p class="sub-desc">{{ $t("user.plan_time") }}</p>
          </div>
          <el-button
            @click="handleJoinPlan()"
            v-if="!isPlanIn"
            :disabled="!canJoin"
            class="btn common-btn1"
            >{{ $t("user.plan_join") }}</el-button
          >
        </div>
      </template>
    </el-aside>
    <el-main class="right">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import {
  getCreativeDuration,
  getCreativeFans,
  getCreaterData,
} from "@/utils/web3/open";
import {
  ifCreativePlanIn,
  getUserFansCount,
  joinCreativePlan,
} from "@/utils/web3/operator";
import { secondsToHour } from "@/utils/common";
export default {
  name: "user-view",
  data() {
    return {
      menuList: [],
      durationSt: undefined,
      durationSeconds: 0,
      fansSt: undefined,
      fansCount: undefined,
      isPlanIn: false,
    };
  },
  computed: {
    canJoin() {
      if (this.isPlanIn) {
        return false;
      }

      if (
        this.fansSt != undefined &&
        Number(this.fansCount) >= Number(this.fansSt) &&
        this.durationSt != undefined &&
        Number(this.durationSeconds) >= Number(this.durationSt)
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    "$store.state.common.language": function (val, od) {
      if (val != od) {
        this.loadMenuList();
      }
    },
  },
  mounted() {
    this.loadMenuList();
    this.getStandardValue();
  },
  methods: {
    /** 菜单加载 */
    loadMenuList() {
      this.menuList = [
        {
          path: "balance",
          text: this.$t("user.menu_balance"),
        },
        {
          path: "nfts",
          text: this.$t("user.menu_nfts"),
        },
        {
          path: "profile",
          text: this.$t("user.menu_profile"),
        },
      ];
    },
    /** 查询计划阈值 */
    getStandardValue() {
      ifCreativePlanIn()
        .then((planIn) => {
          this.isPlanIn = planIn;
          this.$store.commit("setCreatorPlan", planIn);
          if (!this.isPlanIn) {
            getCreativeDuration()
              .then((r) => {
                this.durationSt = r;
              })
              .catch((e) => {
                console.log(e);
              });
            getCreativeFans()
              .then((r) => {
                this.fansSt = r;
              })
              .catch((e) => {
                console.log(e);
              });
          }
          getUserFansCount()
            .then((r) => {
              this.fansCount = r;
            })
            .catch((e) => {
              console.log(e);
            });

          getCreaterData(this.$store.state.user.account)
            .then((r) => {
              this.durationSeconds = secondsToHour(r[1]);
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /** 加入计划 */
    handleJoinPlan() {
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      joinCreativePlan()
        .then((tx) => {
          console.log(tx);
          this.$toast.success(this.$t("user.plan_success"));
        })
        .catch((e) => {
          this.$toast.error(e.message ? e.message : e);
        })
        .finally(() => {
          this.getStandardValue();
          loadingInstance.close();
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.user-container {
  display: flex;
  padding: 33px 0 50px 0;

  .el-aside {
    overflow: initial;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .el-menu-item:focus,
    .el-menu-item:hover {
      outline: 0;
      background-color: transparent;
    }

    .menu-item-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 14px;
      margin: 20px 0;
      font-family: Arial;
      font-size: 16px;
      font-weight: bold;

      .menu-text {
        line-height: 58px;
        height: 58px;
        margin-left: 10px;
      }

      &.select {
        border-radius: 10px;
      }
    }

    .left-b {
      margin: 50px 10px 13px 10px;
      padding: 15px;

      .title {
        text-align: left;
        font-size: 18px;
        font-family: Arial;
        font-weight: bold;
        line-height: 28px;
      }

      .desc {
        margin-top: 17px;
        text-align: left;
        font-size: 14px;
        font-family: Arial;
        font-weight: bold;
        line-height: 20px;
      }

      .sub {
        text-align: left;
        margin: 20px 0px;
        .num {
          font-size: 24px;
          font-family: Arial;
          font-weight: bold;
          span {
            margin-left: 5px;
            font-size: 12px;
            font-family: Arial;
            font-weight: 400;
          }
        }

        .sub-desc {
          margin-top: 4px;
          font-size: 12px;
          font-family: Arial;
          font-weight: bold;
        }
      }

      .btn {
        margin-top: 40px;
        margin-bottom: 10px;
        width: 198px;
        height: 36px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .el-main {
    padding: 0 0;
    margin-left: 33px;
    border-radius: 8px;
    overflow: hidden;
  }
}
</style>
