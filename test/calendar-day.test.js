import moment from "moment";
import { shallow } from "vue-test-utils";
import CalendarDay from "../src/components/calendar-day";
import RealCalendarDay from "../src/components/calendar-day1.vue";

describe("CalendarDay", () => {
  test("render empty <td /> when day is null", () => {
    const wrapper = shallow(CalendarDay, {
      context: {
        props: {
          day: null
        }
      }
    });
    expect(wrapper.html()).toBe("<td></td>");
  });

  test("contains a button when day is not null", () => {
    const wrapper = shallow(CalendarDay);
    expect(wrapper.is("td")).toBe(true);
    expect(wrapper.contains("button")).toBe(true);
  });
});

describe("Real CalendarDay", () => {
  test("render formatted day", () => {
    const endOfMonth = moment().endOf("month");
    const wrapper = shallow(RealCalendarDay, {
      propsData: { day: endOfMonth }
    });
    expect(wrapper.find("button").text()).toBe(endOfMonth.format("D"));
  });

  test("use renderDay props for formattedDay", () => {
    const dayName = moment().format("dddd");
    const renderDay = day => day.format("dddd");
    const wrapper = shallow(RealCalendarDay, { propsData: { renderDay } });
    expect(wrapper.find("button").text()).toBe(dayName);
  });

  test("daySize is used for inline styles", () => {
    const wrapper = shallow(RealCalendarDay, { propsData: { daySize: 9999 } });
    expect(wrapper.hasStyle("width", "9999px")).toBe(true);
    expect(wrapper.hasStyle("height", "9998px")).toBe(true);
  });

  test("isOutsideDay affect css class", () => {
    const wrapper = shallow(RealCalendarDay);
    expect(wrapper.classes()).not.toContain("CalendarDay__outside");
    wrapper.setProps({ isOutsideDay: true });
    expect(wrapper.classes()).toContain("CalendarDay__outside");
  });

  test("tabIndex prop is passed to button", () => {
    const wrapper = shallow(RealCalendarDay, { propsData: { tabIndex: 9999 } });
    expect(wrapper.find("button").attributes().tabindex).toBe("9999");
  });

  test("handle day click", () => {
    const handleDayClick = jest.fn();
    const wrapper = shallow(RealCalendarDay, { propsData: { handleDayClick } });
    wrapper.find("button").trigger("click");
    expect(handleDayClick.mock.calls.length).toBe(1);
  });

  test("handle day mouse leave", () => {
    const handleDayMouseLeave = jest.fn();
    const wrapper = shallow(RealCalendarDay, {
      propsData: { handleDayMouseLeave }
    });
    wrapper.find("button").trigger("mouseleave");
    expect(handleDayMouseLeave.mock.calls.length).toBe(1);
  });

  test("handle day mouse enter", () => {
    const handleDayMouseEnter = jest.fn();
    const wrapper = shallow(RealCalendarDay, {
      propsData: { handleDayMouseEnter }
    });
    wrapper.find("button").trigger("mouseenter");
    expect(handleDayMouseEnter.mock.calls.length).toBe(1);
  });
});
