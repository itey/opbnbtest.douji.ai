<template>
  <div class="create-step3">
    <div class="title text-color">{{ $t("create.step3_mint") }}</div>
    <div class="form-container">
      <div class="form-top">
        <div class="form-left">
          <div class="form-title text-color">{{ form.title }}</div>
          <img
            style="
              width: 939px;
              height: 532px;
              margin-top: 50px;
              border-radius: 8px;
            "
            :src="form.image"
          />
          <div class="form-desc">{{ form.description }}</div>
          <div class="form-label-sub" style="margin-top: 22px">
            <img
              style="width: 20px; height: 20px"
              src="@/assets/images/create/website.png"
            />
            <div class="form-label-sub-text">
              {{ $t("create.open_access") }}
            </div>
          </div>
          <div class="form-content text-color">
            <div class="md-reader" v-html="pubContent"></div>
          </div>
          <div class="form-label-sub" v-if="privateContent">
            <img
              style="width: 20px; height: 20px"
              src="@/assets/images/create/protect.png"
            />
            <div class="form-label-sub-text">{{ $t("create.protected") }}</div>
          </div>
          <div class="form-content text-color" v-if="privateContent">
            <div class="md-reader" v-html="privateContent"></div>
          </div>
          <div class="form-tag">
            <div class="form-tag-label text-color">{{ $t("create.tag") }}:</div>
            <div
              class="form-tag-item text-color"
              v-for="(item, index) in form.keyword"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div class="form-right">
          <div class="form-attr-container">
            <div class="form-attr-title text-color">
              {{ $t("create.attributes") }}
            </div>
            <div class="form-attr-list">
              <div class="form-attr-item">
                <div class="form-attr-label">
                  {{ $t("create.content_type") }}
                </div>
                <div class="form-attr-value">{{ form.contentType }}</div>
              </div>
              <div class="form-attr-item">
                <div class="form-attr-label">{{ $t("create.category") }}</div>
                <div class="form-attr-value">{{ form.category }}</div>
              </div>
              <div class="form-attr-item" v-if="form.prompt">
                <div class="form-attr-label">{{ $t("create.platform") }}</div>
                <div class="form-attr-value">{{ form.prompt }}</div>
              </div>
              <div class="form-attr-item" v-if="form.language">
                <div class="form-attr-label">{{ $t("create.language") }}</div>
                <div class="form-attr-value">{{ form.language }}</div>
              </div>
              <div class="form-attr-item">
                <div class="form-attr-label">{{ $t("create.max_supply") }}</div>
                <div class="form-attr-value">
                  {{ form.maxSupply | toLocalString }}
                </div>
              </div>
              <div class="form-attr-item">
                <div class="form-attr-label">
                  {{ $t("create.avail_supply") }}
                </div>
                <div class="form-attr-value">
                  {{ form.maxSupply | toLocalString }}
                </div>
              </div>
              <div class="form-attr-item">
                <div class="form-attr-label">
                  {{ $t("create.initial_mint_qu") }}
                </div>
                <div class="form-attr-value">
                  {{ form.initialQuantity | toLocalString }}
                </div>
              </div>
            </div>
          </div>
          <div class="form-attr-container">
            <div class="form-attr-title text-color">
              {{ $t("create.primary_market") }}
            </div>
            <div class="form-attr-market">
              <div class="form-attr-available">
                {{ $t("create.available") }} :
                <span class="text-color">{{
                  form.maxSupply | toLocalString
                }}</span>
              </div>
              <div class="form-attr-mbd">
                <div class="mbd-value text-color">
                  {{ form.initialPrice }} MBD
                </div>
                <div class="form-attr-mbd-value">
                  ≈${{
                    (form.initialPrice * $store.state.chain.mbdPrice)
                      | decimalPlace8
                  }}
                </div>
              </div>
              <el-button disabled class="common-btn2 form-attr-mint">{{
                $t("create.mint")
              }}</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="form-add">
        <div class="btn-container" v-if="!txObject || !txObject.status">
          <el-button class="common-btn2" @click="backClick">{{
            $t("create.back")
          }}</el-button>
          <el-button class="common-btn2" @click="mintClick">{{
            $t("create.mint")
          }}</el-button>
        </div>
      </div>
    </div>
    <mint-success-dialog
      ref="successDialog"
      @close="closeDialog()"
      :tx="txObject"
    ></mint-success-dialog>
  </div>
