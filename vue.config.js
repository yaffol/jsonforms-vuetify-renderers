const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  chainWebpack: (config) => {
    // remove typecheck
    config.plugins.delete("fork-ts-checker");

    config.plugin("monaco-editor").use(MonacoWebpackPlugin, [
      {
        // Languages are loaded on demand at runtime
        languages: ["json"],
      },
    ]);

    return config;
  },

  transpileDependencies: ["vuetify"],
};
