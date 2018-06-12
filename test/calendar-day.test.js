import moment from "moment";
import { shallowMount } from "@vue/test-utils";
import CalendarDay from "../src/components/calendar-day";
import RealCalendarDay from "../src/components/calendar-day1.vue";

describe("CalendarDay", () => {
  test("render empty <td /> when day is null", () => {
    const wrapper = shallowMount(CalendarDay, {
      context: {
        props: {
          day: null
        }
      }
    });
    expect(wrapper.html()).toBe("<td></td>");
  });

  test("contains a button when day is not null", () => {
    const wrapper = shallowMount(CalendarDay);
    expect(wrapper.is("td")).toBe(true);
    expect(wrapper.contains("button")).toBe(true);
  });
});

describe("Real CalendarDay", () => {
  test("render formatted day", () => {
    const endOfMonth = moment().endOf("month");
    const wrapper = shallowMount(RealCalendarDay, {
      propsData: { day: endOfMonth }
    });
    expect(wrapper.find("button").text()).toBe(endOfMonth.format("D"));
  });

  test("use renderDay props for formattedDay", () => {
    const dayName = moment().format("dddd");
    const renderDay = day => day.format("dddd");
    const wrapper = shallowMount(RealCalendarDay, { propsData: { renderDay } });
    expect(wrapper.find("button").text()).toBe(dayName);
  });

  test("daySize is used for inline styles", () => {
    const wrapper = shallowMount(RealCalendarDay, { propsData: { daySize: 9999 } });
    expect(wrapper.element.style.width).toBe("9999px");
    expect(wrapper.element.style.height).toBe("9998px");
  });

  test("isOutsideDay affect css class", () => {
    const wrapper = shallowMount(RealCalendarDay, {
      propsData: {
        isOutsideDay: false
      }
    });
    expect(wrapper.classes()).not.toContain("CalendarDay__outside");
    const wrapper1 = shallowMount(RealCalendarDay, {
      propsData: {
        isOutsideDay: true
      }
    });
    expect(wrapper1.classes()).toContain("CalendarDay__outside");
  });

  test("tabIndex prop is passed to button", () => {
    const wrapper = shallowMount(RealCalendarDay, { propsData: { tabIndex: 9999 } });
    expect(wrapper.find("button").attributes().tabindex).toBe("9999");
  });

  test("handle day click", () => {
    const handleDayClick = jest.fn();
    const wrapper = shallowMount(RealCalendarDay, { propsData: { handleDayClick } });
    wrapper.find("button").trigger("click");
    expect(handleDayClick.mock.calls.length).toBe(1);
  });

  test("handle day mouse leave", () => {
    const handleDayMouseLeave = jest.fn();
    const wrapper = shallowMount(RealCalendarDay, {
      propsData: { handleDayMouseLeave }
    });
    wrapper.find("button").trigger("mouseleave");
    expect(handleDayMouseLeave.mock.calls.length).toBe(1);
  });

  test("handle day mouse enter", () => {
    const handleDayMouseEnter = jest.fn();
    const wrapper = shallowMount(RealCalendarDay, {
      propsData: { handleDayMouseEnter }
    });
    wrapper.find("button").trigger("mouseenter");
    expect(handleDayMouseEnter.mock.calls.length).toBe(1);
  });
});
