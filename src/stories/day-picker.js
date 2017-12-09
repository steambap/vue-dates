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
  }))
  .add("single month", () => ({
    render() {
      return <DayPicker numberOfMonths={1} />;
    }
  }))
  .add("3 months", () => ({
    render() {
      return <DayPicker numberOfMonths={3} />;
    }
  }))
  .add("vertical", () => ({
    render() {
      return <DayPicker orientation={VERTICAL_ORIENTATION} />;
    }
  }))
  .add("vertical scrollable with 12 months", () => ({
    render() {
      return (
        <div style={{ height: "568px", width: "320px" }}>
          <DayPicker numberOfMonths={12} orientation={VERTICAL_SCROLLABLE} />
        </div>
      );
    }
  }));
