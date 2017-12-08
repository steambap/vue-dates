import { configure } from "storybook-vue";

function loadStories() {
  require("../src/stories/internal");
  require("../src/stories/day-picker");
}

configure(loadStories, module);
