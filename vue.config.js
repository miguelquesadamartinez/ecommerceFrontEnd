/*module.exports = {
    publicPath: "./",
    outputDir: "dist",
    assetsDir: "assets",
    filenameHashing: false,
    productionSourceMap: false,
    configureWebpack: {
        output: {
          libraryTarget: "umd"
        }
    },
    configureWebpack: {
        cache: false
    }
  };
Le code en haut fonctionne avant modification nacer */
module.exports = {
  publicPath:
    process.env.NODE_ENV === "production"
      ? "https://noName-directe.gmg-applicatif.fr/"
      : "/", // ✅ Force l'URL absolue en HTTPS en prod
  outputDir: "dist",
  assetsDir: "assets",
  filenameHashing: false,
  productionSourceMap: false,
  devServer: {
    https: true, // ✅ Active HTTPS même en dev (évite les warnings)
  },
  configureWebpack: {
    output: {
      libraryTarget: "umd",
    },
    cache: false,
  },
};
