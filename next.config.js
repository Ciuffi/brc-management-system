const withSass = require("@zeit/next-sass");
const production = process.env.NODE_ENV === "production";
module.exports = {
  ...withSass(),
  assetPrefix: production ? "/bms" : "",
  experimental: {
    basePath: production ? "/bms" : ""
  }
};
