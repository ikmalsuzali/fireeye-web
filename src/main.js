import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import vuetify from "./plugins/vuetify";
import get from "get-value";

// import admin from "./plugins/admin";

import "./plugins/i18n";

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  next();
});

function getValue(resource, key) {
  return get(resource, key);
}

new Vue({
  router,
  store,
  i18n,
  vuetify,
  // admin,
  render: (h) => h(App),
}).$mount("#app");
