<template>
  <el-dialog
    custom-class="nft-stake-dialog"
    @open="pageLoad"
    :visible.sync="show"
    width="1440px"
  >
    <div class="nft-stake-header text-color" slot="title">
      {{ $t("news-detail.latest_title") }}
    </div>
    <div class="nft-stake-content">
      <div class="nft-stake-container">
        <div class="nft-stake-top">
          <div class="nft-stake-left">
            <div class="nft-stake-title text-color">{{ metadata.title }}</div>
            <img
              style="width: 939px; height: 532px; margin-top: 50px"
              :src="metadata.image"
            />
            <div class="nft-stake-desc text-color">
              {{ metadata.description }}
            </div>
            <div class="nft-stake-label-sub" style="margin-top: 16px">
              <img
                style="width: 20px; height: 20px"
                src="@/assets/images/create/website.png"
              />
              <div class="nft-stake-label-sub-text">
                {{ $t("news-detail.latest_open") }}
              </div>
            </div>
            <div class="form-content text-color">
              <div class="md-reader" v-html="metadata.openContent"></div>
            </div>
            <template v-if="metadata.protected">
              <div class="nft-stake-label-sub" style="margin-bottom: 10px">
                <img
                  style="width: 20px; height: 20px"
                  src="@/assets/images/create/protect.png"
                />
                <div class="nft-stake-label-sub-text">
                  {{ $t("news-detail.latest_pro") }}
                </div>
              </div>
              <div
                class="form-content text-color"
                v-if="metadata.protectedContent"
              >
                <div class="md-reader" v-html="metadata.protectedContent"></div>
              </div>
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  margin-top: 20px;
                "
                v-else
              >
                <div class="text-color" style="font-size: 12px">
                  {{ $t("news-detail.latest_least") }}
                  <span style="color: #00f9e5"
                    >{{ $t("news-detail.latest_id") }}: {{ tokenId }}</span
                  >) {{ $t("news-detail.latest_click") }}
                  “
                  <span style="color: #00f9e5">{{
                    $t("news-detail.latest_unlock")
                  }}</span
                  >”
                </div>
                <el-button
                  @click="handleUnlock()"
                  class="common-btn2"
                  style="
                    border-radius: 25px;
                    margin-top: 29px;
                    margin-bottom: 50px;
                  "
                  >{{ $t("news-detail.latest_unlock") }}</el-button
                >
              </div>
            </template>
            <div class="nft-stake-tag">
              <div class="nft-stake-tag-label text-color">
                {{ $t("news-detail.latest_tag") }}:
              </div>
              <div
                class="nft-stake-tag-item text-color"
                v-for="(item, index) in metadata.keyword"
                :key="index"
              >
                {{ item }}
              </div>
            </div>
          </div>
          <div class="nft-stake-right">
            <NftAttributes
              :metadata="metadata"
              :tokensInfo="tokenSupplyInfo"
              :editShow="true"
            />
            <NftPrimaryMarket
              @handleReload="pageLoad"
              :editShow="true"
              :metadata="metadata"
              :tokensInfo="tokenSupplyInfo"
              :userOwned="userOwned"
            />
            <NftDaoGovernance :tokenId="tokenId" :showRevision="true" />
          </div>
        </div>
        <div class="btn-container">
          <el-button class="common-btn2" @click="show = false">{{
            $t("news-detail.latest_close")
          }}</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import NftAttributes from "@/components/news/NftAttributes";
