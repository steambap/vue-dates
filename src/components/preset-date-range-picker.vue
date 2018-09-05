<template>
  <date-range-picker
    :date="value"
    :focused="focused"
    :handle-date-change="onDateChange"
    :handle-focus-change="onFocusChange"
    :id="id"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :read-only="readOnly"
    :show-clear-date="showClearDate"
    :show-default-input-icon="showDefaultInputIcon"
    :input-icon-position="inputIconPosition"
    :no-border="noBorder"
    :block="block"
    :render-month="renderMonth"
    :orientation="orientation"
    :anchor-direction="anchorDirection"
    :open-direction="openDirection"
    :horizontal-margin="horizontalMargin"
    :initial-visible-month="initialVisibleMonth"
    :first-day-of-week="firstDayOfWeek"
    :number-of-months="numberOfMonths"
    :keep-open-on-date-select="keepOpenOnDateSelect"
    :reopen-picker-on-clear-date="reopenPickerOnClearDate"
    :hide-keyboard-shortcuts-panel="hideKeyboardShortcutsPanel"
    :day-size="daySize"
    :is-r-t-l="isRTL"
    :vertical-height="verticalHeight"
    :transition-duration="transitionDuration"
    :handle-prev-month-click="handlePrevMonthClick"
    :handle-next-month-click="handleNextMonthClick"
    :handle-close="handleClose"
    :render-day="renderDay"
    :enable-outside-days="enableOutsideDays"
    :is-outside-range="isOutsideRange"
    :is-day-blocked="isDayBlocked"
    :is-day-highlighted="isDayHighlighted"
    :display-format="displayFormat"
    :month-format="monthFormat"
    :week-day-format="weekDayFormat"
    :phrases="phrases"
  >
    <template slot="info-panel">
      <slot name="info-panel"></slot>
    </template>
  </date-range-picker>
</template>

<script>
import moment from "moment";
import SingleDatePicker from "../components/date-range-picker.vue";
import {
  HORIZONTAL_ORIENTATION,
  ANCHOR_LEFT,
  OPEN_DOWN,
  DAY_SIZE,
  ICON_BEFORE_POSITION
} from "../constants";

export default {
  name: "date-range-picker-wrapper",
  components: { SingleDatePicker },
  props: {
    autoFocus: {
      type: Boolean,
      default: false
    },
    value: {
      type: moment,
      default: null
    },
    id: {
      type: String,
      default: "date"
    },
    placeholder: {
      type: String,
      default: "Date"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: null
    },
    showClearDate: {
      type: Boolean,
      default: false
    },
    showDefaultInputIcon: {
      type: Boolean,
      default: false
    },
    inputIconPosition: {
      type: String,
      default: ICON_BEFORE_POSITION
    },
    noBorder: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    orientation: {
      type: String,
      default: HORIZONTAL_ORIENTATION
    },
    anchorDirection: {
      type: String,
      default: ANCHOR_LEFT
    },
    openDirection: {
      type: String,
      default: OPEN_DOWN
    },
    horizontalMargin: {
      type: Number,
      default: 0
    },
    initialVisibleMonth: {
      type: Function,
      default: null
    },
    firstDayOfWeek: {
      type: Number
    },
    numberOfMonths: {
      type: Number,
      default: 2
    },
    keepOpenOnDateSelect: {
      type: Boolean,
      default: false
    },
    reopenPickerOnClearDate: {
      type: Boolean,
      default: false
    },
    hideKeyboardShortcutsPanel: {
      type: Boolean,
      default: false
    },
    daySize: {
      type: Number,
      default: DAY_SIZE
    },
    isRTL: {
      type: Boolean,
      default: false
    },
    verticalHeight: {
      type: Number,
      default: null
    },
    transitionDuration: {
      type: Number,
      default: undefined
    },
    handlePrevMonthClick: {
      type: Function,
      default: function() {}
    },
    handleNextMonthClick: {
      type: Function,
      default: function() {}
    },
    handleClose: {
      type: Function,
      default: function() {}
    },
    renderMonth: {
      type: Function,
      default: null
    },
    renderDay: {
      type: Function,
      default: null
    },
    enableOutsideDays: {
      type: Boolean,
      default: false
    },
    isOutsideRange: {
      type: Function,
      default: function() {}
    },
    isDayBlocked: {
      type: Function,
      default: function() {}
    },
    isDayHighlighted: {
      type: Function,
      default: function() {}
    },
    displayFormat: {
      type: Function,
      default: function() {
        return moment.localeData().longDateFormat("L");
      }
    },
    monthFormat: {
      type: String,
      default: "MMMM YYYY"
    },
    weekDayFormat: {
      type: String,
      default: "dd"
    },
    phrases: {
      type: Object
    }
  },
  data() {
    return {
      focused: this.autoFocus
    };
  },
  methods: {
    onDateChange(date) {
      this.$emit("input", date);
    },
    onFocusChange(e) {
      this.focused = e.focused;
    }
  }
};
</script>
