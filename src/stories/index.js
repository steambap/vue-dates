import { storiesOf } from "storybook-vue";
import { action } from "@storybook/addon-actions";

import CalendarDay from "../components/calendar-day.vue";

storiesOf("internal", module).add("CalendayDay", () => ({
  methods: {
    handleClick() {
      action("button-click")("You clicked on CalendarDay component");
    }
  },
  render() {
    return <CalendarDay nativeOnClick={this.handleClick} />;
  }
}));
