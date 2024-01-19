<template>
  <div class="creator-head">
    <div class="content-container">
      <div class="avatar">
        <img :src="userInfo.head_img" v-if="userInfo.head_img" />
        <img v-else src="@/assets/avatar.jpg" />
      </div>
      <div class="user-info">
        <div class="title">
          <span class="name">{{ userInfo.nickname }}</span>
          <div class="address">
            <span>{{ address | omitAddress }}</span>
            <img
              style="width: 14px; height: 14px"
              src="@/assets/images/user/copy.png"
              @click="handleCopyAddress()"
            />
          </div>
        </div>
        <div class="desc">
          {{ userInfo.short_description }}
        </div>
        <template
          v-if="
            userAccount && userAccount.toLowerCase() != address.toLowerCase()
          "
        >
          <div class="sub_btn" v-if="!isSubscription" @click="handleSubOut()">
            <img
              style="width: 13px; height: 13px; margin-right: 5px"
              src="@/assets/images/news/add.png"
            />
            <span>Subscription</span>
          </div>
          <div class="sub_btn gray" v-else @click="handleSub()">
            <img
              style="width: 13px; height: 13px; margin-right: 5px"
              src="@/assets/images/news/true.png"
            />
            <span>Subscription</span>
          </div>
        </template>

        <div class="tag_container">
          <div class="tag" v-if="userInfo.location">
            <img :src="require(`@/assets/images/creator/location.png`)" />
            <span>{{ userInfo.location | cutString(20) }}</span>
          </div>
          <div
            class="tag"
            @click="handleGoTo(userInfo.website)"
            v-if="userInfo.website"
          >
            <img :src="require(`@/assets/images/creator/web.png`)" />
            <span>Website</span>
          </div>

          <div
            class="tag"
            @click="handleGoTo(userInfo.twitter)"
            v-if="userInfo.twitter"
          >
            <img :src="require(`@/assets/images/creator/twitter.png`)" />
            <span>Twitter</span>
          </div>
          <div
            class="tag"
            @click="handleGoTo(userInfo.instagram)"
            v-if="userInfo.instagram"
          >
            <img :src="require(`@/assets/images/creator/instagram.png`)" />
            <span>Instagram</span>
          </div>
          <div
            class="tag"
            @click="handleGoTo(userInfo.youtube)"
            v-if="userInfo.youtube"
          >
            <img :src="require(`@/assets/images/creator/youtube.png`)" />
            <span>Youtube</span>
          </div>
          <div
            class="tag"
            @click="handleGoTo(userInfo.facebook)"
            v-if="userInfo.facebook"
          >
            <img :src="require(`@/assets/images/creator/facebook.png`)" />
            <span>Facebook</span>
          </div>
          <div
            class="tag"
            @click="handleGoTo(userInfo.tiktok)"
            v-if="userInfo.tiktok"
          >
            <img :src="require(`@/assets/images/creator/tiktok.png`)" />
            <span>Tiktok</span>
          </div>
          <div
            class="tag"
            @click="handleGoTo(userInfo.github)"
            v-if="userInfo.github"
          >
            <img :src="require(`@/assets/images/creator/github.png`)" />
            <span>Github</span>
          </div>
          <div
            class="tag"
            @click="handleGoTo(userInfo.linkedin)"
            v-if="userInfo.linkedin"
          >
            <img :src="require(`@/assets/images/creator/linkedin.png`)" />
            <span>Linkedin</span>
          </div>
          <div
            class="tag"
            @click="handleGoTo(userInfo.discord)"
            v-if="userInfo.discord"
          >
            <img :src="require(`@/assets/images/creator/discord.png`)" />
            <span>Discord</span>
          </div>
          <div
            class="tag"
            @click="handleGoTo(userInfo.line)"
            v-if="userInfo.line"
          >
            <img :src="require(`@/assets/images/creator/line.png`)" />
            <span>Line</span>
          </div>
          <div
            class="tag"
            @click="handleGoTo(userInfo.medium)"
            v-if="userInfo.medium"
          >
            <img
              :src="require(`@/assets/images/creator/medium-circle-fill.png`)"
            />
            <span>Medium</span>
          </div>
          <div
            class="tag"
            @click="handleGoTo(userInfo.telegram)"
            v-if="userInfo.telegram"
          >
            <img :src="require(`@/assets/images/creator/telegram.png`)" />
            <span>Telegram</span>
          </div>
          <div
            class="tag"
            @click="handleGoTo(userInfo.wechat)"
            v-if="userInfo.wechat"
          >
            <img :src="require(`@/assets/images/creator/wechat.png`)" />
            <span>Wechat</span>
          </div>
          <div
            class="tag"
            @click="handleGoTo(userInfo.whatsapp)"
            v-if="userInfo.whatsapp"
          >
            <img :src="require(`@/assets/images/creator/whatsapp.png`)" />
            <span>Whatsapp</span>
          </div>
          <div
            class="tag"
            @click="handleGoTo(userInfo.bilibili)"
            v-if="userInfo.whatsapp"
          >
            <img :src="require(`@/assets/images/creator/bilibili.png`)" />
            <span>Bilibili</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { subscribeAuthorContract, isFollow } from "@/utils/web3/operator";
