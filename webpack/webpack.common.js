// webpack/webpack.common.js
const path = require("path"),
      HtmlWebPackPlugin = require("html-webpack-plugin"),
      MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = env => {
   return {
      entry: "./src/js/index.js",
      output: {
         path: path.resolve(__dirname, "../docs"),
         filename: `js/[name].bundle.js`
      },
      resolve: {
         alias: {
            app: path.resolve(__dirname, "..")
         }
      },
      module: {
         rules: [
            {
               test: /\.html$/,
               use: {
                  loader: "html-loader",
                  options: { minimize: true }
               }
            },
            {
               test: /\.css$/,
               use: [MiniCssExtractPlugin.loader,
                     "css-loader"]
            },
            {
               test: /\.sass$/,
               use: [MiniCssExtractPlugin.loader,
                     "css-loader",
                     { 
                        loader: "postcss-loader",
                        options: {
                           plugins: () => [require("autoprefixer")]
                        }
                     },
                     "sass-loader"]
            },
            {
               test: /\.(png|jpe?g|gif|svg)$/i,
               use: [
                  'url-loader?limit=4096&name=images/[name].[ext]'
               ]
            }
         ]
      },
      plugins: [
         new HtmlWebPackPlugin({
            template: "src/index.html",
            //filename: "index.html"   // Es el valor predeterminado
         }),
         new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "[id].css"
         })
      ]
   }
}
