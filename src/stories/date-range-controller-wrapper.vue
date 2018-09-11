<template>
  <date-range-controller
    :handle-dates-change="onDatesChange"
    :handle-focus-change="onFocusChange"
    :focused-input="focusedInput"
    :start-date="startDate"
    :end-date="endDate"
    :keep-open-on-date-select="keepOpenOnDateSelect"
    :minimum-nights="minimumNights"
    :is-outside-range="isOutsideRange"
    :is-day-blocked="isDayBlocked"
    :is-day-highlighted="isDayHighlighted"
    :enable-outside-days="enableOutsideDays"
    :number-of-months="numberOfMonths"
    :orientation="orientation"
    :with-portal="withPortal"
    :initial-visible-month="initialVisibleMonth"
    :handle-prev-month-click="handlePrevMonthClick"
    :handle-next-month-click="handleNextMonthClick"
    :handle-outside-click="handleOutsideClick"
    :render-day="renderDay"
    :month-format="monthFormat"
    :is-r-t-l="isRTL"
    :transition-duration="transitionDuration"
  >
    <template slot="info-panel">
      <slot name="info-panel"></slot>
    </template>
  </date-range-controller>
</template>

<script>
import moment from "moment";
import DateRangeController from "../components/date-range-controller.vue";
import { isInclusivelyAfterDay } from "../helpers";
import { HORIZONTAL_ORIENTATION, START_DATE, END_DATE } from "../constants";

export default {
  name: "date-range-controller-wrapper",
  components: { DateRangeController },
  props: {
    autoFocusEndDate: {
      type: Boolean,
      default: false
    },
    initialStartDate: {
      type: moment,
      default: null
    },
    initialEndDate: {
      type: moment,
      default: null
    },
    keepOpenOnDateSelect: {
      type: Boolean,
      default: false
    },
    minimumNights: {
      type: Number,
      default: 1
    },
    isOutsideRange: {
      type: Function,
      default: function(day) {
        return !isInclusivelyAfterDay(day, moment());
      }
    },
    isDayBlocked: {
      type: Function,
      default: function() {
        return false;
      }
    },
    isDayHighlighted: {
      type: Function,
      default: function() {
        return false;
      }
    },
    // DayPicker props
    enableOutsideDays: {
      type: Boolean,
      default: false
    },
    numberOfMonths: {
      type: Number,
      default: 2
    },
    orientation: {
      type: String,
      default: HORIZONTAL_ORIENTATION
    },
    withPortal: {
      type: Boolean,
      default: false
    },
    initialVisibleMonth: {
      type: Function,
      default: null
    },
    handlePrevMonthClick: {
      type: Function,
      default: function() {}
    },
    handleNextMonthClick: {
      type: Function,
      default: function() {}
    },
    handleOutsideClick: {
      type: Function,
      default: function() {}
    },
    renderDay: {
      type: Function,
      default: null
    },
    monthFormat: {
      type: String,
      default: "MMMM YYYY"
    },
    isRTL: {
      type: Boolean,
      default: false
    },
    transitionDuration: {
      type: Number
    }
  },
  data() {
    return {
      focusedInput: this.autoFocusEndDate ? END_DATE : START_DATE,
      startDate: this.initialStartDate,
      endDate: this.initialEndDate
    };
  },
  methods: {
    onDatesChange(arg) {
      this.startDate = arg.startDate;
      this.endDate = arg.endDate;
    },
    onFocusChange(focusedInput) {
      this.focusedInput = !focusedInput ? START_DATE : focusedInput;
    }
  }
};
</script>
