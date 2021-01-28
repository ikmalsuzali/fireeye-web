<template>
  <v-app-bar
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    :clipped-right="$vuetify.breakpoint.lgAndUp"
    app
    :dark="dark"
    :color="color"
    :dense="dense"
  >
    <v-app-bar-nav-icon @click.stop="$emit('toggle')" />
    <v-toolbar-title class="ml-0 pl-4" style="width: 200px">
      <span class="hidden-sm-and-down">{{ "FireEye System" }}</span>
    </v-toolbar-title>
    <v-row v-if="headerMenu.length && $vuetify.breakpoint.lgAndUp">
      <v-col
        v-for="(item, i) in headerMenu"
        :key="i"
        class="text-center mb-sm-0 mb-5"
        cols="auto"
      >
        <component
          :is="item.href ? 'a' : 'router-link'"
          :href="item.href"
          :to="item.link"
          class="px-3 white--text link"
          :target="item.href ? '_blank' : '_self'"
          v-text="item.text"
        ></component>
      </v-col>
    </v-row>
    <v-spacer />
    <div>
      <v-menu offset-y v-if="$store.state.auth.user">
        <template v-slot:activator="{ on }">
          <v-btn icon small class="" v-on="on">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-list nav dense>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle style="font-size: 14px; text-align: center">
                {{ $store.state.auth.user.name }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-for="(item, index) in profileMenu"
            :key="index"
            link
            :to="item.link"
            class="mt-2"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout()">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
/**
 * Default customizable admin VAppBar.
 * Contains main app title, header menus, direct resource creation links, global refresh action, profile menu.
 * Profile user dropdown will not appear on guest mode.
 */
export default {
  props: {
    /**
     * Replace default admin app title set on VuetifyAdmin constructor.
     */
    title: String,
    /**
     * Header links visible on left side.
     */
    headerMenu: {
      type: Array,
      default: () => [],
    },
    /**
     * Profile related links, visible inside authenticated dropdown menu.
     */
    profileMenu: {
      type: Array,
      default: () => [
        { icon: "mdi-account", text: "Profile", link: "/admin/profile" },
      ],
    },
    /**
     * Disable create menu.
     */
    disableCreate: Boolean,
    /**
     * Disable reload state button.
     */
    disableReload: Boolean,
    /**
     * Color for the VAppBar.
     */
    color: {
      type: String,
      default: "white",
    },
    /**
     * Reduce height of VAppBar
     */
    dense: Boolean,
    /**
     * Apply dark theme variant for VAppBar
     */
    dark: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    createResourceLinks() {
      return this.$admin.getResourceLinks(
        this.$admin.resources.map((r) => {
          return {
            name: r.name,
            action: "create",
          };
        })
      );
    },
    getName() {
      return this.$store.getters["auth/getName"];
    },
    getEmail() {
      return this.$store.getters["auth/getEmail"];
    },
  },
  methods: {
    refresh() {
      this.$store.dispatch("api/refresh", this.$route.meta.resource);
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.link {
  font-size: 0.825rem;
  font-weight: 500;
  text-decoration: none;
  text-transform: uppercase;
}
</style>
