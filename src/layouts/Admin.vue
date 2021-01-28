<template>
  <v-layout>
    <app-bar
      slot="app-bar"
      :header-menu="headerMenu"
      :profile-menu="profileMenu"
      dense
      @toggle="
        $vuetify.breakpoint.lgAndUp ? (mini = !mini) : (drawer = !drawer)
      "
    ></app-bar>
    <custom-sidebar
      slot="sidebar"
      :menu="sidebarMenu"
      v-model="drawer"
      :mini-variant="mini"
    ></custom-sidebar>
    <breadcrumbs slot="header"></breadcrumbs>
    <!-- <va-footer slot="footer" :menu="footerMenu">
      FireEye System made by
      <a
        href="https://ikmalsuzal.mytester.space"
        target="_blank"
        class="font-weight-bold"
      >
        Ikmal Suzali
      </a>
    </va-footer> -->
  </v-layout>
</template>

<script>
import nav from "../_nav";
import Breadcrumbs from "../components/Breadcrumbs";
import AppBar from "../components/AppBar";
import VLayout from "../components/VLayout";
import CustomSidebar from "../components/CustomSidebar";

export default {
  name: "App",
  components: {
    Breadcrumbs,
    AppBar,
    VLayout,
    CustomSidebar,
  },
  data() {
    return {
      drawer: null,
      mini: false,
      headerMenu: [],
      footerMenu: [
        // {
        //   href: "https://github.com/okami101/vuetify-admin",
        //   text: "Gi thub",
        // },
        // {
        //   href: "https://www.okami101.io/vuetify-admin",
        //   text: "Docs",
        // },
        // {
        //   href: "https://va-demo.okami101.io",
        //   text: "Demo",
        // },
        // {
        //   href: "https://adr1enbe4udou1n.mit-license.org",
        //   text: "License",
        // },
      ],
      profileMenu: [
        { icon: "mdi-account", text: "Profile", link: "/admin/profile" },
      ],
      sidebarMenu: nav(this.$i18n, this.$admin),
    };
  },
};
</script>
