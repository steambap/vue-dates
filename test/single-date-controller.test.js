import { mount } from "vue-test-utils";
import SingleDateController from "../src/components/single-date-controller.vue";

test("Component is a Vue instance", () => {
  const wrapper = mount(SingleDateController);
  expect(wrapper.isVueInstance()).toBeTruthy();
});