import { getOtUserInfo } from "@/utils/http";
export default {
  name: "creator-head",
  computed: {
    userAccount() {
      return this.$store.state.user.account;
    },
  },
  data() {
    return {
      isSubscription: undefined,
      userInfo: {},
      address: undefined,
    };
  },
  created() {
    this.address = this.$route.query.address;
    this.userInfoGet();
    this.checkIfFollow();
  },
  methods: {
    /** 点击关注 */
    handleSub() {
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      subscribeAuthorContract(this.address)
        .then(() => {
          this.$toast.success(this.$t("common.follow_success"));
          this.checkIfFollow();
          loadingInstance.close();
        })
        .catch((e) => {
          this.$toast.error(e && e.message ? e.message : e);
          this.checkIfFollow();
          loadingInstance.close();
        });
    },
    /** 点击取消关注 */
    handleSubOut() {
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      subscribeAuthorContract(this.address)
        .then(() => {
          this.$toast.success(this.$t("common.un_follow_success"));
          this.checkIfFollow();
          loadingInstance.close();
        })
        .catch((e) => {
          this.$toast.error(e && e.message ? e.message : e);
          this.checkIfFollow();
          loadingInstance.close();
        });
    },
    /** 查询是否已关注创作者 */
    checkIfFollow() {
      if (!this.userAccount || !this.address) {
        return;
      }
      isFollow(this.address)
        .then((r) => {
          this.isSubscription = r;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /** 用户信息查询 */
    userInfoGet() {
      if (!this.address) {
        return;
      }
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      getOtUserInfo(this.address)
        .then((r) => {
          if (r.code == 1) {
            this.userInfo = r.data;
          } else {
            this.$toast.error(r.message);
          }
        })
        .finally(() => {
          loadingInstance.close();
        });
    },
    /** 点击复制按钮 */
    handleCopyAddress() {
      this.$copyText(this.address).then(
        () => {
          this.$toast.success(this.$t("common.copied_success"));
        },
        () => {
          this.$toast.error(this.$t("copied_failed"));
        }
      );
    },
    /** 点击跳转 */
    handleGoTo(url) {
      if (!url) {
        return;
      }
      window.open(url, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
.creator-head {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  width: 100%;
  .content-container {
    padding: 58px 0 44px 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 1440px;

    .avatar {
      display: block;
      width: 164px;
      height: 164px;
      border-radius: 20px;

      img {
        width: 164px;
        height: 164px;
        border-radius: 20px;
      }
    }

    .user-info {
      margin-left: 28px;
      .title {
        display: flex;
        align-items: center;

        .name {
          display: block;
          font-size: 30px;
          font-family: Source Han Sans CN;
          font-weight: bold;
        }
        .address {
          display: block;
          align-items: center;
          margin-left: 13px;
          border-radius: 5px;
          padding: 7px 6px 7px 6px;

          span {
            font-size: 14px;
            font-family: Arial;
            font-weight: bold;
            color: #99b1c4;
          }

          img {
            margin-left: 10px;
            cursor: pointer;
          }
        }
      }

      .desc {
        margin-top: 18px;
        text-align: left;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #99b1c4;
        line-height: 22px;
      }

      .sub_btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 26px;
        width: 136px;
        height: 38px;
        background: #12c7b8;
        border-radius: 19px;
        cursor: pointer;

        span {
          font-size: 14px;
          font-family: Arial;
          font-weight: bold;
          color: #ffffff;
        }

        &.gray {
          background-color: #657a8a;
          span {
            color: #a5b5c3;
          }
        }
      }

      .tag_container {
        display: flex;
        align-items: center;
        margin-top: 38px;
        .tag {
          display: flex;
          align-items: center;
          padding: 8px;
          background: #262f39;
          border-radius: 5px;
          margin-right: 10px;
          cursor: pointer;
          img {
            width: 16px;
            height: 16px;
            margin-right: 5px;
          }
          span {
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: #99b1c4;
            line-height: 22px;
          }
        }
      }
    }
  }
}
</style>