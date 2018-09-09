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
      :phrases="phrases"
      :handle-start-date-change="onStartDateChange"
      :handle-start-date-focus="onStartDateFocus"
      :handle-start-date-shift-tab="onClearFocus"
      :handle-end-date-change="onEndDateChange"
      :handle-end-date-focus="onEndDateFocus"
      :handle-end-date-tab="onClearFocus"
      :showClearDates="showClearDates"
      :handle-clear-dates="clearDates"
      :screenReaderMessage="screenReaderMessage"
      :handle-key-down-arrow-down="handleKeyDownArrowDown"
      :handle-key-down-question-mark="handleKeyDownQuestionMark"
      :isRTL="isRTL"
      :noBorder="noBorder"
      :block="block"
      :small="small"
      :regular="regular"
      :verticalSpacing="verticalSpacing"
  >
      <template slot="custom-input-icon">
        <slot name="custom-input-icon"></slot>
      </template>
      <template slot="custom-arrow-icon">
        <slot name="custom-arrow-icon"></slot>
      </template>
      <template slot="custom-close-icon">
        <slot name="custom-close-icon"></slot>
      </template>
  </date-range-picker-input>
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
  components: { DateRangePickerInput },
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
      default: "Start Date"
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
      default: "End Date"
    },
    isEndDateFocused: {
      type: Boolean,
      default: false
    },

    screenReaderMessage: {
      type: String,
      default: ""
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
        return !isInclusivelyAfterDay(day, moment());
      }
    },
    displayFormat: {
      type: Function,
      default: function() {
        return moment.localeData().longDateFormat("L");
      }
    },

    handleFocusChange: {
      type: Function,
      default: function() {}
    },
    handleClose: {
      type: Function,
      default: function() {}
    },
    handleDatesChange: {
      type: Function,
      default: function() {}
    },
    handleKeyDownArrowDown: {
      type: Function,
      default: function() {}
    },
    handleKeyDownQuestionMark: {
      type: Function,
      default: function() {}
    },

    // accessibility
    isFocused: {
      type: Boolean,
      default: false
    },

    // i18n
    phrases: {
      type: Object,
      default: function() {
        return DateRangePickerInputPhrases
      }
    },

    isRTL: {
      type: Boolean,
      default: false
    }
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
        handleFocusChange,
        handleClose,
        startDate,
        endDate,
      } = this;

      handleFocusChange(null);
      handleClose({ startDate, endDate });
    },

    onEndDateChange(endDateString) {
      const {
        startDate,
        isOutsideRange,
        minimumNights,
        keepOpenOnDateSelect,
        handleDatesChange
      } = this;

      const endDate = toMomentObject(endDateString, this.getDisplayFormat());

      const isEndDateValid = endDate
        && !isOutsideRange(endDate)
        && !(startDate && isBeforeDay(endDate, startDate.clone().add(minimumNights, 'days')));
      if (isEndDateValid) {
        handleDatesChange({ startDate, endDate });
        if (!keepOpenOnDateSelect) this.onClearFocus();
      } else {
        handleDatesChange({
          startDate,
          endDate: null
        });
      }
    },

    onEndDateFocus() {
      const {
        startDate,
        handleFocusChange,
        withFullScreenPortal,
        disabled,
      } = this;

      if (!startDate && withFullScreenPortal && (!disabled || disabled === END_DATE)) {
        // When the datepicker is full screen, we never want to focus the end date first
        // because there's no indication that that is the case once the datepicker is open and it
        // might confuse the user
        handleFocusChange(START_DATE);
      } else if (!disabled || disabled === START_DATE) {
        handleFocusChange(END_DATE);
      }
    },

    onStartDateChange(startDateString) {
      let { endDate } = this;
      const {
        isOutsideRange,
        minimumNights,
        handleDatesChange,
        handleFocusChange,
        disabled
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

        handleDatesChange({ startDate, endDate });
        handleFocusChange(END_DATE);
      } else {
        handleDatesChange({
          startDate: null,
          endDate
        });
      }
    },

    onStartDateFocus() {
      const { disabled, handleFocusChange } = this;
      if (!disabled || disabled === END_DATE) {
        handleFocusChange(START_DATE);
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
      const { handleDatesChange, reopenPickerOnClearDates, handleFocusChange } = this;
      handleDatesChange({ startDate: null, endDate: null });
      if (reopenPickerOnClearDates) {
        handleFocusChange(START_DATE);
      }
    }
  }
};
</script>
