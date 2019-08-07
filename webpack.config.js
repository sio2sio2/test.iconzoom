// webpack.config.js
module.exports = env => {
   let mode;

   switch(env.output) {
      case "debug":
         mode = "development";
         break;
      default:
         mode = "production";
   }

   return require(`./webpack/webpack.${mode}.js`)(env);
}