</template>

<script>
import MintSuccessDialog from "@/components/create/MintSuccessDialog";
import cache from "@/utils/cache";
import { uploadJson } from "@/utils/http";
import { possessorMint } from "@/utils/web3/nft";
var md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});
export default {
  name: "create-step3",
  components: {
    MintSuccessDialog,
  },
  props: {
    metadata: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      setSaleShow: false,
      markdownPub: "",
      markdownPrivate: "",
      form: {},
      txObject: {},
    };
  },
  computed: {
    pubContent() {
      if (this.markdownPub) {
        return md.render(this.markdownPub);
      } else {
        return null;
      }
    },
    privateContent() {
      if (this.markdownPrivate) {
        return md.render(this.markdownPrivate);
      } else {
        return null;
      }
    },
  },
  mounted() {
    if (this.metadata) {
      this.form = this.metadata;
      this.markdownPub = this.form.openContent;
      this.markdownPrivate = this.form.protectedContent;
    }
  },
  methods: {
    backClick() {
      this.$emit("backClick", 2);
    },
    mintClick() {
      this.$store.dispatch("CheckLogin", true).then((c) => {
        if (c) {
          var loadingInstance = this.$loading({
            background: "rgba(0, 0, 0, 0.8)",
          });
          this.makeURI()
            .then((uri) => {
              possessorMint(
                uri,
                this.form.initialQuantity,
                this.form.initialPrice,
                this.form.maxSupply
              )
                .then((r) => {
                  loadingInstance.close();
                  this.txObject = r;
                  this.$refs["successDialog"].showDialog();
                  this.afterMinted();
                })
                .catch((e) => {
                  loadingInstance.close();
                  console.log(e);
                  this.$toast.error(this.$t("create.nft_mint_failed"));
                });
            })
            .catch((e) => {
              console.log(e);
              loadingInstance.close();
              this.$toast.error(this.$t("create.save_uri_failed"));
            });
        }
      });
    },
    updateClick() {
      this.$emit("updateClick");
    },
    /** 生成URI */
    makeURI() {
      const metaJson = {
        title: this.form.title,
        name: this.form.title,
        image: this.form.image,
        maxSupply: this.form.maxSupply,
        description: this.form.description,
        contentType: this.form.contentType,
        category: this.form.category,
        keyword: this.form.keyword,
        attributes: [
          {
            trait_type: "title",
            value: this.form.title,
          },
          {
            trait_type: "category",
            value: this.form.category,
          },
          {
            trait_type: "contentType",
            value: this.form.contentType,
          },
          {
            trait_type: "contentUrl",
            value: this.form.contentUrl,
          },
          {
            display_type: "date",
            trait_type: "Birthday",
            value: new Date().getTime(),
          },
          {
            display_type: "date",
            trait_type: "UpdateDay",
            value: new Date().getTime(),
          },
        ],
        contentUrl: this.form.contentUrl,
        protected: this.form.protected,
        Birthday: new Date().getTime(),
        UpdateDay: new Date().getTime(),
      };
      if (this.form.language) {
        metaJson.language = this.form.language;
      }
      if (this.form.prompt) {
        metaJson.prompt = this.form.prompt;
      }
      return new Promise((resolve, reject) => {
        uploadJson(metaJson)
          .then((r) => {
            if (r.code == 1) {
              return resolve(r.data.url);
            } else {
              return reject(r.message);
            }
          })
          .catch((e) => {
            console.log(e);
            return reject(e.message ? e.message : e);
          });
      });
    },
    /** 完成铸造后处理 */
    afterMinted() {
      cache.local.remove("NFT_MINT_CACHE");
    },
    /** 页面刷新 */
    closeDialog() {
      this.$emit("reload");
    },
  },
};
</script>

