import Vue from "vue";
import AdminLayout from "@/layouts/Admin";
import Dashboard from "@/views/Dashboard";
import Error from "@/views/Error";
import i18n from "@/i18n";
import store from "../store/index";

/**
 * Error component
 */
Vue.component("Error", Error);

export default {
  path: "/admin",
  redirect: "/admin/dashboard",
  component: AdminLayout,
  meta: {
    title: i18n.t("routes.home"),
  },
  children: [
    {
      path: "/admin/profile",
      name: "profile",
      component: () => import("@/resources/profile/Detail"),
      meta: {
        title: i18n.t("routes.profile"),
      },
    },
    {
      path: "/admin/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: {
        title: i18n.t("routes.dashboard"),
      },
    },
    {
      path: "/admin/serial-no",
      name: "serial-no",
      component: () => import("@/resources/serial-nos/List"),
      meta: {
        title: "Serial No(s)",
      },
    },
    {
      path: "/admin/serial-no/:id",
      name: "serial-no.detail",
      component: () => import("@/resources/serial-nos/Detail"),
      meta: {
        title: "Serial No",
      },
      props: true,
    },
    {
      path: "/admin/customer",
      name: "customer",
      component: () => import("@/resources/customers/List"),
      meta: {
        title: "Customer",
      },
    },
    {
      path: "/admin/customer/:id",
      name: "customer",
      component: () => import("@/resources/customers/List"),
      meta: {
        title: "Customer",
      },
    },
    {
      path: "*",
      component: Error,
      meta: {
        title: i18n.t("routes.not_found"),
      },
    },
  ],
  beforeEnter: (to, from, next) => {
    if (store.getters.getTokenId) {
      next();
    } else {
      next({ path: "/login" });
    }
  },
};
