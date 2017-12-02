import { storiesOf } from "storybook-vue";
import { action } from "@storybook/addon-actions";

import CalendarDay from "../components/calendar-day.vue";
import CalendarMonth from "../components/calendar-month.vue";
import CalendarMonthGrid from "../components/calendar-month-grid.vue";
import DayPickerNavigation from "../components/day-picker-navigation.vue";
import DayPickerKeyboardShortcuts from "../components/day-picker-keyboard-shortcuts.vue";

storiesOf("internal", module)
  .add("CalendayDay", () => ({
    render() {
      return (
        <CalendarDay handleDayClick={() => action("day-click")("Clicked!")} />
      );
    }
  }))
  .add("CalendarMonth", () => ({
    render() {
      return <CalendarMonth style={{ display: "inline-block" }} />;
    }
  }))
  .add("CalendarMonthGrid", () => ({
    render() {
      return <CalendarMonthGrid />;
    }
  }))
  .add("DayPickerNavigation", () => ({
    methods: {
      onNextClick() {
        action("button-click")("Next month!");
      },
      onPrevClick() {
        action("button-click")("Previous month!");
      }
    },
    render() {
      return (
        <DayPickerNavigation
          handlePrevMonthClick={this.onPrevClick}
          handleNextMonthClick={this.onNextClick}
        />
      );
    }
  }))
  .add("DayPickerKeyboardShortcuts", () => ({
    render() {
      return <DayPickerKeyboardShortcuts showKeyboardShortcutsPanel={true} />;
    }
  }));
