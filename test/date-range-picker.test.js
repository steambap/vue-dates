import { mount, shallowMount } from "@vue/test-utils";
import DateRangePicker from "../src/components/date-range-picker.vue";
import DateRangeController from "../src/components/date-range-controller.vue";

const propsData = {
  id: "date",
  handleDatesChange() {},
  handleFocusChange() {},
  focusedInput: null,
  startDate: null,
  endDate: null
};

describe("render", () => {
  test("Component is a Vue instance", () => {
    const wrapper = shallowMount(DateRangePicker, { propsData });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("Has a controller", () => {
    const props = { ...propsData, focusedInput: 'startDate' };
    const wrapper = mount(DateRangePicker, { propsData: props });
    expect(wrapper.find(DateRangeController).exists()).toBe(true);
  });
});
