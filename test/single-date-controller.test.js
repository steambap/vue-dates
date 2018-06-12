import moment from "moment";
import { shallowMount } from "@vue/test-utils";
import SingleDateController from "../src/components/single-date-controller.vue";

describe("SingleDateController", () => {
  test("Component is a Vue instance", () => {
    const wrapper = shallowMount(SingleDateController);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("non-reactive `today` properties", () => {
    const wrapper = shallowMount(SingleDateController);
    expect(wrapper.vm.today).toBeInstanceOf(moment);
  });

  test("currentMonth state is based on date props", () => {
    const date = moment().endOf("month");
    const wrapper = shallowMount(SingleDateController, { propsData: { date } });
    expect(wrapper.vm.currentMonth).toBe(date);
  });

  test("currentMonth is also based on initialVisibleMonth props", () => {
    const initialVisibleMonth = () => moment().endOf("month");
    const wrapper = shallowMount(SingleDateController, {
      propsData: { initialVisibleMonth }
    });
    const isSameDay = initialVisibleMonth().isSame(wrapper.vm.currentMonth);
    expect(isSameDay).toBe(true);
  });
});
