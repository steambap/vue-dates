import { storiesOf } from "storybook-vue";
import moment from "moment";
import DateRangeController from "./date-range-controller-wrapper.vue";
import { isSameDay } from "../helpers";

import { VERTICAL_ORIENTATION, VERTICAL_SCROLLABLE } from "../constants";

const datesList = [
  moment(),
  moment().add(1, "days"),
  moment().add(3, "days"),
  moment().add(9, "days"),
  moment().add(10, "days"),
  moment().add(11, "days"),
  moment().add(12, "days"),
  moment().add(13, "days")
];

storiesOf("DateRangeController", module)
  .add("default", () => ({
    render() {
      return <DateRangeController />;
    }
  }))
  .add("non-english locale", () => ({
    render() {
      moment.locale("zh-cn");

      return <DateRangeController monthFormat="YYYY[年]MMMM" />;
    }
  }))
  .add("with minimum nights set", () => ({
    render() {
      return (
        <DateRangeController minimumNights={3} autoFocusEndDate />
      );
    }
  }))
  .add("with some highlighted dates", () => ({
    render() {
      return (
        <DateRangeController
          isDayHighlighted={day1 =>
            datesList.some(day2 => isSameDay(day1, day2))
          }
        />
      );
    }
  }))
  .add("blocks fridays", () => ({
    render() {
      return (
        <DateRangeController
          isDayBlocked={day => moment.weekdays(day.weekday()) === "Friday"}
        />
      );
    }
  }))
  .add("with info panel", () => ({
    render() {
      return (
        <DateRangeController>
          <div
            style={{
              padding: "10px 21px",
              borderTop: "1px solid #dce0e0",
              color: "#484848"
            }}
            slot="info-panel"
          >
            &#x2755; Some useful info here
          </div>
        </DateRangeController>
      );
    }
  }))
  .add("with no animation", () => ({
    render() {
      return <DateRangeController transitionDuration={0} />;
    }
  }));