import NftDaoGovernance from "@/components/news/NftDaoGovernance";
import NftPrimaryMarket from "@/components/news/NftPrimaryMarket";
import { loadFromUrl, unlockContent } from "@/utils/http";
import { balanceOf } from "@/utils/web3/nft";
import { tokenURI, tokensData } from "@/utils/web3/open";
var md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});
export default {
  name: "nft-update-info",
  props: {
    tokenId: {
      type: String,
      default: "",
    },
    tokenOwner: {
      type: String,
      default: "",
    },
  },
  components: {
    NftDaoGovernance,
    NftAttributes,
    NftPrimaryMarket,
  },
  watch: {
    "$store.state.user.userId": function (val, od) {
      if (val !== od) {
        this.pageLoad();
      }
    },
  },
  data() {
    /**
      URL,//修改url
      DA0,//修改Dao
      P_A,//修改价格和供应量PRICE AVAILABLESUPPLY
      N S P//更新折扣 NFTSALESPROMOTION
    */
    return {
      tokenAddress: process.env.VUE_APP_NFT,
      userOwned: undefined,
      show: false,
      voteType: undefined,
      tokenMetaUrl: undefined,
      tokenSupplyInfo: {},
      metadata: {
        openContent: undefined,
        protectedContent: undefined,
      },
    };
  },
  methods: {
    showDialog() {
      this.show = true;
    },
    async pageLoad() {
      this.tokenMetaUrl = undefined;
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      try {
        await this.loadSupplyInfo();
        if (this.voteType == "0") {
          this.tokenMetaUrl = this.tokenSupplyInfo.vote.uri;
        }
        if (!this.tokenMetaUrl) {
          this.tokenMetaUrl = await tokenURI(this.tokenId);
        }
        const httpResponse = await loadFromUrl(this.tokenMetaUrl);
        if (httpResponse.status !== 200) {
          throw new Error("HTTP error " + httpResponse.status);
        }

        this.metadata = httpResponse.data;
        const openData = await this.loadOpenContent(this.metadata.contentUrl);
        this.metadata.openContent = this.$set(
          this.metadata,
          "openContent",
          md.render(openData ? md.render(openData) : null)
        );
        await this.getUserOwned();
      } catch (e) {
        this.$toast.error(e && e.message ? e.message : e);
        loadingInstance.close();
      } finally {
        loadingInstance.close();
      }
    },
    /** 点击解锁 */
    handleUnlock() {
      this.$store.dispatch("CheckLogin", true).then((c) => {
        if (!c) {
          this.show = false;
          return;
        }
        var loadingInstance = this.$loading({
          background: "rgba(0, 0, 0, 0.8)",
        });
        if (this.userOwned && this.userOwned > 0) {
          this.loadProtectedContent(this.metadata.protected)
            .then((protectedContent) => {
              this.$set(
                this.metadata,
                "protectedContent",
                md.render(protectedContent)
              );
              this.$toast.success(this.$t("news-detail.unlock_success"));
              loadingInstance.close();
            })
            .catch((e) => {
              console.log(e);
              this.$toast.error(this.$t("news-detail.unlock_failed"));
              loadingInstance.close();
            });
        } else {
          this.$toast.info(this.$t("news-detail.have_no_nft"));
          loadingInstance.close();
        }
      });
    },
    /** 加载公开数据 */
    loadOpenContent(url) {
      return new Promise((resolve, reject) => {
        loadFromUrl(url).then((res) => {
          if (res.status !== 200) {
            return reject(res.statusText);
          }
          return resolve(res.data);
        });
      });
    },
    /** 加载私有数据 */
    loadProtectedContent(data) {
      return new Promise((resolve, reject) => {
        unlockContent(data, this.tokenId).then((res) => {
          if (res.code != 1) {
            return reject(res.message);
          }
          const ipfsUrl = res.data.url;
          loadFromUrl(ipfsUrl).then((r) => {
            if (r.status !== 200) {
              return reject(r.statusText);
            }
            return resolve(r.data);
          });
        });
      });
    },
    /** 加载数据 */
    loadSupplyInfo() {
      return new Promise((resolve, reject) => {
        if (!this.tokenId) {
          return reject();
        }
        tokensData(this.tokenId)
          .then((res) => {
            this.tokenSupplyInfo = res;
            this.voteType = this.tokenSupplyInfo.vote.voteType;
            return resolve();
          })
          .catch(() => {
            return reject();
          });
      });
    },
    /** 获取用户拥有数量 */
    getUserOwned() {
      if (!this.tokenId || !this.$store.state.user.userId) {
        return;
      }
      return new Promise((resolve, reject) => {
        balanceOf(this.tokenId)
          .then((balance) => {
            this.userOwned = balance;
            return resolve();
          })
          .catch((e) => {
            return reject(e);
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.nft-stake-dialog {
  background: #1a2027;
  border: 1px solid #2c3638;
  border-radius: 16px 8px 8px 8px;

  .nft-stake-header {
    font-size: 24px;
    font-family: Arial;
    font-weight: bold;
  }

  .nft-stake-content {
    .nft-stake-title {
      margin-top: 58px;
      margin-bottom: 50px;
      font-size: 32px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      text-align: left;
    }

    .stake-header {
      text-align: left;
      font-size: 24px;
      font-family: Arial;
      font-weight: bold;
    }

    .nft-stake-container {
      background: #1a2027;
      border-radius: 6px;
      padding: 30px 20px;

      .nft-stake-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        text-align: left;

        .nft-stake-left {
          width: 939px;

          .nft-stake-title {
            font-size: 32px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            line-height: 48px;
          }

          .nft-stake-desc {
            padding-left: 12px;
            font-size: 12px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #ffffff;
            line-height: 22px;
            border-left: 2px solid;
            border-image: linear-gradient(0deg, #50ced5, #46d1af) 1;
            margin-top: 32px;
          }

          .nft-stake-label-sub {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            .nft-stake-label-sub-text {
              font-size: 18px;
              font-family: Source Han Sans CN;
              font-weight: bold;
              color: #00f9e5;
              margin-left: 8px;
            }
          }

          .form-content {
            font-size: 16px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            line-height: 30px;
            margin: 20px 0;

            img {
              max-width: 100%;
              height: auto;
            }
          }

          .nft-stake-tag {
            display: flex;
            flex-direction: row;
            align-items: center;

            .nft-stake-tag-label {
              font-size: 14px;
              font-family: Source Han Sans CN;
              font-weight: bold;
            }

            .nft-stake-tag-item {
              font-size: 12px;
              line-height: 24px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              height: 24px;
              background: #434d56;
              border-radius: 5px;
              padding: 0 15px;
              min-width: 50px;
              margin-left: 12px;
              text-align: center;
            }
          }
        }

        .nft-stake-right {
          width: 385px;

          .nft-stake-attr-container {
            border: 1px solid #363e3e;
            border-radius: 8px;
            margin-bottom: 30px;
            height: auto;

            .nft-stake-attr-title {
              height: 66px;
              line-height: 66px;
              padding: 0 17px;
              background: #37434d;
              font-size: 13px;
              font-family: Arial;
              font-weight: bold;
              color: #ffffff;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
            }

            .nft-stake-attr-list {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: space-between;
              padding: 24px 16px 5px 16px;

              .nft-stake-attr-item {
                width: 170px;
                padding: 19px 0;
                background: #1e252d;
                border-radius: 5px;
                margin-bottom: 18px;

                .nft-stake-attr-label {
                  font-size: 14px;
                  font-family: Source Han Sans CN;
                  font-weight: 400;
                  color: #88a2b8;
                  margin-left: 12px;
                }

                .nft-stake-attr-value {
                  font-size: 16px;
                  font-family: Source Han Sans CN;
                  font-weight: bold;
                  color: #ffffff;
                  margin-top: 14px;
                  margin-left: 12px;
                }
              }
            }

            .nft-stake-attr-market {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 24px 22px 30px 22px;
              text-align: center;

              .nft-stake-attr-available {
                background: #1e252d;
                border-radius: 8px;
                height: 34px;
                line-height: 34px;
                font-size: 14px;
                font-family: Source Han Sans CN;
                font-weight: bold;
                color: #acbcc9;
                min-width: 170px;
                text-align: center;
                padding: 0 24px;
                margin-top: 24px;
              }

              .nft-stake-attr-mbd {
                display: flex;
                flex-direction: row;
                align-items: baseline;
                margin-top: 28px;

                .nft-stake-attr-mbd-value {
                  font-size: 36px;
                  font-family: Arial;
                  font-weight: bold;
                }

                .nft-stake-attr-mbd-value {
                  font-size: 14px;
                  font-family: Arial;
                  font-weight: 400;
                  color: #88a2b8;
                }
              }

              .nft-stake-attr-mint {
                margin: 24px 0 13px 0;
                border-radius: 25px;
                font-size: 18px;
                font-family: Arial;
                font-weight: bold;
                color: #1a2027;
                width: 100%;
              }

              .nft-stake-attr-tip {
                font-size: 14px;
                font-family: Arial;
                font-weight: 400;
                color: #88a2b8;
              }
            }

            .nft-stake-dao {
              padding: 23px 16px;

              .dao-title {
                padding: 0 9px;
                font-size: 16px;
                font-family: Arial;
                font-weight: bold;
              }

              .dao-sub {
                padding: 0 9px;
                font-size: 14px;
                font-family: Arial;
                font-weight: 400;
                color: #acbcc9;
                line-height: 20px;
                margin-top: 13px;
              }

              .dao-income-item {
                padding: 0 9px;
                margin-top: 16px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;

                .dao-income-label {
                  font-size: 14px;
                  font-family: Arial;
                  font-weight: bold;
                  color: #9ab8db;
                }

                .dao-income-value {
                  font-size: 14px;
                  font-family: Arial;
                  font-weight: bold;
                }
              }

              .dao-member {
                padding: 0 14px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;

                &.dao-member-header {
                  margin-top: 19px;
                  height: 34px;
                  background: #1e252d;

                  .dao-member-left {
                    font-size: 12px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #acbcc9;
                    line-height: 34px;
                  }

                  .dao-member-right {
                    font-size: 12px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #acbcc9;
                    line-height: 34px;
                  }
                }

                &.dao-member-td {
                  height: 46px;

                  .dao-member-left {
                    font-size: 14px;
                    font-family: Arial;
                    font-weight: 400;
                    line-height: 46px;
                  }

                  .dao-member-right {
                    font-size: 14px;
                    font-family: Arial;
                    font-weight: 400;
                    color: #acbcc9;
                    line-height: 46px;
                  }
                }
              }

              .dividend-pool {
                .dividend-pool-item {
                  padding: 19px 7px;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: space-between;
                  border-bottom: 1px solid #1f262e;

                  &:last-child {
                    border: none;
                  }

                  .dividend-pool-label {
                    font-size: 14px;
                    font-family: Arial;
                    font-weight: bold;
                    color: #9ab8db;
                  }

                  .dividend-pool-value {
                    font-size: 14px;
                    font-family: Arial;
                    font-weight: bold;
                    color: #ffffff;
                  }
                }
              }
            }
          }
        }
      }

      .btn-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 135px;
        margin-bottom: 81px;
        .common-btn2 {
          width: 300px;
          height: 50px;
        }
      }
    }
  }
}
</style>
<style>
.md-reader img {
  max-width: 100%;
  max-height: auto;
}
.md-reader a {
  color: #7ea4ea;
  text-decoration: none;
}
</style>
