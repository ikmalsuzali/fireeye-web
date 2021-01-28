import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "../helpers/i18n";
import vuetify from "./plugins/vuetify";
import VueAxios from "vue-axios";
import axios from "axios";

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  next();
});

axios.defaults.baseURL = process.env.VUE_APP_API_BASEURL;
axios.defaults.headers.common["Authorization"] =
  "Bearer " + store.getters.getTokenId;

Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  i18n,
  vuetify,
  // admin,
  render: (h) => h(App),
}).$mount("#app");
