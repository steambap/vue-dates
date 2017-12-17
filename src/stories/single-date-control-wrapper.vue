<template>
  <single-date-controller
    :date="date"
    :focused="focused"
    :handle-date-change="onDateChange"
    :handle-focus-change="onFocusChange"
    :render-day="renderDay"
    :is-outside-range="isOutsideRange"
    :is-day-blocked="isDayBlocked"
    :is-day-highlighted="isDayHighlighted"
    :enable-outside-days="enableOutsideDays"
    :with-portal="withPortal"
    :initial-visible-month="initialVisibleMonth"
    :number-of-months="numberOfMonths"
    :keep-open-on-date-select="keepOpenOnDateSelect"
    :is-r-t-l="isRTL"
    :handle-next-month-click="handleNextMonthClick"
    :handle-prev-month-click="handlePrevMonthClick"
    :month-format="monthFormat"
    :transition-duration="transitionDuration"
  >
    <template slot="info-panel">
      <slot name="info-panel"></slot>
    </template>
  </single-date-controller>
</template>

<script>
import moment from "moment";
import SingleDateController from "../components/single-date-controller.vue";
import { isInclusivelyAfterDay } from "../helpers";

export default {
  name: "single-date-control-wrapper",
  components: { SingleDateController },
  props: {
    initialDate: {
      type: moment,
      default: null
    },
    renderDay: {
      type: Function,
      default: null
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
    enableOutsideDays: {
      type: Boolean,
      default: false
    },
    withPortal: {
      type: Boolean,
      default: false
    },
    initialVisibleMonth: {
      type: Function,
      default: null
    },
    numberOfMonths: {
      type: Number,
      default: 2
    },
    keepOpenOnDateSelect: {
      type: Boolean,
      default: false
    },
    isRTL: {
      type: Boolean,
      default: false
    },
    handlePrevMonthClick: {
      type: Function,
      default: function() {}
    },
    handleNextMonthClick: {
      type: Function,
      default: function() {}
    },
    monthFormat: {
      type: String,
      default: "MMMM YYYY"
    },
    transitionDuration: {
      type: Number,
      default: undefined
    },
  },
  data() {
    return {
      focused: true,
      date: this.initialDate
    };
  },
  methods: {
    onDateChange(date) {
      this.date = date;
    },
    onFocusChange() {
      this.focused = true;
    }
  }
};
</script>
