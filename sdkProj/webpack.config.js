const path = require("path");
const webpack = require("webpack");

module.exports = ["source-map"].map(devtool => ({
  mode: "development", //source-map
  entry: {
    sdk: ["./src/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "user-recognition.js",
    library: "userRecognition", //让library 能够在各种使用环境中可用
    libraryTarget: ["umd", "var", "this", "window"] //让 library 和其他环境兼容,控制以多种形式暴露 library
  },

  //source-map
  devtool,
  optimization: {
    runtimeChunk: true
  },

  // 压缩混淆 js
//   plugins: [
//     new webpack.optimize.UglifyJsPlugin({
//       compress: {
//         warnings: false
//       },
//       sourceMap: true
//     })
//   ]
}));
