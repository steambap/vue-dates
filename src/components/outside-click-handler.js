export default {
  name: "outside-click",
  props: {
    handleOutsideClick: {
      type: Function,
      default: function() {}
    }
  },
  mounted() {
    document.addEventListener("click", this.onClickOutside, true);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.onClickOutside, true);
  },
  methods: {
    onClickOutside(e) {
      const el = this.$refs.childNode;
      const isDescendantOfRoot = el && el.contains(e.target);
      if (!isDescendantOfRoot) {
        this.handleOutsideClick(e);
      }
    }
  },
  render(h) {
    return h("div", { ref: "childNode" }, this.$slots.default);
  }
};
