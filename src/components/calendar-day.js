// Most of the logic for CalendarDay component is in calendar-day1.vue
// This file mimic jsx syntax of:
// if (!day) return <td />;
// return <YourRealComponent />;

import CalendarDay from "./calendar-day1.vue";

export default {
  functional: true,
  render(h, ctx) {
    if (ctx.props.day === null) {
      return h("td");
    }

    return h(CalendarDay, {
      props: ctx.props
    });
  }
};
