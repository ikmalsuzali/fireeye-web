module.exports = {
  transpileDependencies: ["vuetify", "vuex-persist"],
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: "false",
    },
  },
  devServer: {
    disableHostCheck: true,
  },
};
