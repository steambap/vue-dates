import { storiesOf } from "storybook-vue";
import { action } from "@storybook/addon-actions";

import CalendarDay from "../components/calendar-day.vue";
import CalendarMonth from "../components/calendar-month.vue";
import CalendarMonthGrid from "../components/calendar-month-grid.vue";

storiesOf("internal", module)
  .add("CalendayDay", () => ({
    methods: {
      handleClick() {
        action("button-click")("You clicked on CalendarDay component");
      }
    },
    render() {
      return <CalendarDay nativeOnClick={this.handleClick} />;
    }
  }))
  .add("CalendarMonth", () => ({
    render() {
      return <CalendarMonth enableOutsideDays={true} style={{display: 'inline-block'}} />;
    }
  }))
  .add("CalendarMonthGrid", () => ({
    render() {
      return <CalendarMonthGrid enableOutsideDays={true} />;
    }
  }));
