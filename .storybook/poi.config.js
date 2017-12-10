module.exports = {
  entry: [".storybook/config.js", ".storybook/addons.js"],

  dist: ".storybook/dist",

  presets: [require("poi-preset-storybook")()],
  port: 5000,
  homepage: "http://weilinshi.org/vue-dates/"
};
