import { mount, shallow } from "vue-test-utils";
import DayPicker from "../src/components/day-picker.vue";
import { VERTICAL_ORIENTATION } from "../src/constants";

describe("Component", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(DayPicker);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});

describe("Render", () => {
  test("There are 7 days in a week", () => {
    const wrapper = shallow(DayPicker);
    const weekHeaders = wrapper.findAll(".DayPicker__week-header");
    weekHeaders.wrappers.forEach(weekHead => {
      expect(weekHead.findAll("li")).toHaveLength(7);
    });
  });

  test("Number of months props", () => {
    const numberOfMonths = 3;
    const wrapper = mount(DayPicker, { propsData: { numberOfMonths } });
    expect(wrapper.findAll("ul")).toHaveLength(numberOfMonths);
  });

  test("Vertical orientation props", () => {
    const orientation = VERTICAL_ORIENTATION;
    const wrapper = mount(DayPicker, { propsData: { orientation } });
    expect(wrapper.findAll("ul")).toHaveLength(1);
  });

  test("Info panel", () => {
    const className = "test-info-panel";
    const infoPanel = `<div class=${className}></div>`;
    const wrapper = mount(DayPicker, { slots: { "info-panel": infoPanel } });
    expect(wrapper.findAll("." + className)).toHaveLength(1);
  });
});
