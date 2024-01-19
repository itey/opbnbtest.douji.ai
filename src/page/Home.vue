<template>
  <div class="home-container">
    <div class="top-container">
      <div class="news-img-container">
        <el-image
          v-if="bannerNews.image"
          style="width: 934px; height: 528px; border-radius: 8px"
          :src="bannerNews.image"
          fit="cover"
        ></el-image>
        <div
          style="width: 934px; height: 528px; border-radius: 8px"
          v-else
        ></div>
        <div class="news-text" v-if="bannerNews.image">
          <div
            class="title"
            @click="
              $router.push({
                path: '/news-detail',
                query: { tokenId: bannerNews.token_id },
              })
            "
          >
            {{ bannerNews.title }}
          </div>
          <div class="bottom">
            <div class="text-sub-color">
              by
              <span
                @click="
                  $router.push({
                    path: '/creator',
                    query: { address: bannerNews.owner_address },
                  })
                "
                class="text-primary-color"
                v-if="bannerNews.nickname"
                >{{ bannerNews.nickname }}</span
              >
              <span
                @click="
                  $router.push({
                    path: '/creator',
                    query: { address: bannerNews.owner_address },
                  })
                "
                class="text-primary-color"
                v-else
                >{{ bannerNews.owner_address | omitAddress }}</span
              >
            </div>
            <div class="text-sub-color">
              {{ bannerNews.create_time | localTimeFormat }}
            </div>
          </div>
        </div>
      </div>
      <div class="news-tab-container">
        <el-tabs
          v-model="activeName"
          :stretch="true"
          @tab-click="newsTabChange"
        >
          <el-tab-pane :label="$t('home.hot_news')" name="news">
            <div class="news-list">
              <news-tab-item
                @onHover="onHover"
                :item="item"
                v-for="(item, index) in hotNewsList"
                :key="index"
              ></news-tab-item>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('home.featured')" name="feature">
            <div class="news-list">
              <news-tab-item
                @onHover="onHover"
                :item="item"
                v-for="(item, index) in selectedList"
                :key="index"
              ></news-tab-item>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="info-container">
      <div class="left">
        <div class="item">
          <div class="label">{{ $t("home.creator") }}</div>
          <div class="value text-color">
            <Roller
              defaultChar="0"
              :isNumberFormat="true"
              :text="String(statistics.creater_count)"
            />
          </div>
        </div>
        <div class="item theme-background-color">
          <div class="label">{{ $t("home.user") }}</div>
          <div class="value text-color">
            <Roller
              defaultChar="0"
              :isNumberFormat="true"
              :text="String(statistics.user_count)"
            />
          </div>
        </div>
        <div class="item theme-background-color">
          <div class="label">{{ $t("home.navigation_items") }}</div>
          <div class="value text-color">
            <Roller
              defaultChar="0"
              :isNumberFormat="true"
              :text="String(statistics.nft_count)"
            />
          </div>
        </div>
      </div>
      <div class="nft-info-container theme-background-color">
        <div class="nft-column">
          <div class="title">{{ $t("home.all_nft") }}</div>
          <div class="value-container">
            <span class="value text-color">
              <Roller
                defaultChar="0"
                :isNumberFormat="true"
                :text="String(statistics.all_currentsupply)"
              />
            </span>
            <template v-if="statistics.all_currentsupply_rate != '-'">
              <img
                v-if="statistics.all_currentsupply_rate > 0"
                src="@/assets/images/home/up.png"
                style="width: 8px; height: 6px"
              />
              <img
                v-if="statistics.all_currentsupply_rate < 0"
                src="@/assets/images/home/down.png"
                style="width: 8px; height: 6px"
              />
            </template>

            <span class="rate text-color">{{
              statistics.all_currentsupply_rate | rate2Percent
            }}</span>
          </div>
          <div class="attr-container">
            <div class="attr-item">
              <div class="label">{{ $t("home.market_cap") }}</div>
              <div>
                <span class="value text-color"
                  >${{
                    statistics.market_cap | decimalPlace2 | toLocalString
                  }}</span
                >
                <template v-if="statistics.market_cap_rate != '-'">
                  <img
                    v-if="statistics.market_cap_rate > 0"
                    src="@/assets/images/home/up.png"
                    style="width: 8px; height: 6px"
                  />
                  <img
                    v-if="statistics.market_cap_rate < 0"
                    src="@/assets/images/home/down.png"
                    style="width: 8px; height: 6px"
                  />
                </template>
                <span class="rate text-color">{{
                  statistics.market_cap_rate | rate2Percent
                }}</span>
              </div>
            </div>
            <div class="attr-item">
              <div class="label">{{ $t("home.nft_volume") }}</div>
              <div>
                <span class="value text-color"
                  >${{
                    statistics.nft_volume | decimalPlace2 | toLocalString
                  }}</span
                >
                <template v-if="statistics.nft_volume_rate != '-'">
                  <img
                    v-if="statistics.nft_volume_rate > 0"
                    src="@/assets/images/home/up.png"
                    style="width: 8px; height: 6px"
                  />
                  <img
                    v-if="statistics.nft_volume_rate < 0"
                    src="@/assets/images/home/down.png"
                    style="width: 8px; height: 6px"
                  />
                </template>
                <span class="rate text-color">{{
                  statistics.nft_volume_rate | rate2Percent
                }}</span>
              </div>
            </div>
            <div class="attr-item">
              <div class="label">{{ $t("home.transfers") }}</div>
              <div>
                <span class="value text-color">{{
                  statistics.transfers | toLocalString
                }}</span>
                <template v-if="statistics.transfers_rate != '-'">
                  <img
                    v-if="statistics.transfers_rate > 0"
                    src="@/assets/images/home/up.png"
                    style="width: 8px; height: 6px"
                  />
                  <img
                    v-if="statistics.transfers_rate < 0"
                    src="@/assets/images/home/down.png"
                    style="width: 8px; height: 6px"
                  />
                </template>
                <span class="rate text-color">{{
                  statistics.transfers_rate | rate2Percent
                }}</span>
              </div>
            </div>
            <div class="attr-item">
              <div class="label">
                {{ $t("home.weekly_active_users") }}
              </div>
              <div>
                <span class="value text-color">{{
                  statistics.weekly_active_users | toLocalString
                }}</span>
                <template
                  v-if="statistics.weekly_active_users_rate_rate != '-'"
                >
                  <img
                    v-if="statistics.weekly_active_users_rate_rate > 0"
                    src="@/assets/images/home/up.png"
                    style="width: 8px; height: 6px"
                  />
                  <img
                    v-if="statistics.weekly_active_users_rate_rate < 0"
                    src="@/assets/images/home/down.png"
                    style="width: 8px; height: 6px"
                  />
                </template>
                <span class="rate text-color">{{
                  statistics.weekly_active_users_rate_rate | rate2Percent
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="nft-column">
          <div class="title">{{ $t("home.mbd_price") }}</div>
          <div class="value-container">
            <span
              class="value text-color"
              v-if="statistics.mbd_price != undefined"
            >
              <Roller
                defaultChar="0"
                :text="'$' + String(statistics.mbd_price)"
              />
            </span>
            <template v-if="statistics.mbd_price_rate != '-'">
              <img
                v-if="statistics.mbd_price_rate > 0"
                src="@/assets/images/home/up.png"
                style="width: 8px; height: 6px"
              />
              <img
                v-if="statistics.mbd_price_rate < 0"
                src="@/assets/images/home/down.png"
                style="width: 8px; height: 6px"
              />
            </template>
            <span class="rate text-color">{{
              statistics.mbd_price_rate | rate2Percent
            }}</span>
          </div>
          <div class="attr-container">
            <div class="attr-item">
              <div class="label">
                {{ $t("home.mbd_circulation") }}
              </div>
              <div>
                <span class="value text-color">{{
                  statistics.mbd_circulation | decimalPlace2 | toLocalString
                }}</span>
                <template v-if="statistics.mbd_circulation_rate != '-'">
                  <img
                    v-if="statistics.mbd_circulation_rate > 0"
                    src="@/assets/images/home/up.png"
                    style="width: 8px; height: 6px"
                  />
                  <img
                    v-if="statistics.mbd_circulation_rate < 0"
                    src="@/assets/images/home/down.png"
                    style="width: 8px; height: 6px"
                  />
                </template>
                <span class="rate text-color">{{
                  statistics.mbd_circulation_rate | rate2Percent
                }}</span>
              </div>
            </div>
            <div class="attr-item">
              <div class="label">
                {{ $t("home.24h_nft_volume") }}
              </div>
              <div>
                <span class="value text-color"
                  >${{
                    statistics.nft_volume_24h | decimalPlace2 | toLocalString
                  }}</span
                >
                <template v-if="statistics.nft_volume_24h_rate != '-'">
                  <img
                    v-if="statistics.nft_volume_24h_rate > 0"
                    src="@/assets/images/home/up.png"
                    style="width: 8px; height: 6px"
                  />
                  <img
                    v-if="statistics.nft_volume_24h_rate < 0"
                    src="@/assets/images/home/down.png"
                    style="width: 8px; height: 6px"
                  />
                </template>
                <span class="rate text-color">{{
                  statistics.nft_volume_24h_rate | rate2Percent
                }}</span>
              </div>
            </div>
            <div class="attr-item">
              <div class="label">{{ $t("home.24h_transfers") }}</div>
              <div>
                <span class="value text-color">{{
                  statistics.transfers_24h | toLocalString
                }}</span>
                <template v-if="statistics.transfers_24h_rate != '-'">
                  <img
                    v-if="statistics.transfers_24h_rate > 0"
                    src="@/assets/images/home/up.png"
                    style="width: 8px; height: 6px"
                  />
                  <img
                    v-if="statistics.transfers_24h_rate < 0"
                    src="@/assets/images/home/down.png"
                    style="width: 8px; height: 6px"
                  />
                </template>
                <span class="rate text-color">{{
                  statistics.transfers_24h_rate | rate2Percent
                }}</span>
              </div>
            </div>
            <div class="attr-item">
              <div class="label">{{ $t("home.24h_nfts") }}</div>
              <div>
                <span class="value text-color">{{
                  statistics.all_currentsupply_24h | toLocalString
                }}</span>
                <template v-if="statistics.all_currentsupply_24h_rate != '-'">
                  <img
                    v-if="statistics.all_currentsupply_24h_rate > 0"
                    src="@/assets/images/home/up.png"
                    style="width: 8px; height: 6px"
                  />
                  <img
                    v-if="statistics.all_currentsupply_24h_rate < 0"
                    src="@/assets/images/home/down.png"
                    style="width: 8px; height: 6px"
                  />
                </template>
                <span class="rate text-color">{{
                  statistics.all_currentsupply_24h_rate | rate2Percent
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="latest-news-container">
      <div class="title text-color">{{ $t("home.latest_news") }}</div>
      <div class="list-container">
        <NewsItem
          :item="item"
          class="item"
          v-for="(item, index) in latestNews"
          :key="index"
        />
      </div>
    </div>
    <div style="margin-top: 43px" v-if="advertiseList && advertiseList[0]">
      <img
        :src="advertiseList[0].img"
        @click="openAdvertise(advertiseList[0].url)"
        style="width: 1209px; height: 94px; cursor: pointer"
      />
    </div>
    <template v-if="false">
      <div class="news-list-container">
        <div class="news-item-container">
          <div class="top">
            <div class="title text-color">AI News</div>
            <div class="more">
              <span>{{ $t("home.read_more") }}</span>
              <img
                style="width: 12px; height: 12px"
                src="@/assets/images/home/more.png"
              />
            </div>
          </div>
          <div class="news-item-list-container">
            <news-item
              class="item"
              v-for="(item, index) in 4"
              :key="index"
            ></news-item>
          </div>
        </div>
        <div class="news-item-container">
          <div class="top">
            <div class="title text-color">Web3 News</div>
            <div class="more">
              <span>{{ $t("home.read_more") }}</span>
              <img
                style="width: 12px; height: 12px"
                src="@/assets/images/home/more.png"
              />
            </div>
          </div>
          <div class="news-item-list-container">
            <news-item
              class="item"
              v-for="(item, index) in 4"
              :key="index"
            ></news-item>
          </div>
        </div>
        <div class="news-item-container">
          <div class="top">
            <div class="title text-color">Crypto News</div>
            <div class="more">
              <span>{{ $t("home.read_more") }}</span>
              <img
                style="width: 12px; height: 12px"
                src="@/assets/images/home/more.png"
              />
            </div>
          </div>
          <div class="news-item-list-container">
            <news-item
              class="item"
              v-for="(item, index) in 4"
              :key="index"
            ></news-item>
          </div>
        </div>
        <div class="news-item-container">
          <div class="top">
            <div class="title text-color">Metaverse News</div>
            <div class="more">
              <span>{{ $t("home.read_more") }}</span>
              <img
                style="width: 12px; height: 12px"
                src="@/assets/images/home/more.png"
              />
            </div>
          </div>
          <div class="news-item-list-container">
            <news-item
              class="item"
              v-for="(item, index) in 4"
              :key="index"
            ></news-item>
          </div>
        </div>
      </div>
      <div style="margin-top: 48px">
        <img style="width: 653px; height: 71px" />
      </div>
    </template>

    <div class="nft-list-container" v-if="promptsList.length">
      <div class="top">
        <div class="title text-color">
          {{ $t("home.featured_prompts_nft") }}
        </div>
        <div
          class="more"
          @click="$router.push({ path: '/market', query: { type: 'Prompt' } })"
        >
          <span>{{ $t("home.read_more") }}</span>
          <img
            style="width: 12px; height: 12px"
            src="@/assets/images/home/more.png"
          />
        </div>
      </div>
      <div class="list-container">
        <ProductItem
          class="item"
          :item="item"
          v-for="(item, index) in promptsList"
          :key="index"
        />
      </div>
    </div>
    <div class="nft-list-container" v-if="digitalList.length">
      <div class="top">
        <div class="title text-color">
          {{ $t("home.featured_digital_arts_nft") }}
        </div>
        <div
          class="more"
          @click="
            $router.push({ path: '/market', query: { type: 'Digital Arts' } })
          "
        >
          <span>{{ $t("home.read_more") }}</span>
          <img
            style="width: 12px; height: 12px"
            src="@/assets/images/home/more.png"
          />
        </div>
      </div>
      <div class="list-container">
        <ProductItem
          class="item"
          :item="item"
          v-for="(item, index) in digitalList"
          :key="index"
        />
      </div>
    </div>
    <div style="margin-top: 43px" v-if="advertiseList && advertiseList[1]">
      <img
        :src="advertiseList[1].img"
        @click="openAdvertise(advertiseList[1].url)"
        style="width: 1209px; height: 94px; cursor: pointer"
      />
    </div>
    <div class="activity-container">
      <div class="top">{{ $t("home.activity") }}</div>
      <div class="title text-color">{{ $t("home.bjx_pre_sale") }}</div>
      <div class="text-sub-color" style="font-size: 20px">
        {{ $t("home.bjx_what_value") }}
      </div>
      <div
        class="activity-info theme-background-color"
        v-loading="bjx.buying"
        :element-loading-background="$store.state.common.theme | maskByTheme"
      >
        <img
          style="width: 224px; height: 224px; margin-top: 35px"
          src="@/assets/images/home/activity-info.png"
        />
        <div class="info">
          <div style="margin-left: 177px">
            <div class="title">BJXStar NFT</div>
            <div class="label">BJXStar NFT</div>
            <div class="value text-color">
              {{ (bjxInfoJson.currentSupply - 500000000) | toLocalString }} /
              500,000,000 Sold
            </div>
            <div class="label">{{ $t("home.price") }}</div>
            <div class="type-container">
              <div
                @click="bjx.priceType = '0'"
                class="item text-color theme-background-color"
                :class="{ light: bjx.priceType == '0' }"
              >
                <div>{{ bjx.usdtPrice }} USDT</div>
              </div>
              <div
                @click="bjx.priceType = '1'"
                class="item text-color theme-background-color"
                :class="{ light: bjx.priceType == '1' }"
              >
                <div>{{ bjx.bnbPrice }} BNB</div>
              </div>
              <div
                @click="bjx.priceType = '2'"
                class="item text-color theme-background-color"
                :class="{ light: bjx.priceType == '2' }"
              >
                <div>{{ bjx.mbdPrice }} MBD</div>
              </div>
            </div>
            <div class="label">{{ $t("home.buy_quantity") }}</div>
            <el-form ref="bjxForm" :rules="rules" :model="bjx">
              <el-form-item prop="count">
                <el-input
                  v-model="bjx.count"
                  class="input text-color"
                  placeholder
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="text-sub-color tip">
            {{ $t("home.after_early_bird") }}
            <span class="text-color">15 USDT</span>
          </div>
          <div style="margin-left: 127px; margin-top: 11px">
            <el-button
              :disabled="bjx.buying"
              @click="handleBuyBjx()"
              class="common-btn2 square"
              style="width: 180px; height: 50px"
              >{{ $t("home.buy") }}</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="comparison-container">
      <div class="comparison-top">
        <div class="top">{{ $t("home.comparison") }}</div>
        <div class="title text-color">{{ $t("home.what_is_douji") }}</div>
        <div class="tip text-sub-color">{{ $t("home.comparison_tip") }}</div>
      </div>
      <comparison-table></comparison-table>
      <comparison-tab></comparison-tab>
    </div>
    <div class="video-container">
      <div class="top">{{ $t("home.video") }}</div>
      <div class="title text-color">{{ $t("home.how_use") }}</div>
      <div class="video-box">
        <LazyYoutubeVideo :src="videoSrc" />
      </div>
    </div>
  </div>
</template>

<script>
import NewsItem from "@/components/NewsItem";
import ProductItem from "@/components/ProductItem";
import ComparisonTab from "@/components/home/ComparisonTab";
import ComparisonTable from "@/components/home/ComparisonTable";
import NewsTabItem from "@/components/home/NewsTabItem";
import LazyYoutubeVideo from "vue-lazy-youtube-video";
import Roller from "vue-roller";
import { weiToEth } from "@/utils/common";
import {
  hotNewsList,
  nftListPage,
  selectedList,
  getAdList,
  getStatistics,
} from "@/utils/http";
import { erc20Approve, mintByBnb, mintByErc20 } from "@/utils/web3/bjx";
import {
  getBjxMbdPrice,
  getBjxTokenInfo,
  getBjxUsdtPrice,
} from "@/utils/web3/open";
export default {
  name: "home-view",
  components: {
    NewsTabItem,
    ProductItem,
    NewsItem,
    ComparisonTab,
    ComparisonTable,
    Roller,
    LazyYoutubeVideo,
  },
  computed: {
    /** 视频地址 */
    videoSrc() {
      return this.$store.state.common.language == "en"
        ? "https://www.youtube.com/embed/gJqaMDm53Js?si=IkivxNrZXib-OrYG"
        : "https://www.youtube.com/embed/gJqaMDm53Js?si=IkivxNrZXib-OrYG";
    },
  },
  data() {
    var reg = /^\+?[1-9][0-9]*$/;
    var validateNumber = (rule, value, callback) => {
      if (!reg.test(value)) {
        callback(new Error("Please enter a integer"));
      }
      if (value <= 0) {
        callback(new Error("Must be greater than 0"));
      }
      callback();
    };
    return {
      loading: {},
      activeName: "news",
      bjxTypeOption: {
        0: "USDT",
        1: "BNB",
        2: "MBD",
      },
      bjx: {
        buying: false,
        priceType: "0",
        bnbPrice: 0,
        usdtPrice: 0,
        mbdPrice: 0,
        count: undefined,
      },
      bjxInfoJson: {
        availableSupply: 0,
        bnbPrice: 0,
        currentSupply: 0,
        maxSupply: 0,
      },
      rules: {
        count: [
          {
            required: true,
            message: "Please enter the quantity to buy",
            trigger: "blur",
          },
          { validator: validateNumber, trigger: "blur" },
        ],
      },
      latestNews: [],
      promptsList: [],
      digitalList: [],
      selectedList: [],
      hotNewsList: [],
      bannerNews: {},
      advertiseList: [],
      statistics: {},
      timer: undefined,
    };
  },
  mounted() {
    this.getBjxData();
    this.newsInit();
    this.loadAdsList();
    this.getStatisticsInfo();
    this.timer = setInterval(() => {
      this.getStatisticsInfo();
    }, 30000);
  },
  destroyed() {
    this.timer && clearInterval(this.timer);
  },
  methods: {
    theFormat(num) {
      if (!num) {
        return num;
      }
      return num.toString().replace(/\d+/, function (n) {
        return n.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
      });
    },
    /** 查询大盘数据 */
    getStatisticsInfo() {
      this.loading["s"] = true;
      getStatistics()
        .then((r) => {
          if (r.code == 1) {
            this.statistics = r.data;
          }
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          this.loading["s"] = false;
        });
    },
    /** 打开广告 */
    openAdvertise(url) {
      window.open(url, "_blank");
    },
    /** 鼠标悬浮 */
    onHover(val) {
      this.bannerNews = val;
    },
    /** 点击切换 */
    newsTabChange(val) {
      if (val.index == "0") {
        this.bannerNews = this.hotNewsList[0];
      }
      if (val.index == "1") {
        this.bannerNews = this.selectedList[0];
      }
    },
    /** 点击购买BJX */
    async handleBuyBjx() {
      const c = await this.$store.dispatch("CheckLogin", true);
      if (!c) {
        return;
      }
      this.$refs["bjxForm"].validate((valid) => {
        if (!valid) return;
        this.bjx.buying = true;
        if (this.bjx.priceType == "1") {
          const payableAmountWei =
            Number(this.bjx.count) * Number(this.bjxInfoJson.bnbPrice);
          mintByBnb(this.bjx.count, payableAmountWei)
            .then((tx) => {
              console.log(tx);
              this.$toast.success(
                this.$t("home.bjx_buy_success", {
                  count: this.bjx.count,
                  amount: this.bjx.count * this.bjx.bnbPrice,
                  coin: this.bjxTypeOption[this.bjx.priceType],
                })
              );
            })
            .catch((e) => {
              this.$toast.error(e && e.message ? e.message : e);
            })
            .finally(() => {
              this.getBjxData();
              this.bjx.buying = false;
              this.bjx.count = null;
            });
        } else {
          var erc20Address = process.env.VUE_APP_USDT;
          var decimal = 18;
          var ercPrice = this.bjx.usdtPrice;
          if (this.bjx.priceType == "2") {
            erc20Address = process.env.VUE_APP_MBD;
            decimal = 8;
            ercPrice = this.bjx.mbdPrice;
          }
          if (!erc20Address) {
            this.bjx.buying = false;
            return;
          }
          erc20Approve(erc20Address, this.bjx.count * ercPrice, decimal)
            .then(() => {
              mintByErc20(erc20Address, this.bjx.count)
                .then((tx) => {
                  console.log(tx);
                  this.$toast.success(
                    this.$t("home.bjx_buy_success", {
                      count: this.bjx.count,
                      amount: this.bjx.count * ercPrice,
                      coin: this.bjxTypeOption[this.bjx.priceType],
                    })
                  );
                })
                .catch((e) => {
                  this.$toast.error(e && e.message ? e.message : e);
                })
                .finally(() => {
                  this.bjx.buying = false;
                  this.bjx.count = null;
                  this.getBjxData();
                });
            })
            .catch((e) => {
              this.$toast.error(e && e.message ? e.message : e);
              this.bjx.buying = false;
            });
        }
      });
    },
    /** 查询BJX的信息 */
    getBjxData() {
      getBjxTokenInfo()
        .then((res) => {
          this.bjxInfoJson = res;
          this.bjx.bnbPrice = weiToEth(res.bnbPrice);
        })
        .catch((e) => {
          console.log(e);
          this.$toast.warning("Network error");
        });
      getBjxUsdtPrice()
        .then((r) => {
          this.bjx.usdtPrice = r;
        })
        .catch((e) => {
          console.log(e);
        });
      getBjxMbdPrice()
        .then((r) => {
          this.bjx.mbdPrice = r;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /** 所有内容初始化 */
    newsInit() {
      const paramLatestNews = {
        page: 1,
        content_type: "Article",
      };
      const promptsNews = {
        page: 1,
        content_type: "Prompt",
      };
      const digitalArts = {
        page: 1,
        content_type: "Digital Arts",
      };
      this.getNewsList(paramLatestNews)
        .then((r) => {
          if (r.length) {
            this.latestNews = r.slice(0, 8);
          }
        })
        .catch((e) => {
          console.log(e);
        });
      this.getNewsList(promptsNews)
        .then((r) => {
          if (r.length) {
            this.promptsList = r.slice(0, 8);
          }
        })
        .catch((e) => {
          console.log(e);
        });
      this.getNewsList(digitalArts)
        .then((r) => {
          if (r.length) {
            this.digitalList = r.slice(0, 8);
          }
        })
        .catch((e) => {
          console.log(e);
        });
      this.$set(this.loading, "news", true);
      Promise.all([this.getSelectedList(), this.getHotNewsList()])
        .then(() => {
          this.bannerNews = this.hotNewsList[0];
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          this.$set(this.loading, "news", false);
        });
    },
    /** 查询News */
    getNewsList(param) {
      return new Promise((resolve, reject) => {
        nftListPage(param)
          .then((r) => {
            if (r.code == 1) {
              return resolve(r.data.list);
            } else {
              return reject(r.message);
            }
          })
          .catch((e) => {
            console.log(e);
            return reject(e);
          });
      });
    },
    /** 精选 */
    getSelectedList() {
      return new Promise((resolve, reject) => {
        selectedList().then((r) => {
          if (r.code == 1) {
            this.selectedList = r.data.list;
            return resolve(r.data.list);
          } else {
            return reject(r.message);
          }
        });
      });
    },
    /** 热门 */
    getHotNewsList() {
      return new Promise((resolve, reject) => {
        hotNewsList().then((r) => {
          if (r.code == 1) {
            this.hotNewsList = r.data.list;
            return resolve(r.data.list);
          } else {
            return reject(r.message);
          }
        });
      });
    },
    /** 查询广告列表 */
    loadAdsList() {
      getAdList(2).then((r) => {
        if (r.code == 1) {
          this.advertiseList = r.data.list;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.home-container {
  .el-table--fit {
    border-bottom: none;
  }
  .el-table td.el-table__cell,
  .el-table th.el-table__cell.is-leaf {
    border-bottom: none;
  }
  .top-container {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border: none !important;

    .news-img-container {
      position: relative;
      // border-radius: 8px;
      border: none !important;
      background: transparent;

      .el-image {
        background: transparent;
        .el-image__inner {
          background: transparent;
        }
      }

      .news-text {
        position: absolute;
        border: none !important;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        bottom: 3px;
        left: 0px;
        right: 0px;
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0),
          rgba(0, 0, 0, 1)
        );
        padding: 70px 34px 60px 34px;

        .title {
          font-size: 28px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #ffffff;
          line-height: 36px;
          text-align: left;
          cursor: pointer;
        }

        .title:hover {
          color: #00f9e5;
        }

        .bottom {
          margin-top: 11px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .text-sub-color {
            font-size: 20px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #b2b9b9;
            line-height: 12px;
          }

          .text-primary-color {
            cursor: pointer;
          }
          .text-primary-color:hover {
            color: #00f9e5;
          }
        }
      }
    }
    .news-tab-container {
      padding: 0 35px;
      border-radius: 8px;
      flex: 1;
      height: 526px;
      margin-left: 11px;
      border-width: 1px;

      .news-list {
        height: 478px;
        overflow: auto;
      }

      .news-list::-webkit-scrollbar {
        width: 0;
        background-color: transparent;
      }
    }
  }

  .info-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 70px;

    .left {
      height: 408px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .item {
        width: 412px;
        height: 74px;
        padding: 23px 32px 23px 32px;
        text-align: left;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .label {
          font-size: 16px;
          line-height: 13px;
          font-family: Arial;
          font-weight: bold;
        }

        .value {
          display: block;
          font-size: 34px;
          font-family: Source Han Sans CN;
          font-weight: 800;
        }
      }
    }

    .nft-info-container {
      height: 408px;
      margin-left: 28px;
      flex: 1;
      text-align: left;
      display: flex;
      flex-direction: row;
      border-radius: 8px;

      .nft-column {
        display: flex;
        flex-direction: column;
        width: 50%;
        padding: 35px 32px;

        .title {
          font-size: 16px;
          line-height: 12px;
          font-family: Arial;
          font-weight: bold;
        }

        .value-container {
          display: flex;
          flex-direction: row;
          align-items: baseline;
          margin-top: 30px;
          margin-bottom: 8px;

          .value {
            font-size: 34px;
            line-height: 34px;
            font-family: Source Han Sans CN;
            font-weight: 800;
            margin-right: 15px;
          }

          .rate {
            font-size: 12px;
            line-height: 12px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            margin-left: 4px;
          }
        }

        .attr-container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          margin-top: 36px;

          .attr-item {
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .label {
              font-size: 16px;
              font-family: Arial;
              font-weight: bold;
            }
            .value {
              font-size: 16px;
              font-family: Arial;
              font-weight: bold;
              margin-right: 13px;
            }

            .rate {
              font-size: 12px;
              font-family: Arial;
              font-weight: 400;
              margin-left: 4px;
            }
          }
        }
      }
    }
  }

  .latest-news-container {
    .title {
      font-size: 26px;
      font-family: Source Han Sans CN;
      font-weight: 800;
      text-align: left;
      margin: 90px 0 30px 0;
    }

    .list-container {
      width: 1440px;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;

      .item {
        width: 342px;
        margin: 0 22px 24px 0;

        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }

  .news-list-container {
    width: 1440px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 29px;
    margin-bottom: 39px;

    .news-item-container {
      width: 705px;
      background: #1a2027;
      border: 1px solid #2c3638;
      border-radius: 8px;
      margin-bottom: 28px;

      &:nth-child(2n) {
        margin-right: 0;
      }

      .top {
        margin: 33px 27px 23px 33px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .title {
          font-size: 22px;
          line-height: 22px;
          font-family: Source Han Sans CN;
          font-weight: 800;
        }

        .more {
          font-size: 14px;
          font-family: Arial;
          font-weight: bold;
          color: #00f9e5;
          line-height: 14px;
          display: flex;
          flex-direction: row;
          align-items: center;

          img {
            margin-left: 11px;
          }
        }
      }

      .news-item-list-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 26px;

        .item {
          width: 312px;

          &:nth-child(2n) {
            margin-right: 0;
          }
        }
      }
    }
  }

  .nft-list-container {
    .top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 26px;
        font-family: Source Han Sans CN;
        font-weight: 800;
        text-align: left;
        margin: 31px 0 40px 0;
      }

      .more {
        cursor: pointer;
        font-size: 16px;
        font-family: Arial;
        font-weight: bold;
        color: #00f9e5;
        line-height: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;

        img {
          margin-left: 11px;
        }
      }
    }

    .list-container {
      width: 1440px;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;

      .item {
        width: 342px;
        margin: 0 20px 24px 0;

        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }

  .activity-container {
    margin-top: 98px;

    .top {
      font-size: 26px;
      line-height: 26px;
      font-family: Source Han Sans CN;
      font-weight: 800;
      color: #00f9e5;
    }

    .title {
      font-size: 48px;
      line-height: 48px;
      font-family: Source Han Sans CN;
      font-weight: 800;
      margin-top: 23px;
      margin-bottom: 27px;
    }

    .tip {
      font-size: 20px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      line-height: 17px;
    }

    .activity-info {
      position: relative;
      border-radius: 6px;
      padding: 58px 0 69px 274px;
      margin-top: 60px;
      display: flex;
      flex-direction: row;
      justify-content: left;

      .info {
        text-align: left;

        .type-container {
          margin-top: 20px;
          display: flex;
          flex-direction: row;

          .item {
            width: 150px;
            height: 50px;
            // background: #0e161d;
            border: 1px solid #828888;
            border-radius: 8px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
            font-size: 18px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            // color: #fff;
            cursor: pointer;

            &.light {
              // background: #18252f;
              border: 1px solid #2fc9bd;

              font-family: Arial;
              color: #00f9e5;
            }
          }
        }

        .title {
          font-size: 24px;
          line-height: 24px;
          font-family: Arial;
          font-weight: bold;
          color: #8daed5;
        }

        .label {
          font-size: 14px;
          line-height: 14px;
          font-family: Arial;
          font-weight: bold;
          color: #809dbe;
          margin-top: 27px;

          &:first {
            margin-top: 60px;
          }
        }

        .value {
          font-size: 30px;
          line-height: 30px;
          font-family: Arial;
          font-weight: bold;
          // color: #ffffff;
          margin-top: 15px;
        }

        .input {
          width: 300px;
          height: 50px;
          font-size: 18px;
          line-height: 50px;
          font-family: Arial;
          font-weight: bold;
          // color: #ffffff;
          border-radius: 8px;
          margin-top: 16px;
        }

        .tip {
          margin-left: 13px;
          font-size: 12px;
          margin-top: 63px;
        }
      }
    }
  }

  .comparison-container {
    .comparison-top {
      .top {
        margin-top: 179px;
        font-size: 26px;
        font-family: Source Han Sans CN;
        font-weight: 800;
        color: #00f9e5;
      }

      .title {
        margin-top: 29px;
        font-size: 48px;
        font-family: Source Han Sans CN;
        font-weight: 800;
      }

      .tip {
        width: 1206px;
        margin: 21px 106px 58px 128px;
        font-size: 20px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #a1b5c6;
        line-height: 29px;
      }
    }
  }

  .video-container {
    .top {
      margin-top: 164px;
      font-size: 26px;
      font-family: Source Han Sans CN;
      font-weight: 800;
      color: #00f9e5;
    }

    .title {
      margin-top: 37px;
      font-size: 48px;
      font-family: Source Han Sans CN;
      font-weight: 800;
    }

    .video-box {
      margin-top: 57px;
      margin-bottom: 411px;
      width: 1440px;
      height: 674px;
    }
  }
}
</style>
