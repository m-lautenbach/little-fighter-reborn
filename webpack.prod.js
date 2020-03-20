const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true,
      statsFilename: '../stats.json',
    }),
    new CompressionPlugin(),
  ],
})
