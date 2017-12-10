import vue from "rollup-plugin-vue";

export default {
  plugins: [
    vue({
      compileTemplate: true,
      htmlMinifier: { collapseBooleanAttributes: false }
    })
  ]
};
