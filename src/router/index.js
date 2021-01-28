import Vue from "vue";
import VueRouter from "vue-router";
import AuthLayout from "@/layouts/Auth";
import Login from "@/views/auth/Login";
import admin from "./admin";
import i18n from "../../helpers/i18n";
import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    redirect: "login",
    component: AuthLayout,
    children: [
      {
        path: "/login",
        name: "login",
        component: Login,
        meta: {
          title: i18n.t("routes.login"),
        },
      },
    ],
    // beforeEnter: (to, from, next) => {
    //   if (store.getters.getTokenId) {
    //     next({ path: "/admin/dashboard" });
    //   }
    // },
  },
  admin,
  {
    path: "/activate",
    name: "activate",
    component: () => import("@/views/activate/Activate"),
    meta: {
      title: "Activate",
    },
  },
  {
    path: "/activate/help",
    name: "activate.help",
    component: () => import("@/views/help/Help"),
    meta: {
      title: "Help",
    },
  },
  {
    path: "/password/reset/:token",
    name: "password.reset",
    component: () => import("@/views/auth/PasswordReset"),
    meta: {
      title: "Help",
    },
  },
];

export default new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
