import vue from "rollup-plugin-vue";

export default {
  input: 'src/components/index.js',
  output: [{
    file: 'dist/index.js',
    format: 'cjs'
  }, {
    file: 'dist/index.es.js',
    format: 'es'
  }],
  plugins: [
    vue({
      compileTemplate: true,
      htmlMinifier: { collapseBooleanAttributes: false },
      css: 'dist/style.css'
    })
  ]
};
