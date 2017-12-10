import { configure } from "storybook-vue";

function loadStories() {
  require("../src/stories/day-picker");
  require("../src/stories/internal");
}

configure(loadStories, module);
