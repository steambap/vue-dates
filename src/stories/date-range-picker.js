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
//   .add("non-english locale (Chinese)", () => ({
//     render() {
//       moment.locale("zh-cn");

//       return (
//         <SingleDatePicker placeholder="入住日期" monthFormat="YYYY[年]MMMM" />
//       );
//     }
//   }))
//   .add("vertical with custom height", () => ({
//     render() {
//       return (
//         <SingleDatePicker
//           orientation={VERTICAL_ORIENTATION}
//           verticalHeight={568}
//         />
//       );
//     }
//   }))
//   .add("with no animation", () => ({
//     render() {
//       return <SingleDatePicker transitionDuration={0} />;
//     }
//   }))
//   .add("preset", () => ({
//     components: { PresetSingleDatePicker },
//     data() {
//       return { day: moment() };
//     },
//     template:
//       "<preset-single-date-picker v-model='day'></preset-single-date-picker>"
//   }));
