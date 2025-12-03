const { defineConfig } = require("@vue/cli-service");
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const isDev = process.env.NODE_ENV === "development";

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: isDev ? "/" : "/" + process.env.VUE_APP_BUILD_PATH,
  outputDir: process.env.VUE_APP_BUILD_PATH,
  productionSourceMap: isDev,
  devServer: {
    port: 8089,
    https: false,
    hot: false,
    open: true, // 启动后是否自动打开网页
    proxy: {
      [process.env.VUE_APP_WVP_URL]: {
        target: process.env.VUE_APP_SERVER_WVP_URL,
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_WVP_URL]: "",
        },
      },
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_SERVER_GATEWAY_URL,
        changeOrigin: true,
        // pathRewrite: {
        //   ['^' + process.env.VUE_APP_BASE_API]: ''
        // }
      },
    },
  },
  configureWebpack: {
    devtool: isDev ? "source-map" : "",
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = process.env.VUE_APP_TITLE || "默认标题";
      return args;
    });
  },
  css: {
    sourceMap: true,
  },
});
