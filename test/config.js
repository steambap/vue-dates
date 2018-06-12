const path = require("path");

module.exports = {
  moduleFileExtensions: ["js", "vue"],
  transform: {
    "^.+\\.js$": require.resolve("babel-jest"),
    ".*\\.(vue)$": require.resolve("vue-jest")
  }
};
