import { storiesOf } from "storybook-vue";
import moment from "moment";
import SingleDateController from "./single-date-control-wrapper";
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

storiesOf("SingleDateController", module)
  .add("default", () => ({
    render() {
      return <SingleDateController />;
    }
  }))
  .add("non-english locale", () => ({
    render() {
      moment.locale("zh-cn");

      return <SingleDateController monthFormat="YYYY[年]MMMM" />;
    }
  }))
  .add("with some highlighted dates", () => ({
    render() {
      return (
        <SingleDateController
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
        <SingleDateController
          isDayBlocked={day => moment.weekdays(day.weekday()) === "Friday"}
        />
      );
    }
  }))
  .add("with info panel", () => ({
    render() {
      return (
        <SingleDateController>
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
        </SingleDateController>
      );
    }
  }))
  .add("with no animation", () => ({
    render() {
      return <SingleDateController transitionDuration={0} />;
    }
  }));
