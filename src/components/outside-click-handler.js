export default {
  name: "outside-click",
  props: {
    onOutsideClick: {
      type: Function,
      default: function() {}
    }
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside, true);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside, true);
  },
  methods: {
    handleClickOutside(e) {
      const el = this.$refs.childNode;
      const isDescendantOfRoot = el && el.contains(e.target);
      if (!isDescendantOfRoot) {
        this.onOutsideClick(e);
      }
    }
  },
  render(h) {
    return h("div", { ref: "childNode" }, this.$slots.default);
  }
};
