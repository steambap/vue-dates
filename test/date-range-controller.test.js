import { mount } from "vue-test-utils";
import DateRangeController from "../src/components/date-range-controller.vue";

test("Component is a Vue instance", () => {
  const wrapper = mount(DateRangeController);
  expect(wrapper.isVueInstance()).toBeTruthy();
});
