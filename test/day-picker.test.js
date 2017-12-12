import { mount, shallow } from "vue-test-utils";
import DayPicker from "../src/components/day-picker.vue";

describe("Component", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(DayPicker);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});

describe("Render week header", () => {
  test("There are 7 days", () => {
    const wrapper = shallow(DayPicker);
    const weekHeaders = wrapper.findAll(".DayPicker__week-header");
    weekHeaders.wrappers.forEach(weekHead => {
      expect(weekHead.find(li)).toHaveLength(7);
    })
  })
});
