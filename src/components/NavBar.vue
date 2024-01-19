<template>
  <div>
    <div class="navbar-container">
      <img
        @click="$router.push('/')"
        style="width: 120px; height: 27px; cursor: pointer"
        src="@/assets/logo.png"
      />
      <div class="navbar-divider"></div>
      <div class="navbar-menu">
        <div class="navbar-menu-item text-color" @click="$router.push('/')">
          {{ $t("common.home") }}
        </div>
        <div class="navbar-menu-item text-color" @click="$router.push('/news')">
          {{ $t("common.news") }}
        </div>
        <div class="navbar-menu-item text-color" @click="toNavigation()">
          {{ $t("common.navigation") }}
        </div>
        <div
          class="navbar-menu-item text-color"
          @click="$router.push('/market')"
        >
          {{ $t("common.marketplace") }}
        </div>
        <div
          class="navbar-menu-item text-color"
          @click="$router.push('/create')"
        >
          {{ $t("common.create") }}
        </div>
      </div>
      <div v-show="!$store.state.user.token">
        <Particle
          :theme="$store.state.common.theme"
          :isLogout="$store.state.user.logout"
          :lang="$i18n.locale"
          :openAccount="$store.state.common.openAccount"
          :openBuy="$store.state.common.openBuy"
          :openConnect="$store.state.common.openConnect"
          :isParticleProvider="$store.state.common.isParticleProvider"
        />
      </div>
      <div v-if="$store.state.user.token" class="user-container">
        <div class="wallet">
          <img class="icon" src="@/assets/images/user-wallet.png" />
          <div>{{ $store.state.chain.balanceMbd | decimalPlace4 }} MBD</div>
          <div class="divider"></div>
          <div>{{ $store.state.chain.balanceBnb | decimalPlace4 }} BNB</div>
        </div>
        <div @click="userMenuVisible = true">
          <el-popover :visible-arrow="false" v-model="userMenuVisible">
            <div class="menu-container">
              <img
                @click="userMenuVisible = false"
                class="close"
                src="@/assets/images/menu-close.png"
              />
              <div
                class="item"
                @click="
                  menuClick({
                    path: '/creator',
                    query: { address: $store.state.user.account },
                  })
                "
              >
                <div class="icon">
                  <img
                    style="width: 17px; height: 17px"
                    src="@/assets/images/user-icon.png"
                  />
                </div>
                <span>{{ $store.state.user.account | omitAddress }}</span>
              </div>
              <div class="item" @click="menuClick('/user')">
                <div class="icon">
                  <img
                    style="width: 17px; height: 17px"
                    src="@/assets/images/menu-user.png"
                  />
                </div>
                <span>{{ $t("common.user_center") }}</span>
              </div>
              <template v-if="isParticleProvider">
                <div class="item" @click="openWalletModal()">
                  <div class="icon">
                    <img
                      style="width: 17px; height: 17px"
                      src="@/assets/images/menu-wallet.png"
                    />
                  </div>
                  <span>{{ $t("common.wallet") }}</span>
                </div>
                <div class="item" @click="openBuyModal()">
                  <div class="icon">
                    <img
                      style="width: 17px; height: 17px"
                      src="@/assets/images/menu-currency.png"
                    />
                  </div>
                  <span>{{ $t("common.buy_currency") }}</span>
                </div>
              </template>
              <div class="item" @click="handleCopyAddress()">
                <div class="icon">
                  <img
                    style="width: 17px; height: 17px"
                    src="@/assets/images/menu-copy.png"
                  />
                </div>
                <span>{{ $t("common.copy_address") }}</span>
              </div>
              <div class="item" @click="signOutClick()">
                <div class="icon">
                  <img
                    style="width: 17px; height: 17px"
                    src="@/assets/images/menu-exit.png"
                  />
                </div>
                <span>{{ $t("common.sign_out") }}</span>
              </div>
            </div>
            <div slot="reference" class="user">
              <img
                style="width: 17px; height: 17px"
                src="@/assets/images/user-icon.png"
              />
              <span class="text">
                {{ $store.state.user.account | omitAddress }}
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
            </div>
          </el-popover>
        </div>
        <div @click="networksVisible = true">
          <el-popover :visible-arrow="false" v-model="networksVisible">
            <div class="menu-container">
              <img
                @click="networksVisible = false"
                class="close"
                src="@/assets/images/menu-close.png"
              />
              <div class="item" @click="toChangeNetwork(97)">
                <div class="icon">
                  <img
                    style="width: 17px; height: 17px"
                    src="@/assets/images/BNB.png"
                  />
                </div>
                <span>BNB Chain Testnet</span>
              </div>
              <div class="item" @click="toChangeNetwork(5611)">
                <div class="icon">
                  <img
                    style="width: 17px; height: 17px"
                    src="@/assets/images/opbnb.png"
                  />
                </div>
                <span>opBNB Testnet</span>
              </div>
            </div>
            <div slot="reference" class="user">
              <span class="text" style="color: #90a9c6">
                opBNB Testnet
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
            </div>
          </el-popover>
        </div>
      </div>
      <div class="navbar-language" @click="languageVisible = true">
        <el-popover
          placement="bottom"
          width="79px"
          height="79px"
          :visible-arrow="false"
          v-model="languageVisible"
          :append-to-body="false"
          :popper-options="{
            boundariesElement: 'body',
            gpuAcceleration: true,
            positionFixed: true,
            preventOverflow: true,
          }"
        >
          <div class="language-select">
            <div
              @click="languageClick('en')"
              class="select"
              :class="
                $store.state.common.language == 'en' ? 'select-light' : ''
              "
            >
              English
            </div>
            <div
              @click="languageClick('zh_hant')"
              class="select"
              :class="
                $store.state.common.language == 'zh_hant' ? 'select-light' : ''
              "
            >
              繁體中文
            </div>
          </div>
          <img
            slot="reference"
            style="width: 16px; height: 16px; padding: 4px 4px"
            src="@/assets/images/language.png"
          />
        </el-popover>
      </div>
      <div
        v-if="$store.state.common.theme == 'light'"
        style="margin-right: 14px; cursor: pointer; display: flex"
        @click="themeClick('dark')"
      >
        <img
          style="width: 16px; height: 16px"
          src="@/assets/images/theme-light.png"
        />
      </div>
      <div
        v-else
        style="margin-right: 14px; cursor: pointer; display: flex"
        @click="themeClick('light')"
      >
        <img
          style="width: 16px; height: 16px"
          src="@/assets/images/theme-dark.png"
        />
      </div>
    </div>
    <div
      class="news-types-container"
      v-if="menuSubVisible"
      @mouseover="menuToggle(true)"
      @mouseout="menuToggle(false)"
    >
      <news-types></news-types>
    </div>
  </div>
