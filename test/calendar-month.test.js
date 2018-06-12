import moment from "moment";
import { shallowMount } from "@vue/test-utils";
import CalendarMonth from "../src/components/calendar-month.vue";

describe("CalendarMonth", () => {
  test("caption", () => {
    const wrapper = shallowMount(CalendarMonth);
    expect(wrapper.find("strong").text()).toBeTruthy();
  });

  test("caption month format", () => {
    const wrapper = shallowMount(CalendarMonth, {
      propsData: { monthFormat: "MM" }
    });
    expect(wrapper.find("strong").text()).toBe(moment().format("MM"));
  });

  test("render month prop", () => {
    const renderMonth = month => moment(month).format("MM YYYY");
    const wrapper = shallowMount(CalendarMonth, { propsData: { renderMonth } });
    expect(wrapper.find("strong").text()).toBe(renderMonth());
  });
});
