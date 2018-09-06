import moment from "moment";
import { storiesOf } from "storybook-vue";
import DateRangePicker from "./date-range-picker-wrapper";
import PresetDateRangePicker from "../components/preset-date-range-picker.vue";
import { VERTICAL_ORIENTATION } from "../constants";

storiesOf("DateRangePicker", module)
  .add("default", () => ({
    render() {
      return <DateRangePicker />;
    }
  }))
  .add("non-english locale (Chinese)", () => ({
    render() {
      moment.locale("zh-cn");

      return (
        <DateRangePicker startDatePlaceholderText="入住日期" endDatePlaceholderText="退房日期" monthFormat="YYYY[年]MMMM" />
      );
    }
  }))
  .add("vertical with custom height", () => ({
    render() {
      return (
        <DateRangePicker
          orientation={VERTICAL_ORIENTATION}
          verticalHeight={568}
        />
      );
    }
  }))
  .add("with no animation", () => ({
    render() {
      return <DateRangePicker transitionDuration={0} />;
    }
  }))
  .add("preset", () => ({
    components: { PresetDateRangePicker },
    data() {
      return { day: moment() };
    },
    template:
      "<preset-date-range-picker v-model='day'></preset-date-range-picker>"
  }));
