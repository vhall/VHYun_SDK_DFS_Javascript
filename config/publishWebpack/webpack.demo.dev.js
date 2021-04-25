const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const version = require("../../package.json").version;
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
function dist(filename) {
  return resolve(`../test/${filename}`)
}
module.exports = {
  entry: resolve("../vue/main.js"),
  output: {
    path: resolve("../test"),
    filename: `build.js`,
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devtool: 'source-map',
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: resolve('../vue'),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env", "stage-2"]
          }
        },
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)$/,
        use: 'url-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: 'url-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: resolve('../vue'),
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('../config/html-template/index.template.html'),
      filename: dist('index.html'),
      SDK: `./vhall-jssdk-form-${version}.js`
      // SDK: `http://localhost:8091/vhall-jssdk-form-${version}.js`
    }),
    new VueLoaderPlugin()
  ],
}