<style lang="scss" scoped>
.create-step3 {
  .title {
    margin-top: 89px;
    margin-bottom: 16px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    text-align: left;
  }

  .form-container {
    border-radius: 8px;
    padding: 45px 29px;

    .form-top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      text-align: left;

      .form-left {
        width: 949px;

        .form-title {
          font-size: 32px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          line-height: 48px;
        }

        .form-desc {
          padding-left: 17px;
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          line-height: 30px;
          border-left: 2px solid;
          border-image: linear-gradient(0deg, #50ced5, #46d1af) 1;
          margin-top: 44px;
        }

        .form-label-sub {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;

          .form-label-sub-text {
            font-size: 18px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: #00f9e5;
            margin-left: 12px;
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

        .form-tag {
          display: flex;
          flex-direction: row;
          align-items: center;

          .form-tag-label {
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: bold;
          }

          .form-tag-item {
            font-size: 12px;
            line-height: 24px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            height: 24px;
            border-radius: 5px;
            padding: 0 15px;
            min-width: 50px;
            margin-left: 12px;
            text-align: center;
          }
        }
      }

      .form-right {
        width: 385px;

        .form-attr-container {
          border-radius: 8px;
          margin-bottom: 30px;
          height: auto;

          .form-attr-title {
            height: 66px;
            line-height: 66px;
            padding: 0 23px;
            font-size: 18px;
            font-family: Arial;
            font-weight: bold;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .form-attr-action {
              font-size: 14px;
              font-family: Arial;
              font-weight: bold;
              color: #acbcc9;
              line-height: 66px;
              cursor: pointer;
            }
          }

          .form-attr-list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 24px 16px 4px 16px;

            .form-attr-item {
              width: 170px;
              padding: 20px 0;
              border-radius: 6px;
              margin-bottom: 18px;

              .form-attr-label {
                font-size: 14px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: #88a2b8;
                margin-left: 12px;
              }

              .form-attr-value {
                font-size: 16px;
                font-family: Source Han Sans CN;
                font-weight: bold;
                margin-top: 10px;
                margin-left: 12px;
              }
            }
          }

          .form-attr-market {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 24px 16px 30px 16px;
            text-align: center;

            .form-attr-available {
              border-radius: 5px;
              height: 34px;
              line-height: 34px;
              font-size: 14px;
              font-family: Source Han Sans CN;
              font-weight: bold;
              min-width: 170px;
              text-align: center;
              padding: 0 13px;
            }

            .form-attr-mbd {
              display: flex;
              flex-direction: row;
              align-items: baseline;
              margin-top: 28px;

              .form-attr-mbd-value {
                font-size: 14px;
                font-family: Arial;
                font-weight: 400;
              }
            }

            .form-attr-mint {
              margin: 24px 0 13px 0;
              border-radius: 18px;
              font-size: 18px;
              font-family: Arial;
              font-weight: bold;
              width: 100%;
            }

            .form-attr-tip {
              font-size: 14px;
              font-family: Arial;
              font-weight: 400;
              color: #88a2b8;
            }
          }

          .form-second-market {
            display: flex;
            flex-direction: row;
            padding: 24px 16px;

            .second-market-column {
              line-height: 24px;
              background: #252d36;
              font-size: 9px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: #acbcc9;
            }

            .second-market-header {
              height: 34px;
            }

            .second-market-td {
              font-size: 14px;
              font-family: Arial;
              font-weight: 400;
              line-height: 46px;
              border-bottom: 1px solid #252d36;
            }
          }

          .form-dao {
            padding: 23px 19px;

            .dao-title {
              padding: 0 6px;
              font-size: 16px;
              font-family: Arial;
              font-weight: bold;
            }

            .dao-sub {
              padding: 0 6px;
              font-size: 10px;
              font-family: Arial;
              font-weight: 400;
              color: #acbcc9;
              line-height: 14px;
              margin-top: 9px;
            }

            .dao-income-item {
              padding: 0 6px;
              height: 51px;
              line-height: 51px;
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
              padding: 0 10px;
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
                padding: 0 6px;
                height: 51px;
                line-height: 51px;
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

          .form-attr-setting {
            padding: 16px 13px;

            .form-attr-set {
              cursor: pointer;
              height: 26px;
              line-height: 26px;
              background: linear-gradient(-16deg, #848d98, #97a8a7);
              border-radius: 4px;
              font-size: 12px;
              font-family: Source Han Sans CN;
              font-weight: bold;
              color: #acbcc9;
              padding: 0 17px;

              &:first-child {
                margin-bottom: 10px;
              }

              &:hover {
                color: #00f9e5;
              }
            }
          }
        }
      }
    }

    .form-add {
      margin-top: 40px;

      .form-fee-count {
        font-size: 13px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #acbcc9;
        margin-top: 48px;
        margin-bottom: 22px;
      }

      .btn-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .common-btn2 {
          margin-right: 59px;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    .form-edit {
      margin-top: 178px;
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
