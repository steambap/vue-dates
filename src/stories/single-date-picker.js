import { storiesOf } from "storybook-vue";
import SingleDatePicker from "./single-date-picker-wrapper";

storiesOf("SingleDatePicker", module)
  .add("default", () => ({
    render() {
      return <SingleDatePicker />;
    }
  }))
  .add("with no animation", () => ({
    render() {
      return <SingleDatePicker transitionDuration={0} />;
    }
  }));
