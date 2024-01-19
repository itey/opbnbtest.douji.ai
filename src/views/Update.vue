<template>
  <div class="create-container">
    <template v-if="loadComplete">
      <create-step1
        v-if="step == 1"
        :edit="true"
        :metadata="metadata"
        @handleUpdate="handleUpdate1"
        @backClick="backClick"
      ></create-step1>
      <create-step2
        v-if="step == 2"
        :edit="true"
        :metadata="metadata"
        @handleUpdate="handleUpdate2"
        @backClick="backClick"
      ></create-step2>
      <UpdateSuccess
        :tokenId="tokenId"
        ref="successDialog"
        :tx="updateTxJson"
      />
    </template>
  </div>
</template>

<script>
import CreateStep1 from "@/components/create/CreateStep1";
import CreateStep2 from "@/components/create/CreateStep2";
import UpdateSuccess from "@/components/create/UpdateSuccessDialog";
import { weiToMbd } from "@/utils/common";
import { loadFromUrl, unlockContent, uploadJson } from "@/utils/http";
import { startSetTokenPrice, startSetTokenURI } from "@/utils/web3/nft";
import { getTokenOwner, tokenURI, tokensData } from "@/utils/web3/open";
export default {
  name: "update-view",
  components: {
    CreateStep1,
    CreateStep2,
    UpdateSuccess,
  },
  computed: {
    voteOverTime() {
      if (!this.tokenSupplyInfo.isVoting) {
        return true;
      }
      return (
        Number(this.tokenSupplyInfo.vote.startTime) +
          Number(this.voteKeepTime) <
        new Date().getTime() / 1000
      );
    },
  },
  data() {
    return {
      voteKeepTime: process.env.VUE_APP_VOTE_TIME,
      loadComplete: false,
      metadata: {},
      ipfsData: {},
      step: 0,
      tokenId: undefined,
      tokenSupplyInfo: {},
      tokenMetaUrl: undefined,
      tokenOwner: undefined,
      updateTxJson: {},
    };
  },
  mounted() {
    this.tokenId = this.$route.query.tokenId;
    this.step = this.$route.query.step;
    var loadingInstance = this.$loading({
      background: "rgba(0, 0, 0, 0.8)",
    });
    setTimeout(() => {
      Promise.all([this.getOwner(), this.loadSupplyInfo(), this.loadMetadata()])
        .then(() => {
          if (this.tokenSupplyInfo.isVoting && !this.voteOverTime) {
            this.$toast.warning(this.$t("create.nft_voting"));
            this.$router.back();
            return;
          }
          this.metadata.maxSupply = this.tokenSupplyInfo.maxSupply;
          this.metadata.initialQuantity = this.tokenSupplyInfo.currentSupply;
          this.metadata.availableSupply = this.tokenSupplyInfo.availableSupply;
          this.metadata.initialPrice = weiToMbd(
            this.tokenSupplyInfo.price.price
          );
          this.loadComplete = true;
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          loadingInstance.close();
        });
    }, 4000);
  },
  methods: {
    /** 页面后退 */
    backClick() {
      this.$router.back();
    },
    /** 获取token拥有者 */
    getOwner() {
      return new Promise((resolve, reject) => {
        if (!this.tokenId) {
          return reject();
        }
        getTokenOwner(this.tokenId)
          .then((owner) => {
            this.tokenOwner = owner;
            return resolve();
          })
          .catch(() => {
            return reject();
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
            return resolve();
          })
          .catch(() => {
            return reject();
          });
      });
    },
    /** 加载元数据 */
    loadMetadata() {
      return new Promise((resolve, reject) => {
        if (!this.tokenId) {
          return reject();
        }
        tokenURI(this.tokenId)
          .then((uri) => {
            this.tokenMetaUrl = uri;
            loadFromUrl(this.tokenMetaUrl).then((r) => {
              if (r.status !== 200) {
                return reject(r.statusText);
              }
              this.metadata = r.data;
              if (this.metadata.contentUrl && this.step == 2) {
                return Promise.all([
                  this.loadOpenContent(this.metadata.contentUrl),
                  this.loadProtectedContent(this.metadata.protected),
                ])
                  .then(([openContent, protectedContent]) => {
                    this.metadata.openContent = openContent;
                    this.metadata.protectedContent = protectedContent;
                    return resolve();
                  })
                  .catch((e) => {
                    return reject(e);
                  });
              }
              return resolve();
            });
          })
          .catch(() => {
            return reject();
          });
      });
    },
    /** 加载公开数据 */
    loadOpenContent(url) {
      return new Promise((resolve, reject) => {
        loadFromUrl(url).then((res) => {
          if (res.status !== 200) {
            return reject(res.statusText);
          }
          resolve(res.data);
        });
      });
    },
    /** 加载私有数据 */
    loadProtectedContent(data) {
      return new Promise((resolve, reject) => {
        if (!data) {
          return resolve("");
        }
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
    /** 更新1 */
    handleUpdate1(form) {
      const initialPriceUpdate = form.initialPrice;
      const availableSupplyUpdate = form.availableSupply;

      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      startSetTokenPrice(
        this.tokenId,
        initialPriceUpdate,
        availableSupplyUpdate
      )
        .then((tx) => {
          console.log(tx);
          this.updateTxJson = tx;
          this.$refs["successDialog"].showDialog();
        })
        .catch((e) => {
          this.$toast.warning(e);
        })
        .finally(() => {
          loadingInstance.close();
        });
    },
    /** 更新2 */
    handleUpdate2(form) {
      const metaJson = this.makeURI(form);

      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      uploadJson(metaJson)
        .then((r) => {
          if (r.code == 1) {
            const metaUrl = r.data.url;
            startSetTokenURI(this.tokenId, metaUrl)
              .then((tx) => {
                console.log(tx);
                this.updateTxJson = tx;
                this.$refs["successDialog"].showDialog();
              })
              .catch((e) => {
                this.$toast.warning(e);
              })
              .finally(() => {
                loadingInstance.close();
              });
          } else {
            this.$toast.warning(r.message);
          }
        })
        .catch((e) => {
          this.$toast.warning(e);
        });
    },
    /** 生成URI */
    makeURI(form) {
      const metaJson = {
        title: form.title,
        name: form.title,
        image: form.image,
        maxSupply: form.maxSupply,
        description: form.description,
        contentType: form.contentType,
        category: form.category,
        keyword: form.keyword,
        attributes: [
          {
            trait_type: "title",
            value: form.title,
          },
          {
            trait_type: "category",
            value: form.category,
          },
          {
            trait_type: "contentType",
            value: form.contentType,
          },
          {
            trait_type: "contentUrl",
            value: form.contentUrl,
          },
          {
            display_type: "date",
            trait_type: "Birthday",
            value: form.Birthday,
          },
          {
            display_type: "date",
            trait_type: "UpdateDay",
            value: new Date().getTime(),
          },
        ],
        contentUrl: form.contentUrl,
        protected: form.protected,
        UpdateDay: new Date().getTime(),
        Birthday: form.Birthday,
      };
      if (form.language) {
        metaJson.language = form.language;
      }
      if (form.prompt) {
        metaJson.prompt = form.prompt;
      }
      return metaJson;
      // return new Promise((resolve, reject) => {
      //   uploadJson(metaJson)
      //     .then((r) => {
      //       if (r.code == 1) {
      //         resolve(r.data.url)
      //       } else {
      //         reject(r.message)
      //       }
      //     })
      //     .catch((e) => {
      //       console.log(e)
      //       reject(e.message ? e.message : e)
      //     })
      // })
    },
  },
};
</script>
<style lang="scss" scoped>
.create-container {
  display: flex;
  flex-direction: column;

  .step-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 62px;

    .step {
      text-align: left;

      .step-title {
        font-size: 19px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #747c7c;
      }

      .step-sub {
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #747c7c;
        margin-top: 10px;
      }
    }

    .step-light {
      .step-title {
        font-size: 19px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #4cc9ce;
        background: linear-gradient(-16deg, #4195f6 0%, #00f9e5 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .step-sub {
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #50ced5;
      }
    }
  }
}
</style>
