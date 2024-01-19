import App from "@/App.vue";
import i18n from "@/i18n";
import router from "@/router";
import store from "@/store";
import Vue from "vue";
import { VuePlugin } from "vuera";

import "@/assets/theme/common.css";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/theme/theme-dark.scss";
import "@/assets/theme/theme-light.scss";
import "vue-lazy-youtube-video/dist/style.css";
import * as filters from "@/filters";
import ElementUI from "element-ui";
import _ from "lodash";
import VueCountdown from "@chenfengyuan/vue-countdown";
import VueClipBoard from "vue-clipboard2";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { openDialog } from "@/components/plugin/bnbConfirm";

Vue.prototype.$bnbConfirm = openDialog;

Vue.prototype._ = _;

Object.keys(filters).forEach((key) => Vue.filter(key, filters[key]));

Vue.component(VueCountdown.name, VueCountdown);
Vue.use(VuePlugin);
Vue.use(ElementUI);
Vue.use(VueClipBoard);
var toastrConfig = {
  transition: "my-custom-fade",
  maxToasts: 20,
  newestOnTop: true,
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false,
};
Vue.use(Toast, toastrConfig);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => {
    i18n.locale = store.state.common.language;
    return h(App);
  },
}).$mount("#app");
