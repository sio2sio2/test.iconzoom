const webpack = require("webpack"),
      path = require("path"),
      merge = require("webpack-merge"),
      HtmlWebPackPlugin = require("html-webpack-plugin"),
      MiniCssExtractPlugin = require("mini-css-extract-plugin"),
      name = require("./package.json").name;


// Configuración para Babel
function confBabel(env) {
   return {
      module: {
         rules: [
            {
               test: /\.js$/,
               exclude: /node_modules/,
               use: {
                  loader: "babel-loader",
                  options: {
                     presets: [["@babel/env", {
                        debug: env.debug,
                        corejs: 3,
                        useBuiltIns: "usage"
                     }]]
                  }
               }
            },
         ]
      }
   }
}


// Configuración para desarrollo
// (los mapeos de código fuente en fichero aparte)
function confDev(filename) {
   return {
      devtool: false,
      devServer: {
         contentBase: false,
         open: "chromium",
      },
      module: {
         rules: [
            {
               test: /\.(css|sass)$/,
               use: [MiniCssExtractPlugin.loader,
                     "css-loader?sourceMap=true",
                     { 
                        loader: "postcss-loader",
                        options: {
                           plugins: () => [require("autoprefixer")]
                        }
                     },
                     "sass-loader"]
            }
         ]
      },
      plugins: [
         new webpack.SourceMapDevToolPlugin({
            filename: `${filename}.map`
         })
      ]
   }
}


module.exports = env => {
   let mode;

   switch(env.output) {
      case "debug":
         mode = "development";
         break;
      default:
         mode = "production";
   }

   const filename = "js/[name].bundle.js";
   const common = {
      mode: mode,
      entry: {
         [name]: ["./src/js/index.js"]
      },
      output: {
         path: path.resolve(__dirname, "docs"),
         filename: filename
      },
      resolve: {
         alias: {
            app: __dirname
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
               test: /\.(css|sass)$/,
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
         new webpack.ProvidePlugin({
            L: "leaflet"
         }),
         new HtmlWebPackPlugin({
            template: "src/index.html",
         }),
         new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "[id].css"
         })
      ]
   }

   return merge.smart(
      common,
      mode === "production"?confBabel(env):confDev(filename),
   )
}
