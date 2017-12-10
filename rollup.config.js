import vue from "rollup-plugin-vue";

export default {
  input: 'src/components/day-picker.vue',
  output: {
    file: 'dist/day-picker.js',
    format: 'cjs'
  },
  plugins: [
    vue({
      compileTemplate: true,
      htmlMinifier: { collapseBooleanAttributes: false },
      css: 'dist/style.css'
    })
  ]
};
