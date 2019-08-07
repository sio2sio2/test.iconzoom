// webpack/webpack.development.js
const merge = require('webpack-merge'),
      webpack = require("webpack");

module.exports = env => {
   const common = require('./webpack.common.js')(env);

   return merge(common, {
      mode: "development",
      devtool: false,
      devServer: {
         contentBase: false,
         open: "chromium"
      },
      plugins: [
         new webpack.SourceMapDevToolPlugin({
            filename: 'js/[name].js.map'
         })
      ]
   });
}
