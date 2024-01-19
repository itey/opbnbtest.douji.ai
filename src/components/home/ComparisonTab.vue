<template>
  <div class="comparison-tab">
    <div class="tab-header">
      <div
        class="tab-header-item text-color"
        :class="{
          select: currentIndex == 0,
        }"
        @click="currentIndex = 0"
      >
        {{ $t("home.tab_rich_resources") }}
      </div>
      <div
        class="tab-header-item text-color"
        :class="{
          select: currentIndex == 1,
        }"
        @click="currentIndex = 1"
      >
        {{ $t("home.tab_creators_rights") }}
      </div>
      <div
        class="tab-header-item text-color"
        :class="{
          select: currentIndex == 2,
        }"
        @click="currentIndex = 2"
      >
        {{ $t("home.tab_content_model") }}
      </div>
      <div
        class="tab-header-item text-color"
        :class="{
          select: currentIndex == 3,
        }"
        @click="currentIndex = 3"
      >
        {{ $t("home.tab_diversified_models") }}
      </div>
      <div
        class="tab-header-item text-color"
        :class="{
          select: currentIndex == 4,
        }"
        @click="currentIndex = 4"
      >
        {{ $t("home.tab_income_timely") }}
      </div>
      <div
        class="tab-header-item text-color"
        :class="{
          select: currentIndex == 5,
        }"
        @click="currentIndex = 5"
      >
        {{ $t("home.tab_platform_model") }}
      </div>
    </div>
    <div>
      <div
        v-if="currentIndex == 0"
        class="tab-item theme-background-color tab1"
      >
        <div class="tab-row">
          <img
            style="width: 200px; height: 200px"
            src="@/assets/images/home/ai.png"
          />
          <div class="tab-row-text">
            <div class="title text-color">{{ $t("home.tab_ai_tools") }}</div>
            <div class="desc">
              {{ $t("home.tab_the_platform_standards") }}
            </div>
          </div>
        </div>
        <div class="division"></div>
        <div class="tab-row">
          <div class="tab-row-text">
            <div class="title text-color">
              {{ $t("home.tab_content_resources") }}
            </div>
            <div class="desc">
              {{ $t("home.tab_the_platform_production") }}
            </div>
          </div>
          <img
            style="width: 200px; height: 200px"
            src="@/assets/images/home/resource.png"
          />
        </div>
      </div>
      <div
        v-if="currentIndex == 1"
        class="tab-item theme-background-color tab2"
      >
        <div class="item">
          <img
            style="width: 145px; height: 145px"
            src="@/assets/images/home/ownership.png"
          />
          <div class="title text-color">
            {{ $t("home.tab_content_ownership") }}
          </div>
          <div class="desc">{{ $t("home.tab_content_circulation") }}</div>
        </div>
        <div class="item">
          <img
            style="width: 145px; height: 145px"
            src="@/assets/images/home/ownershi.png"
          />
          <div class="title text-color">
            {{ $t("home.tab_user_ownership") }}
          </div>
          <div class="desc">{{ $t("home.tab_the_result_platform") }}</div>
        </div>
        <div class="item">
          <img
            style="width: 145px; height: 145px"
            src="@/assets/images/home/ownershir.png"
          />
          <div class="title text-color">
            {{ $t("home.tab_income_ownership") }}
          </div>
          <div class="desc">{{ $t("home.tab_the_creator_creator") }}</div>
        </div>
      </div>
      <div
        v-if="currentIndex == 2"
        class="tab-item theme-background-color tab3"
      >
        <div class="tab-tip">{{ $t("home.tab_the_platform_works") }}</div>
        <div class="tab-bottom">
          <div class="tab-row">
            <img
              style="width: 160px; height: 160px"
              src="@/assets/images/home/creation.png"
            />
            <div class="tab-row-text">
              <div class="title text-color">
                {{ $t("home.tab_co_creation2") }}
              </div>
              <div class="desc">
                {{ $t("home.tab_creator_value") }}
              </div>
            </div>
          </div>
          <div class="division"></div>
          <div class="tab-row">
            <div class="tab-row-text">
              <div class="title text-color">
                {{ $t("home.tab_content_governance") }}
              </div>
              <div class="desc">{{ $t("home.tab_creators_future_value") }}</div>
            </div>
            <img
              style="width: 160px; height: 160px"
              src="@/assets/images/home/governance.png"
            />
          </div>
        </div>
      </div>
      <div
        v-if="currentIndex == 3"
        class="tab-item theme-background-color tab4"
      >
        <div class="tab-tip">{{ $t("home.tab_platform_works") }}</div>
        <div class="tab-bottom">
          <div class="item">
            <img
              style="width: 46px; height: 35px"
              src="@/assets/images/home/num1.png"
            />
            <div class="tab-item-text">
              <div class="title text-color">
                {{ $t("home.tab_income_content") }}
              </div>
              <div class="desc">{{ $t("home.tab_users_based_on") }}</div>
            </div>
          </div>
          <div class="item">
            <img
              style="width: 46px; height: 35px"
              src="@/assets/images/home/num2.png"
            />
            <div class="tab-item-text">
              <div class="title text-color">
                {{ $t("home.tab_content_income") }}
              </div>
              <div class="desc">{{ $t("home.tab_the_creator_held") }}</div>
            </div>
          </div>
          <div class="item">
            <img
              style="width: 46px; height: 35px"
              src="@/assets/images/home/num3.png"
            />
            <div class="tab-item-text">
              <div class="title text-color">
                {{ $t("home.tab_content_copyright_income") }}
              </div>
              <div class="desc">{{ $t("home.tab_creators_transaction") }}</div>
            </div>
          </div>
          <div class="item">
            <img
              style="width: 46px; height: 35px"
              src="@/assets/images/home/num4.png"
            />
            <div class="tab-item-text">
              <div class="title text-color">
                {{ $t("home.tab_content_copyright_income") }}
              </div>
              <div class="desc">{{ $t("home.tab_as_long_dao") }}</div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="currentIndex == 4"
        class="tab-item theme-background-color tab3"
      >
        <div class="tab-tip">{{ $t("home.tab_based_income") }}</div>
        <div class="tab-bottom">
          <div class="tab-row" style="padding-top: 10px; padding-bottom: 40px">
            <img
              style="width: 150px; height: 150px"
              src="@/assets/images/home/amount.png"
            />
            <div class="tab-row-text">
              <div class="title text-color">
                {{ $t("home.tab_amount_controllable") }}
              </div>
              <div class="desc">
                {{ $t("home.tab_creator_creative_income") }}
              </div>
            </div>
          </div>
          <div class="division"></div>
          <div class="tab-row" style="padding-top: 40px; padding-bottom: 40px">
            <div class="tab-row-text">
              <div class="title text-color">
                {{ $t("home.tab_Revenues_time") }}
              </div>
              <div class="desc">{{ $t("home.tab_income_transfer") }}</div>
            </div>
            <img
              style="width: 150px; height: 150px"
              src="@/assets/images/home/revenue.png"
            />
          </div>
        </div>
      </div>
      <div
        v-if="currentIndex == 5"
        class="tab-item theme-background-color tab3"
      >
        <div class="tab-tip">{{ $t("home.tab_douji_platform") }}</div>
        <div class="tab-bottom">
          <div class="tab-row">
            <img
              style="width: 150px; height: 150px"
              src="@/assets/images/home/dao.png"
            />
            <div class="tab-row-text">
              <div class="title text-color">
                {{ $t("home.tab_platform_rights") }}
              </div>
              <div class="desc">{{ $t("home.tab_dao_voting") }}</div>
            </div>
          </div>
          <div class="division"></div>
          <div class="tab-row">
            <div class="tab-row-text">
              <div class="title text-color">
                {{ $t("home.tab_platform_rights2") }}
              </div>
              <div class="desc">{{ $t("home.tab_dao_members") }}</div>
            </div>
            <img
              style="width: 150px; height: 150px"
              src="@/assets/images/home/dividend.png"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "comparison-tab",
  data() {
    return {
      currentIndex: 0,
    };
  },
};
</script>

