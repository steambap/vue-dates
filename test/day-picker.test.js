import { mount, shallow } from "vue-test-utils";
import DayPicker from "../src/components/day-picker.vue";
import OutsideClickHandler from "../src/components/outside-click-handler";
import { VERTICAL_ORIENTATION } from "../src/constants";

describe("Component", () => {
  test("is a Vue instance", () => {
    const wrapper = shallow(DayPicker);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});

describe("Render", () => {
  const stubs = {
    OutsideClickHandler
  };

  test("There are 7 days in a week", () => {
    const wrapper = shallow(DayPicker, { stubs });
    const weekHeaders = wrapper.findAll(".DayPicker_weekHeader");
    expect(weekHeaders.exists()).toBe(true);
    weekHeaders.wrappers.forEach(weekHead => {
      expect(weekHead.findAll("li")).toHaveLength(7);
    });
  });

  test("Number of months props", () => {
    const numberOfMonths = 3;
    const wrapper = shallow(DayPicker, {
      propsData: { numberOfMonths },
      stubs
    });
    expect(wrapper.findAll("ul")).toHaveLength(numberOfMonths);
  });

  test("Vertical orientation props", () => {
    const orientation = VERTICAL_ORIENTATION;
    const wrapper = shallow(DayPicker, { propsData: { orientation }, stubs });
    expect(wrapper.findAll("ul")).toHaveLength(1);
  });

  test("Info panel", () => {
    const className = "test-info-panel";
    const infoPanel = `<div class=${className}></div>`;
    const wrapper = shallow(DayPicker, {
      slots: { "info-panel": infoPanel },
      stubs
    });
    expect(wrapper.findAll("." + className)).toHaveLength(1);
  });
});
