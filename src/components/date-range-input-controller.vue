<template>
  <date-range-picker-input
    :start-date="startDateString"
    :start-date-id="startDateId"
    :start-date-placeholder="startDatePlaceholder"
    :is-start-date-focused="isStartDateFocused"
    :end-date="endDateString"
    :end-date-id="endDateId"
    :end-date-placeholder="endDatePlaceholder"
    :is-end-date-focused="isEndDateFocused"
    :is-focused="isFocused"
    :disabled="disabled"
    :required="required"
    :read-only="readOnly"
    :open-direction="openDirection"
    :show-caret="showCaret"
    :show-default-input-icon="showDefaultInputIcon"
    :input-icon-position="inputIconPosition"
    :phrases="phrases"
    :handle-start-date-change="onStartDateChange"
    :handle-start-date-focus="onStartDateFocus"
    :handle-start-date-shift-tab="onClearFocus"
    :handle-end-date-change="onEndDateChange"
    :handle-end-date-focus="onEndDateFocus"
    :handle-end-date-tab="onClearFocus"
    :show-clear-dates="showClearDates"
    :handle-clear-dates="clearDates"
    :screen-reader-message="screenReaderMessage"
    :handle-key-down-arrow-down="handleKeyDownArrowDown"
    :handle-key-down-question-mark="handleKeyDownQuestionMark"
    :is-r-t-l="isRTL"
    :no-border="noBorder"
    :block="block"
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
} from "../contants";

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
    startDatePlaceholder: {
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
    endDatePlaceholder: {
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
    keepOpenOnDateSelect: {
      type: Boolean,
      default: false
    },
    reopenPickerOnClearDates: {
      type: Boolean,
      default: false
    },
    minimumNights: {
      type: Number,
      default: 1
    },
    isOutsideRange: {
      type: Function,
      default: function() {}
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
    isRTL: {
      type: Boolean,
      default: false
    },
    isFocused: {
      type: Boolean,
      default: false
    },
    phrases: {
      type: Object,
      default: function() {
        return DateRangePickerInputPhrases;
      }
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
      const { handleFocusChange, handleClose, startDate, endDate } = this;

      handleFocusChange(null);
      handleClose({ startDate, endDate });
    },
    onEndDateChange(endDateString) {
      const {
        startDate,
        isOutsideRange,
        minimumNights,
        keepOpenOnDateSelect,
        handleDatesChange,
        displayFormat
      } = this;

      const endDate = toMomentObject(endDateString, displayFormat());

      const isEndDateValid =
        endDate &&
        !isOutsideRange(endDate) &&
        !(
          startDate &&
          isBeforeDay(endDate, startDate.clone().add(minimumNights, "days"))
        );
      if (isEndDateValid) {
        handleDatesChange({ startDate, endDate });
        if (!keepOpenOnDateSelect) {
          this.onClearFocus();
        }
      } else {
        handleDatesChange({
          startDate,
          endDate: null
        });
      }
    },
    onEndDateFocus() {
      const { startDate, handleFocusChange, disabled, displayFormat } = this;

      if (!startDate && !disabled) {
        handleFocusChange(START_DATE);
      } else if (!disabled) {
        handleFocusChange(END_DATE);
      }
    },
    onStartDateChange(startDateString) {
      const startDate = toMomentObject(startDateString, displayFormat());
      let { endDate } = this;
      const {
        isOutsideRange,
        minimumNights,
        handleDatesChange,
        handleFocusChange
      } = this;
      const isStartDateValid = startDate && isOutsideRange(startDate);
      if (isStartDateValid) {
        if (
          startDate &&
          isBeforeDay(endDate, startDate.clone().add(minimumNights, "days"))
        ) {
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
      if (!this.disabled) {
        this.handleFocusChange(START_DATE);
      }
    },
    getDateString(date) {
      const displayFormat = this.displayFormat();
      if (date && displayFormat) {
        return date && date.format(displayFormat);
      }
      return toLocalizedDateString(date);
    },
    clearDates() {
      const {
        handleDatesChange,
        reopenPickerOnClearDates,
        handleFocusChange
      } = this;
      handleDatesChange({ startDate: null, endDate: null });
      if (reopenPickerOnClearDates) {
        handleFocusChange(START_DATE);
      }
    }
  }
};
</script>
