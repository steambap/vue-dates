import { shallowMount } from "@vue/test-utils";
import SingleDateInput from "../src/components/single-date-input.vue";

const props = {
  id: "test"
};

describe("SingleDatePickerInput", () => {
  test("hide clear button if showClearDate is false", () => {
    const propsData = { showClearDate: false, ...props };
    const wrapper = shallowMount(SingleDateInput, { propsData });
    expect(wrapper.findAll(".SingleDatePickerInput_clearDate")).toHaveLength(0);
  });

  test("show clear date button", () => {
    const propsData = { showClearDate: true, ...props };
    const wrapper = shallowMount(SingleDateInput, { propsData });
    expect(wrapper.findAll(".SingleDatePickerInput_clearDate")).toHaveLength(1);
  });

  test("handle clear date is triggered", () => {
    const propsData = {
      showClearDate: true,
      handleClearDate: jest.fn(),
      ...props
    };
    const wrapper = shallowMount(SingleDateInput, { propsData });
    wrapper.find(".SingleDatePickerInput_clearDate").trigger("click");
    expect(propsData.handleClearDate.mock.calls.length).toBe(1);
  });

  test("hide default input icon if showDefaultInputIcon is false", () => {
    const propsData = { showDefaultInputIcon: false, ...props };
    const wrapper = shallowMount(SingleDateInput, { propsData });
    expect(wrapper.findAll(".SingleDatePickerInput_calendarIcon")).toHaveLength(
      0
    );
  });

  test("show default input icon", () => {
    const propsData = { showDefaultInputIcon: true, ...props };
    const wrapper = shallowMount(SingleDateInput, { propsData });
    expect(wrapper.findAll(".SingleDatePickerInput_calendarIcon")).toHaveLength(
      1
    );
  });
});
