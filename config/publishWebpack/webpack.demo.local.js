const path = require('path')
const merge = require('webpack-merge')
const dev = require('./webpack.demo.dev')
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = merge(dev, {
  devServer: {
    inline: true,
    hot: true,
    open: true,
    host: '0.0.0.0',
    port: 8089,
    compress: false
  }
})
