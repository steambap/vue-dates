import { configure } from "storybook-vue";
import "./style.css";

function loadStories() {
  require("../src/stories/date-range-controller");
  require("../src/stories/single-date-picker");
  require("../src/stories/single-date-controller");
  require("../src/stories/day-picker");
  require("../src/stories/internal");
}

configure(loadStories, module);
