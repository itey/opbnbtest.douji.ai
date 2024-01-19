<template>
  <div class="info-container">
    <div class="author-container">
      <img
        @click="$router.push({ path: '/creator', query: { address: creator } })"
        style="width: 52px; height: 52px; border-radius: 26px; cursor: pointer"
        :src="creatorInfo.head_img"
        v-if="creatorInfo.head_img"
      />
      <img
        @click="$router.push({ path: '/creator', query: { address: creator } })"
        style="width: 52px; height: 52px; border-radius: 26px; cursor: pointer"
        v-else
        src="@/assets/avatar.jpg"
      />
      <div class="author-info">
        <div class="author-name">
          by
          <span
            @click="
              $router.push({ path: '/creator', query: { address: creator } })
            "
            v-if="creatorInfo.nickname"
            >{{ creatorInfo.nickname }}</span
          >
          <span
            @click="
              $router.push({ path: '/creator', query: { address: creator } })
            "
            style="color: #00f9e5"
            v-else
            >{{ creator | omitAddress }}</span
          >
        </div>
        <div class="author-desc">{{ creatorInfo.short_description }}</div>
      </div>
      <template
        v-if="userAccount && userAccount.toLowerCase() != creator.toLowerCase()"
      >
        <div
          class="subscription unsubscribe"
          v-if="subscription"
          @click="handleSubOut()"
        >
          <!-- <img
            style="width: 13px; height: 9px"
            src="@/assets/images/news/true.png"
          /> -->
          <span>{{ $t("news-detail.un_subscribe") }}</span>
        </div>
        <div class="subscription light" v-else @click="handleSub()">
          <img
            style="width: 9px; height: 9px"
            src="@/assets/images/news/add.png"
          />
          <span>{{ $t("news-detail.subscribe") }}</span>
        </div>
      </template>
    </div>
    <div class="news-info">
      <div class="news-info-item">
        <div class="news-info-item-label">
          <img
            v-if="$store.state.common.theme == 'dark'"
            src="@/assets/images/news/date.png"
          />
          <img v-else src="@/assets/images/news/date-light.png" />
          <span>{{ nftInfo[2] | formatSeconds }}</span>
        </div>
        <!-- <div class="news-info-item-value">
          <img src="@/assets/images/up.png" />
          <span>6528 Min</span>
        </div>-->
      </div>
      <div class="news-info-item">
        <div class="news-info-item-label">
          <img v-if="isPraise" src="@/assets/images/news/is_like.png" />
          <img
            v-else-if="$store.state.common.theme == 'dark'"
            src="@/assets/images/news/like.png"
            @click="handlePraise()"
          />
          <img
            v-else
            src="@/assets/images/news/like-light.png"
            @click="handlePraise()"
          />
          <span>{{ nftInfo[1] }}</span>
        </div>
        <!-- <div class="news-info-item-value">
          <img src="@/assets/images/up.png" />
          <span>6528</span>
        </div>-->
      </div>
      <div class="news-info-item">
        <div class="news-info-item-label">
          <img v-if="isCollect" src="@/assets/images/news/is_star.png" />
          <img
            v-else-if="$store.state.common.theme == 'dark'"
            src="@/assets/images/news/star.png"
            @click="collectPraise()"
          />
          <img
            v-else
            src="@/assets/images/news/star-light.png"
            @click="collectPraise()"
          />
          <span>{{ nftInfo[0] }}</span>
        </div>
        <!-- <div class="news-info-item-value">
          <img src="@/assets/images/up.png" />
          <span>6528</span>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { getOtUserInfo } from "@/utils/http";
