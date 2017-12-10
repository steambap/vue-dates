# vue-dates

> airbnb/react-dates for vue 2.x. Work in progress.

## Todo

- [ ] DateRangePicker
- [ ] DateRangePicker_calendar
- [ ] DateRangePicker_day
- [ ] DateRangePicker_input
- [x] DayPicker
- [ ] DayPickerRangeController
- [ ] DayPickerSingleDateController
- [ ] PresetDateRangePicker
- [ ] SingleDatePicker
- [ ] SingleDatePicker_calendar
- [ ] SingleDatePicker_day
- [ ] SingleDatePicker_input

## Live Playground

For examples of the datepicker in action, go to http://weilinshi.org/vue-dates/.

OR

To run that demo on your own computer:
* Clone this repository
* `npm install`
* `npm run storybook`
* Visit http://localhost:5000/

## Install
```
npm install --save vue-dates
```

## How to use

There is only one component `DayPicker` right now.
If you are using Webpack:
```JS
// css
import "vue-dates/dist/style.css";
// vue component
import DayPicker from "vue-dates/dist/day-picker";
```

## License
[MIT](LICENSE.md)
