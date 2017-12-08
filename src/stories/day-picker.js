import { storiesOf } from "storybook-vue";
import DayPicker from "../components/day-picker.vue";

import { VERTICAL_ORIENTATION, VERTICAL_SCROLLABLE } from "../constants";

storiesOf("DayPicker", module)
  .add("default", () => ({
    render() {
      return <DayPicker />;
    }
  }))
  .add("with custom day size", () => ({
    render() {
      return <DayPicker daySize={50} />;
    }
  }));