</template>

<script>
import Particle from "@/components/react-app/particle";
export default {
  name: "nav-bar",
  components: {
    Particle,
  },
  computed: {
    isParticleProvider() {
      return this.$store.state.common.isParticleProvider;
    },
  },
  data() {
    return {
      languageVisible: false,
      userMenuVisible: false,
      networksVisible: false,
      menuSubVisible: false,
      toggleId: null,
      chainNameOption: {
        56: "BSC Mainnet",
        97: "https://test.douji.ai/",
        204: "opBNB Mainnet",
        5611: "https://opbnbtest.douji.ai/",
      },
    };
  },
  methods: {
    themeClick(theme) {
      this.$store.commit("setTheme", theme);
      // location.reload()
    },
    languageClick(locale) {
      this.languageVisible = false;
      this.$i18n.locale = locale;
      this.$store.commit("setLanguage", locale);
    },
    menuClick(path) {
      this.userMenuVisible = false;
      this.$router.push(path);
    },
    openWalletModal() {
      this.$store.commit("setOpenAccount", true);
      this.userMenuVisible = false;
    },
    openBuyModal() {
      this.$store.commit("setOpenBuy", true);
      this.userMenuVisible = false;
    },
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
    signOutClick() {
      this.userMenuVisible = false;
      this.$store.dispatch("Logout");
    },
    toNavigation() {
      window.open("https://navigation.douji.ai", "_blank");
    },
    toChangeNetwork(chainId) {
      const url = this.chainNameOption[chainId];
      window.location = url;
    },
    menuToggle(visible) {
      if (this.toggleId) {
        clearTimeout(this.toggleId);
      }
      this.toggleId = setTimeout(() => {
        this.menuSubVisible = visible;
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar-container {
  width: 1440px;
  height: 77px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .navbar-divider {
    margin-left: 29px;
    margin-right: 12px;
    height: 14px;
    width: 1px;
    background: #ffffff;
  }

  .navbar-menu {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    align-content: flex-start;

    .navbar-menu-item {
      height: 77px;
      line-height: 77px;
      padding: 0 12px;
      margin: 0 10px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #ffffff;
      cursor: pointer;
    }

    .navbar-menu-item:hover {
      color: #17e7d6;
    }
  }

  .navbar-language {
    width: 24px;
    height: 24px;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 18px;
  }

  .navbar-language:hover {
    background: #2a333e;
  }

  .user-container {
    display: flex;
    flex-direction: row;
    align-items: center;

    .wallet {
      display: flex;
      flex-direction: row;
      align-items: center;
      background: #212a35;
      border-radius: 14px;
      height: 27px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #90a9c6;
      padding: 0 13px;

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 12px;
        height: 12px;
        margin-right: 8px;
      }

      .divider {
        width: 1px;
        height: 13px;
        background: #2c3846;
        margin: 0 7px;
      }
    }

    .user {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 13px;
      cursor: pointer;

      .text {
        margin: 0 6px;
      }
    }
  }
}

.news-types-container {
  position: fixed;
  top: 77px;
  left: 0;
  right: 0;
}

.el-popover {
  .language-select {
    margin: 9px 7px;

    .select {
      width: 65px;
      font-size: 11px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      text-align: center;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;

      &:not(:last-child) {
        margin-bottom: 9px;
      }

      &.select-light {
        height: 31px;
        background: #3a4a5c;
        border-radius: 8px;
        color: #00fbe6;
        line-height: 31px;
      }
    }
  }

  .menu-container {
    position: relative;
    width: 237px;
    padding: 14px 0;
    font-size: 14px;

    .close {
      width: 9px;
      height: 9px;
      padding: 10px;
      position: absolute;
      top: 7px;
      right: 4px;
      cursor: pointer;
    }

    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      line-height: 31px;
      cursor: pointer;
      padding: 0 10px;

      &.item_select {
        background: #3a4a5c;
      }

      .icon {
        width: 17px;
        height: 17px;
        margin-right: 7px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      span {
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #ffffff;
      }
    }

    .item:hover {
      span {
        color: #00fbe6;
      }
    }
  }
}
</style>
