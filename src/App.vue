<template>
  <el-container id="app" :class="currentTheme">
    <el-header style="height: auto">
      <NavBar />
    </el-header>
    <!-- <creator v-if="$route.path == '/creator'"></creator> -->
    <el-container class="body-container">
      <el-main :class="$route.path == '/' ? 'color-bg' : ''">
        <CreatorHeader
          v-if="$route.path == '/creator'"
          :address="$route.query.address"
        />
        <div class="banner" v-else-if="globalAdvertise && globalAdvertise.img">
          <img
            :src="globalAdvertise.img"
            @click="openAdvertise(globalAdvertise.url)"
            style="width: 1209px; height: 94px; cursor: pointer"
          />
        </div>
        <div class="app-content">
          <router-view v-if="show" :key="$route.fullPath" />
        </div>
      </el-main>
      <el-footer style="height: auto; background: #1a2027; margin-top: 16px">
        <div class="app-content">
          <NavFooter />
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>
<script>
import NavBar from "@/components/NavBar.vue";
import NavFooter from "@/components/NavFooter.vue";
import CreatorHeader from "@/components/CreatorHead.vue";
import { getAdList } from "@/utils/http";
export default {
  components: {
    NavBar,
    NavFooter,
    CreatorHeader,
  },
  data() {
    return {
      show: true,
      globalAdvertise: undefined,
    };
  },
  computed: {
    /** 当前主题 */
    currentTheme() {
      if (this.$store.state.common.theme) {
        return "theme-" + this.$store.state.common.theme;
      } else {
        return "theme-dark";
      }
    },
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  created() {
    this.$store.dispatch("LoadMbdPrice");
    this.loadAdsList();
  },
  methods: {
    // 高阶组件定义刷新方法
    reload() {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    /** 查询广告 */
    loadAdsList() {
      getAdList(1).then((r) => {
        if (r.code == 1) {
          const list = r.data.list;
          if (list && list.length > 0) {
            this.globalAdvertise = list[0];
          }
        }
      });
    },
    /** 打开广告 */
    openAdvertise(url) {
      window.open(url, "_blank");
    },
  },
};
</script>
<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  .el-header {
    height: 77px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #1a2027;
    border-bottom: 1px solid #29383f;
    padding: 0 0;
  }

  .banner {
    margin-top: 16px;
    display: flex;
    justify-content: center;
  }

  // height: 100vh;
  .el-main {
    padding: 0 0;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .el-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .app-content {
    width: 1440px;
  }
}
</style>
