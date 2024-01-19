<template>
  <div class="footer-container">
    <div style="width: 230px">
      <img
        style="width: 120px; height: 27px; cursor: pointer"
        src="@/assets/logo.png"
      />
      <div class="label1" style="margin: 19px 0 15px 0">
        {{ $t("footer.ai_ecology") }}
      </div>
      <div class="label2">Copyright @ 2023 ALL Rights Roserved.</div>
    </div>
    <div class="footer-column">
      <div class="title">{{ $t("footer.market") }}</div>
      <el-menu>
        <el-menu-item @click="goPath('/market')">{{
          $t("footer.explore")
        }}</el-menu-item>
        <el-menu-item @click="goPath('/create')">{{
          $t("footer.create")
        }}</el-menu-item>
        <el-menu-item @click="goPath('/news')">{{
          $t("footer.advertise")
        }}</el-menu-item>
        <el-menu-item
          @click="goPath({ path: '/market', query: { type: 'Prompt' } })"
          >{{ $t("footer.article") }}</el-menu-item
        >
        <el-menu-item
          @click="goPath({ path: '/market', query: { type: 'Digital Arts' } })"
          >{{ $t("footer.digital") }}</el-menu-item
        >
      </el-menu>
    </div>
    <div class="footer-column">
      <div class="title">{{ $t("footer.legal") }}</div>
      <el-menu>
        <el-menu-item
          @click="gotUrl('https://docs.douji.ai/legal/disclaimer')"
          >{{ $t("footer.disclaimer") }}</el-menu-item
        >
        <el-menu-item
          @click="gotUrl('https://docs.douji.ai/legal/terms-of-service')"
          >{{ $t("footer.terms") }}</el-menu-item
        >
        <el-menu-item
          @click="gotUrl('https://docs.douji.ai/legal/privacy-policy')"
          >{{ $t("footer.privacy") }}</el-menu-item
        >
        <el-menu-item
          @click="
            gotUrl('https://docs.douji.ai/legal/creator-editorial-policies')
          "
          >{{ $t("footer.creator") }}</el-menu-item
        >
        <el-menu-item @click="gotUrl('https://docs.douji.ai/')">{{
          $t("footer.white_paper")
        }}</el-menu-item>
      </el-menu>
    </div>
    <div class="footer-column">
      <div class="title">{{ $t("footer.about_us") }}</div>
      <el-menu>
        <el-menu-item
          @click="gotUrl('https://docs.douji.ai/getting-started/faq')"
          >{{ $t("footer.faq") }}</el-menu-item
        >
        <el-menu-item
          @click="gotUrl('https://github.com/douji-ai/DOUJI.AI_LOGO')"
          >{{ $t("footer.logo") }}</el-menu-item
        >
        <el-menu-item
          @click="gotUrl('https://docs.douji.ai/getting-started/contact')"
          >{{ $t("footer.contact") }}</el-menu-item
        >
        <el-menu-item @click="gotUrl('https://docs.douji.ai/changelog')">{{
          $t("footer.change")
        }}</el-menu-item>
        <el-menu-item @click="gotUrl('https://blog.douji.ai')">{{
          $t("footer.blog")
        }}</el-menu-item>
      </el-menu>
    </div>
    <div>
      <div>
        <div class="title">{{ $t("footer.follow_us") }}</div>
        <div class="follow-ico">
          <img
            @click="gotUrl('https://twitter.com/DOUJI_AI')"
            src="@/assets/images/twitter.png"
            alt="twitter"
          />
          <img
            @click="gotUrl('https://t.me/douji_ai')"
            src="@/assets/images/telegram.png"
            alt="telegram"
          />
          <img
            @click="
              gotUrl(
                'https://discord.com/channels/1175263081211908146/1175263081211908148'
              )
            "
            src="@/assets/images/discord.png"
            alt="discord"
          />
          <img
            @click="gotUrl('https://www.youtube.com/@AIGC-Web3-Creator')"
            src="@/assets/images/youtube.png"
            alt="youtube"
          />
          <img
            @click="gotUrl('https://github.com/douji-ai')"
            src="@/assets/images/github.png"
            alt="github"
          />
          <img
            @click="gotUrl('https://docs.douji.ai/')"
            src="@/assets/images/gitbook.png"
            alt="gitbook"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "nav-footer",
  components: {},

  methods: {
    /** 外部跳转 */
    gotUrl(url) {
      window.open(url, "_bank");
    },
    /** 内部跳转 */
    goPath(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss">
.footer-container {
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 57px 0 63px 0;
  position: relative;

  .title {
    font-size: 20px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #ffffff;
    line-height: 32px;
    margin-bottom: 10px;
    padding-left: 15px;
  }

  .label1 {
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #ffffff;
    line-height: 20px;
  }

  .label2 {
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
    line-height: 32px;
  }
}

.el-menu-item {
  height: auto;
  font-size: 16px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  text-align: left;
}

.footer-column .el-menu-item {
  height: 33px !important;
  line-height: 33px !important;
}

.follow-ico {
  padding-left: 15px;
  img {
    cursor: pointer;
    margin-right: 10px;
    height: 24px;
    width: 24px;
  }
}
</style>
