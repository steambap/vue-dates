<template>
  <date-range-picker-input
      :startDate="startDateString"
      :startDateId="startDateId"
      :startDatePlaceholderText="startDatePlaceholderText"
      :isStartDateFocused="isStartDateFocused"
      :endDate="endDateString"
      :endDateId="endDateId"
      :endDatePlaceholderText="endDatePlaceholderText"
      :isEndDateFocused="isEndDateFocused"
      :isFocused="isFocused"
      :disabled="disabled"
      :required="required"
      :readOnly="readOnly"
      :openDirection="openDirection"
      :showCaret="showCaret"
      :showDefaultInputIcon="showDefaultInputIcon"
      :inputIconPosition="inputIconPosition"
      :customInputIcon="customInputIcon"
      :customArrowIcon="customArrowIcon"
      :customCloseIcon="customCloseIcon"
      :phrases="phrases"
      :onStartDateChange="onStartDateChange"
      :onStartDateFocus="onStartDateFocus"
      :onStartDateShiftTab="onClearFocus"
      :onEndDateChange="onEndDateChange"
      :onEndDateFocus="onEndDateFocus"
      :onEndDateTab="onClearFocus"
      :showClearDates="showClearDates"
      :onClearDates="clearDates"
      :screenReaderMessage="screenReaderMessage"
      :onKeyDownArrowDown="onKeyDownArrowDown"
      :onKeyDownQuestionMark="onKeyDownQuestionMark"
      :isRTL="isRTL"
      :noBorder="noBorder"
      :block="block"
      :small="small"
      :regular="regular"
      :verticalSpacing="verticalSpacing"
  ></date-range-picker-input>
</template>

<script>
import moment from "moment";
import { DateRangePickerInputPhrases } from "../phrases";
import DateRangePickerInput from "./date-range-input.vue";
import {
  toMomentObject,
  toLocalizedDateString,
  isInclusivelyAfterDay,
  isBeforeDay
} from "../helpers";
import {
  START_DATE,
  END_DATE,
  ICON_BEFORE_POSITION,
  OPEN_DOWN
} from "../constants";

export default {
  name: "date-range-input-controller",
  components: {DateRangePickerInput},
  props: {
    startDate: {
      type: moment,
      default: null
    },
    startDateId: {
      type: String,
      default: START_DATE
    },
    startDatePlaceholderText: {
      type: String,
      default: 'Start Date'
    },
    isStartDateFocused: {
      type: Boolean,
      default: false
    },

    endDate: {
      type: moment,
      default: null
    },
    endDateId: {
      type: String,
      default: END_DATE
    },
    endDatePlaceholderText: {
      type: String,
      default: 'End Date'
    },
    isEndDateFocused: {
      type: Boolean,
      default: false
    },

    screenReaderMessage: {
      type: String,
      default: ''
    },
    showClearDates: {
      type: Boolean,
      default: false
    },
    showCaret: {
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
      default: false
    },
    openDirection: {
      type: String,
      default: OPEN_DOWN
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
    verticalSpacing: {
      type: Number,
      default: undefined
    },

    keepOpenOnDateSelect: {
      type: Boolean,
      default: false
    },
    reopenPickerOnClearDates: {
      type: Boolean,
      default: false
    },
    withFullScreenPortal: {
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
        return !isInclusivelyAfterDay(day, moment())
      }
    },
    displayFormat: {
      type: Function,
      default: function() {
        return moment.localeData().longDateFormat('L')
      }
    },

    onFocusChange: {
      type: Function,
      default: function() {}
    },
    onClose: {
      type: Function,
      default: function() {}
    },
    onDatesChange: {
      type: Function,
      default: function() {}
    },
    onKeyDownArrowDown: {
      type: Function,
      default: function() {}
    },
    onKeyDownQuestionMark: {
      type: Function,
      default: function() {}
    },

    customInputIcon: {
      type: String,
      default: null
    },
    customArrowIcon: {
      type: String,
      default: null
    },
    customCloseIcon: {
      type: String,
      default: null
    },

    // accessibility
    isFocused: {
      type: Boolean,
      default: false
    },

    // i18n
    phrases: {
      type: Object,
      default: DateRangePickerInputPhrases
    },

    isRTL: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    startDateString() {
      return this.getDateString(this.startDate);
    },
    endDateString() {
      return this.getDateString(this.endDate);
    }
  },
  methods: {
    onClearFocus() {
      const {
        onFocusChange,
        onClose,
        startDate,
        endDate,
      } = this;

      onFocusChange(null);
      onClose({ startDate, endDate });
    },

    onEndDateChange(endDateString) {
      const {
        startDate,
        isOutsideRange,
        minimumNights,
        keepOpenOnDateSelect,
        onDatesChange,
      } = this;

      const endDate = toMomentObject(endDateString, this.getDisplayFormat());

      const isEndDateValid = endDate
        && !isOutsideRange(endDate)
        && !(startDate && isBeforeDay(endDate, startDate.clone().add(minimumNights, 'days')));
      if (isEndDateValid) {
        onDatesChange({ startDate, endDate });
        if (!keepOpenOnDateSelect) this.onClearFocus();
      } else {
        onDatesChange({
          startDate,
          endDate: null,
        });
      }
    },

    onEndDateFocus() {
      const {
        startDate,
        onFocusChange,
        withFullScreenPortal,
        disabled,
      } = this;

      if (!startDate && withFullScreenPortal && (!disabled || disabled === END_DATE)) {
        // When the datepicker is full screen, we never want to focus the end date first
        // because there's no indication that that is the case once the datepicker is open and it
        // might confuse the user
        onFocusChange(START_DATE);
      } else if (!disabled || disabled === START_DATE) {
        onFocusChange(END_DATE);
      }
    },

    onStartDateChange(startDateString) {
      let { endDate } = this;
      const {
        isOutsideRange,
        minimumNights,
        onDatesChange,
        onFocusChange,
        disabled,
      } = this;

      const startDate = toMomentObject(startDateString, this.getDisplayFormat());
      const isEndDateBeforeStartDate = startDate
        && isBeforeDay(endDate, startDate.clone().add(minimumNights, 'days'));
      const isStartDateValid = startDate
        && !isOutsideRange(startDate)
        && !(disabled === END_DATE && isEndDateBeforeStartDate);

      if (isStartDateValid) {
        if (isEndDateBeforeStartDate) {
          endDate = null;
        }

        onDatesChange({ startDate, endDate });
        onFocusChange(END_DATE);
      } else {
        onDatesChange({
          startDate: null,
          endDate,
        });
      }
    },

    onStartDateFocus() {
      const { disabled, onFocusChange } = this;
      if (!disabled || disabled === END_DATE) {
        onFocusChange(START_DATE);
      }
    },

    getDisplayFormat() {
      const { displayFormat } = this;
      return typeof displayFormat === 'string' ? displayFormat : displayFormat();
    },

    getDateString(date) {
      const displayFormat = this.getDisplayFormat();
      if (date && displayFormat) {
        return date && date.format(displayFormat);
      }
      return toLocalizedDateString(date);
    },

    clearDates() {
      const { onDatesChange, reopenPickerOnClearDates, onFocusChange } = this;
      onDatesChange({ startDate: null, endDate: null });
      if (reopenPickerOnClearDates) {
        onFocusChange(START_DATE);
      }
    }
  }
};
</script>
