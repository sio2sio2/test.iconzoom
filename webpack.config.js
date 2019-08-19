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
function confDev(filename) {
   return {
      devtool: false,
      devServer: {
         contentBase: false,
         open: "chromium",
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

   const filename = "js/[name].js";
   const common = {
      mode: mode,
      entry: {
         [name]: "./src/index.js"
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
               use: ["html-loader?minimize=true"]
            },
            {
               test: /\.(css|sass)$/,
               use: [MiniCssExtractPlugin.loader,
                     `css-loader?sourceMap=${mode === "development"}`,
                     { 
                        loader: `postcss-loader?sourceMap=${mode === "development"}`,
                        options: {
                           plugins: () => [
                              require("autoprefixer"),
                              require("cssnano")
                           ]
                        }
                     },
                     `sass-loader?sourceMap=${mode === "development"}`]
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
