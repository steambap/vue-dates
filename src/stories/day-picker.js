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
  }))
  .add("vertical with custom day size", () => ({
    render() {
      return <DayPicker orientation={VERTICAL_ORIENTATION} daySize={50} />;
    }
  }))
  .add("vertical with custom height", () => ({
    render() {
      return (
        <DayPicker orientation={VERTICAL_ORIENTATION} verticalHeight={568} />
      );
    }
  }))
  .add("with custom details", () => ({
    render() {
      return (
        <DayPicker
          renderDay={day => (day.day() % 6 === 5 ? "😻" : day.format("D"))}
        />
      );
    }
  }))
  .add("vertical with fixed-width container", () => ({
    render() {
      return (
        <div style={{ width: "400px" }}>
          <DayPicker orientation={VERTICAL_ORIENTATION} />
        </div>
      );
    }
  }))
  .add("with custome week day format", () => ({
    render() {
      return <DayPicker weekDayFormat="ddd" />;
    }
  }))
  .add("with no animation", () => ({
    render() {
      return <DayPicker transitionDuration={0} />;
    }
  }))
  .add("noBorder", () => ({
    render() {
      return <DayPicker noBorder />;
    }
  }));
