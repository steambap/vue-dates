import { configure } from "storybook-vue";

function loadStories() {
  require("../src/stories/single-date-picker");
  require("../src/stories/single-date-controller");
  require("../src/stories/day-picker");
  require("../src/stories/internal");
}

configure(loadStories, module);