<style lang="scss">
.comparison-tab {
  height: 580px;
  margin-top: 84px;
  display: flex;
  flex-direction: row;
  align-content: space-between;

  .tab-header {
    display: flex;
    flex-direction: column;
    // justify-content: space-between;

    .tab-header-item {
      width: 404px;
      font-size: 28px;
      font-family: Source Han Sans CN;
      font-weight: 800;
      line-height: 42px;
      padding-left: 13px;
      border-left: 3px solid #527293;
      font-weight: bold;
      color: #527293;
      cursor: pointer;
      text-align: left;
      margin-top: 20px;
    }

    .select {
      color: #ffffff;
      font-size: 30px;
      border-left: 3px solid;
      border-image: linear-gradient(0deg, #4195f6, #17e7d6) 1;
    }
  }

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 580px;
    width: 960px;
    border-radius: 8px;
    margin-left: 55px;
  }

  .tab1 {
    .tab-row {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      padding: 64px 96px 67px 80px;

      .tab-row-text {
        flex: 1;
        text-align: left;

        .title {
          font-size: 20px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          margin-top: 18px;
        }

        .desc {
          margin-top: 20px;
          font-size: 14px;
          font-family: Source Han Sans CN;
          line-height: 25px;
        }
      }
    }

    .division {
      display: block;
      width: 820px;
    }
  }

  .tab2 {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .item {
      flex: 1;
      height: 490px;
      border-radius: 15px;
      margin: 0 22px;

      &:last-child {
        margin-left: 0;
      }

      &:first-child {
        margin-right: 0;
      }

      img {
        margin-top: 44px;
      }

      .title {
        margin-top: 0;
        text-align: center;
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        padding: 0px 20px;
      }

      .desc {
        text-align: left;
        margin: 18px 24px 38px 24px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        line-height: 25px;
      }
    }
  }

  .tab3 {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .division {
      display: block;
      width: 820px;
      align-self: center;
    }

    .tab-tip {
      width: 840px;
      border-radius: 10px;
      line-height: 25px;
      padding: 15px 12px;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #8daed5;
      margin-top: 24px;
      vertical-align: middle;
      text-align: left;
    }

    .tab-bottom {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .tab-row {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding: 54px 96px;

        .tab-row-text {
          flex: 1;
          text-align: left;

          .title {
            font-size: 18px;
            font-family: Source Han Sans CN;
            font-weight: bold;
          }

          .desc {
            margin-top: 20px;
            font-size: 14px;
            font-family: Source Han Sans CN;
            line-height: 25px;
          }
        }
      }
    }
  }

  .tab4 {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .tab-tip {
      width: 864px;
      border-radius: 10px;
      line-height: 52px;
      padding: 0 9px;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #8daed5;
      margin-top: 24px;
      vertical-align: middle;
      text-align: center;
    }

    .tab-bottom {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;

      .item {
        width: 420px;
        height: 200px;
        margin-bottom: 26px;
        border-radius: 10px;
        position: relative;

        img {
          position: absolute;
          left: -18px;
          top: 64px;
        }

        .title {
          font-size: 18px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          text-align: center;
          margin-top: 19px;
        }

        .desc {
          margin: 17px 29px 0 39px;
          font-size: 14px;
          font-family: SourceHanSansCN-Bold;
          line-height: 25px;
          text-align: left;
        }
      }
    }
  }
}
</style>
