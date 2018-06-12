import { shallowMount } from "@vue/test-utils";
import DateRangeController from "../src/components/date-range-controller.vue";

test("Component is a Vue instance", () => {
  const wrapper = shallowMount(DateRangeController);
  expect(wrapper.isVueInstance()).toBeTruthy();
});
