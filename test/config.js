const path = require("path");

module.exports = {
  moduleFileExtensions: ["js", "vue"],
  transform: {
    "^.+\\.js$": path.join(__dirname, "babel-transform.js"),
    ".*\\.(vue)$": require.resolve("vue-jest")
  },
  mapCoverage: true
};
