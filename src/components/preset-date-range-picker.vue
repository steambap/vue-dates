<template>
  <date-range-picker
    :handle-focus-change="onFocusChange"
    :handle-dates-change="onDatesChange"
    :focusedInput="focusedInput"
    :startDate="startDate"
    :endDate="endDate"

    :id="id"
    :startDatePlaceholderText="startDatePlaceholderText"
    :endDatePlaceholderText="endDatePlaceholderText"
    :disabled="disabled"
    :required="required"
    :read-only="readOnly"
    :screen-reader-input-message="screenReaderInputMessage"
    :show-clear-dates="showClearDate"
    :show-default-input-icon="showDefaultInputIcon"
    :input-icon-position="inputIconPosition"
    :no-border="noBorder"
    :block="block"
    :small="small"
    :regular="regular"
    :keep-focus-on-input="keepFocusOnInput"

    :render-month-text="renderMonthText"
    :orientation="orientation"
    :anchor-direction="anchorDirection"
    :open-direction="openDirection"
    :horizontal-margin="horizontalMargin"
    :with-portal="withPortal"
    :with-full-screen-portal="withFullScreenPortal"
    :append-to-body="appendToBody"
    :prop-disable-scroll="propDisableScroll"
    :initial-visible-month="initialVisibleMonth"
    :number-of-months="numberOfMonths"
    :keep-open-on-date-select="keepOpenOnDateSelect"
    :reopen-picker-on-clear-date="reopenPickerOnClearDate"
    :render-calendar-info="renderCalendarInfo"
    :calendar-info-position="calendarInfoPosition"
    :hide-keyboard-shortcuts-panel="hideKeyboardShortcutsPanel"
    :day-size="daySize"
    :is-r-t-l="isRTL"
    :first-day-of-week="firstDayOfWeek"
    :vertical-height="verticalHeight"
    :transition-duration="transitionDuration"
    :vertical-spacing="verticalSpacing"

    :nav-prev="navPrev"
    :nav-next="navNext"
    :on-prev-month-click="handlePrevMonthClick"
    :on-next-month-click="handleNextMonthClick"
    :on-close="handleClose"
    :on-focus-change="handleFocusChange"

    :render-calendar-day="renderCalendarDay"
    :render-day-contents="renderDayContents"
    :render-month-element="renderMonthElement"
    :minimum-nights="minimumNights"
    :enable-outside-days="enableOutsideDays"
    :is-day-blocked="isDayBlocked"
    :is-outside-range="isOutsideRange"
    :is-day-highlighted="isDayHighlighted"
    :display-format="displayFormat"
    :month-format="monthFormat"
    :week-day-format="weekDayFormat"
    :phrases="phrases"
    :day-aria-label-format="dayAriaLabelFormat"
  ></date-range-picker>
</template>

<script>
import moment from "moment";
import DateRangePicker from "./date-range-picker.vue";
import {
  HORIZONTAL_ORIENTATION,
  ANCHOR_LEFT,
  ANCHOR_RIGHT,
  OPEN_DOWN,
  OPEN_UP,
  DAY_SIZE,
  ICON_BEFORE_POSITION,
  INFO_POSITION_BOTTOM,
  FANG_HEIGHT_PX,
  DEFAULT_VERTICAL_SPACING
} from "../constants";
import { DateRangePickerPhrases } from "../phrases";

export default {
  name: "date-range-picker-wrapper",
  components: { DateRangePicker },
  props: {
    autoFocus: {
      type: Boolean,
      default: false
    },
    initialDate: {
      type: moment,
      default: null
    },
    id: {
      type: String,
      default: "date"
    },
    startDatePlaceholderText: {
      type: String,
      default: "Start Date"
    },
    endDatePlaceholderText: {
      type: String,
      default: "End Date"
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
    screenReaderInputMessage: {
      type: String,
      default: ""
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
    small: {
      type: Boolean,
      default: false
    },
    regular: {
      type: Boolean,
      default: false
    },
    keepFocusOnInput: {
      type: Boolean,
      default: false
    },
    renderMonthText: {
      type: String,
      default: null
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
    withPortal: {
      type: Boolean,
      default: false
    },
    withFullScreenPortal: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    propDisableScroll: {
      type: Boolean,
      default: false
    },
    initialVisibleMonth: {
      type: Function,
      default: null
    },
    firstDayOfWeek: {
      type: Number,
      default: moment.localeData().firstDayOfWeek()
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
    renderCalendarInfo: {
      type: String,
      default: null
    },
    calendarInfoPosition: {
      type: String,
      default: INFO_POSITION_BOTTOM
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
    verticalSpacing: {
      type: String,
      default: DEFAULT_VERTICAL_SPACING
    },
    navPrev: {
      type: String,
      default: null
    },
    navNext: {
      type: String,
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
    handleFocusChange: {
      type: Function,
      default: function() {}
    },
    handleClose: {
      type: Function,
      default: function() {}
    },
    renderCalendarDay: {
      type: String,
      default: undefined
    },
    renderDayContents: {
      type: String,
      default: null
    },
    renderMonthElement: {
      type: String,
      default: null
    },
    minimumNights: {
      type: Number,
      default: 1
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
      type: Object,
      default: function() {
        return DateRangePickerPhrases;
      }
    },
    dayAriaLabelFormat: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      focusedInput: null,
      startDate: null,
      endDate: null,
      stateDateWrapper: function(date) {
        return date;
      }
    };
  },
  methods: {
    onDatesChange({ startDate, endDate }) {
      const { stateDateWrapper } = this;
      this.startDate = startDate && stateDateWrapper(startDate);
      this.endDate = endDate && stateDateWrapper(endDate);
    },
    onFocusChange(focusedInput) {
      this.focusedInput = focusedInput;
    }
  }
};
</script>