import {
  isAlreadyPraiseCollect,
  nftCollect,
  nftPraise,
} from "@/utils/web3/nft";
import { getCPD } from "@/utils/web3/open";
import { subscribeAuthorContract, isFollow } from "@/utils/web3/operator";
export default {
  name: "nft-author-info",
  props: {
    creator: {
      type: String,
      default: "",
    },
    tokenId: {
      type: String,
      default: "",
    },
  },
  watch: {
    "$store.state.user.account": function (val, od) {
      if (val != od) {
        this.checkIfPraiseCollect();
      }
    },
  },
  computed: {
    userAccount() {
      return this.$store.state.user.account;
    },
  },
  data() {
    return {
      subscription: false,
      isPraise: false,
      isCollect: false,
      creatorInfo: {},
      nftInfo: [],
    };
  },
  mounted() {
    if (this.creator) {
      this.infoInit();
    }
    if (this.userAccount) {
      this.checkIfPraiseCollect();
    }
  },
  methods: {
    /** 点击关注 */
    handleSub() {
      const executeProcess = () => {
        var loadingInstance = this.$loading({
          background: "rgba(0, 0, 0, 0.8)",
        });
        subscribeAuthorContract(this.creator)
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
      };
      if (this.$store.state.chain.balanceBnb < 0.01) {
        this.$bnbConfirm(this.$store.state.common.language, () => {
          executeProcess();
        });
        return;
      }
      executeProcess();
    },
    /** 点击取消关注 */
    handleSubOut() {
      const executeProcess = () => {
        var loadingInstance = this.$loading({
          background: "rgba(0, 0, 0, 0.8)",
        });
        subscribeAuthorContract(this.creator)
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
      };
      if (this.$store.state.chain.balanceBnb < 0.01) {
        this.$bnbConfirm(this.$store.state.common.language, () => {
          executeProcess();
        });
        return;
      }
      executeProcess();
    },
    infoInit() {
      Promise.all([
        this.loadUserInfo(),
        this.loadNftInfo(),
        this.checkIfFollow(),
      ]).catch((e) => {
        console.log(e);
      });
    },
    /** 加载用户信息 */
    loadUserInfo() {
      return new Promise((resolve, reject) => {
        getOtUserInfo(this.creator)
          .then((r) => {
            if (r.code == 1) {
              this.creatorInfo = r.data;
              return resolve();
            } else {
              return reject(r.message);
            }
          })
          .catch((e) => {
            return reject(e);
          });
      });
    },
    /** 获取NFT资料 */
    loadNftInfo() {
      return new Promise((resolve, reject) => {
        getCPD(this.tokenId)
          .then((r) => {
            this.nftInfo = r;
            resolve(r);
          })
          .catch((e) => {
            return reject(e);
          });
      });
    },
    /** 查询是否已关注创作者 */
    checkIfFollow() {
      if (!this.userAccount) {
        return;
      }
      return new Promise((resolve, reject) => {
        isFollow(this.creator)
          .then((r) => {
            this.subscription = r;
            return resolve(r);
          })
          .catch((e) => {
            console.log(e);
            return reject(e);
          });
      });
    },
    /** 查询是否点赞和关注 */
    checkIfPraiseCollect() {
      if (!this.userAccount) {
        return;
      }
      isAlreadyPraiseCollect(this.tokenId)
        .then((arr) => {
          this.isPraise = arr[0];
          this.isCollect = arr[1];
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /** 点赞NFT */
    handlePraise() {
      const executeProcess = () => {
        this.$store.dispatch("CheckLogin", true).then((c) => {
          if (!c) {
            return;
          }
          var loadingInstance = this.$loading({
            background: "rgba(0, 0, 0, 0.8)",
          });
          nftPraise(this.tokenId)
            .then(() => {
              this.$toast.success(this.$t("news-detail.like_success"));
            })
            .catch((e) => {
              this.$toast.error(e && e.message ? e.message : e);
            })
            .finally(() => {
              loadingInstance.close();
              this.loadNftInfo();
              this.checkIfPraiseCollect();
            });
        });
      };
      if (this.$store.state.chain.balanceBnb < 0.01) {
        this.$bnbConfirm(this.$store.state.common.language, () => {
          executeProcess();
        });
        return;
      }
      executeProcess();
    },
    /** 收藏NFT */
    collectPraise() {
      const executeProcess = () => {
        this.$store.dispatch("CheckLogin", true).then((c) => {
          if (!c) {
            return;
          }
          var loadingInstance = this.$loading({
            background: "rgba(0, 0, 0, 0.8)",
          });
          nftCollect(this.tokenId)
            .then(() => {
              this.$toast.success(this.$t("news-detail.collect_success"));
            })
            .catch((e) => {
              this.$toast.error(e && e.message ? e.message : e);
            })
            .finally(() => {
              loadingInstance.close();
              this.loadNftInfo();
              this.checkIfPraiseCollect();
            });
        });
      };
      if (this.$store.state.chain.balanceBnb < 0.01) {
        this.$bnbConfirm(this.$store.state.common.language, () => {
          executeProcess();
        });
        return;
      }
      executeProcess();
    },
  },
};
</script>

<style lang="scss">
.info-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 55px;

  .author-container {
    display: flex;
    flex-direction: row;

    .author-info {
      margin-left: 13px;
      text-align: left;

      .author-name {
        cursor: pointer;
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #acbcc9;

        span {
          font-size: 16px;
          font-weight: bold;
        }
      }

      .author-desc {
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #6c7884;
        line-height: 16px;
        margin-top: 7px;
        -webkit-line-clamp: 2; // 设置两行文字溢出
        display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        overflow: hidden;
        padding-right: 30px;
      }
    }

    .subscription {
      margin-left: 14px;
      width: 118px;
      height: 40px;
      font-size: 12px;
      font-family: Arial;
      font-weight: bold;
      border-radius: 17px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      img {
        margin-right: 6px;
      }
    }
  }

  .news-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-left: 50px;

    .news-info-item {
      min-width: 50px;
      padding: 0px 10px;
      height: 50px;
      border-radius: 8px;
      margin-left: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center; /* 水平居中 */
      align-items: center; /* 垂直居中 */

      .news-info-item-label {
        display: flex;
        flex-direction: row;
        font-size: 16px;
        font-family: Arial;
        font-weight: 400;
        color: #ffffff;
        justify-content: center; /* 水平居中 */
        align-items: center; /* 垂直居中 */

        img {
          width: 21px;
          height: 21px;
          cursor: pointer;
        }

        span {
          margin-left: 5px;
          display: flex;
          flex-wrap: nowrap;
        }

        // &:first-child {
        //   min-width: 128px;
        // }
      }

      .news-info-item-value {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-family: Arial;
        font-weight: 400;
        color: #99b1c4;
        margin-bottom: 11px;

        img {
          width: 8px;
          height: 6px;
        }

        span {
          margin-left: 3px;
        }
      }
    }
  }
}
</style>
