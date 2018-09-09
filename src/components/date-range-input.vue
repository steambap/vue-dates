<template>
  <div
    class="DateRangePickerInput"
    :class="{
      'DateRangePickerInput__disabled': disabled,
      'DateRangePickerInput__rtl': isRTL,
      'DateRangePickerInput__withBorder': !noBorder,
      'DateRangePickerInput__block': block,
      'DateRangePickerInput__showClearDates': showClearDates
    }"
  >
    <button
      v-if="showDefaultInputIcon && iconBefore"
      class="DateRangePickerInput_calendarIcon"
      type="button"
      :disabled="disabled"
      :aria-label="phrases.focusStartDate"
      @click="handleKeyDownArrowDown"
    >
      <slot name="custom-input-icon" v-if="$slots['custom-input-icon']"></slot>
      <calendar-icon class="DateRangePickerInput_calendarIcon_svg" v-else></calendar-icon>
    </button>
    <date-input
      :id="startDateId"
      :placeholder="startDatePlaceholderText"
      :displayValue="startDate"
      :screenReaderMessage="screenReaderText"
      :focused="isStartDateFocused"
      :isFocused="isFocused"
      :disabled="startDateDisabled"
      :required="required"
      :readOnly="readOnly"
      :showCaret="showCaret"
      :openDirection="openDirection"
      :handle-change="handleStartDateChange"
      :handle-focus="handleStartDateFocus"
      :handle-key-down-shift-tab="handleStartDateShiftTab"
      :handle-key-down-arrow-down="handleKeyDownArrowDown"
      :handle-key-down-question-mark="handleKeyDownQuestionMark"
      :verticalSpacing="verticalSpacing"
      :small="small"
      :regular="regular"
    ></date-input>

    <div
      class="DateRangePickerInput_arrow"
      aria-hidden="true"
      role="presentation"
    >
      <slot name="custom-arrow-icon" v-if="$slots['custom-arrow-icon']"></slot>
      <arrow-left-icon v-if="!$slots['custom-arrow-icon'] && isRTL" class="DateRangePickerInput_arrow_svg"></arrow-left-icon>
      <template v-if="!$slots['custom-arrow-icon'] && small">-</template>
      <arrow-right-icon v-if="!$slots['custom-arrow-icon'] && !isRTL && !small" class="DateRangePickerInput_arrow_svg"></arrow-right-icon>
    </div>

    <date-input
      :id="endDateId"
      :placeholder="endDatePlaceholderText"
      :displayValue="endDate"
      :screenReaderMessage="screenReaderText"
      :focused="isEndDateFocused"
      :isFocused="isFocused"
      :disabled="endDateDisabled"
      :required="required"
      :readOnly="readOnly"
      :showCaret="showCaret"
      :openDirection="openDirection"
      :handle-change="handleEndDateChange"
      :handle-focus="handleEndDateFocus"
      :handle-key-down-tab="handleEndDateTab"
      :handle-key-down-arrow-down="handleKeyDownArrowDown"
      :handle-key-down-question-mark="handleKeyDownQuestionMark"
      :verticalSpacing="verticalSpacing"
      :small="small"
      :regular="regular"
    ></date-input>

    <button
      v-if="showClearDates"
      type="button"
      :aria-label="phrases.clearDates"
      class="DateRangePickerInput_clearDates DateRangePickerInput_clearDates_default"
      :class="{
        'DateRangePickerInput_clearDates__hide': !(startDate || endDate)
      }"
      @click="handleClearDates"
      :disabled="disabled"
    >
      <slot name="custom-close-icon" v-if="$slots['custom-close-icon']"></slot>
      <x-circle-icon v-else></x-circle-icon>
    </button>
    <button
      v-if="showDefaultInputIcon && iconAfter"
      class="DateRangePickerInput_calendarIcon"
      type="button"
      :disabled="disabled"
      :aria-label="phrases.focusStartDate"
      @click="handleKeyDownArrowDown"
    >
      <slot name="custom-input-icon" v-if="$slots['custom-input-icon']"></slot>
      <calendar-icon class="DateRangePickerInput_calendarIcon_svg" v-else></calendar-icon>
    </button>
  </div>
</template>

<script>
import { CalendarIcon, XCircleIcon, ArrowLeftIcon, ArrowRightIcon } from "vue-feather-icons";
import DateInput from "./date-input.vue";
import {
  START_DATE,
  END_DATE,
  ICON_BEFORE_POSITION,
  ICON_AFTER_POSITION,
  OPEN_DOWN,
  OPEN_UP
} from "../constants";
import { DateRangePickerInputPhrases } from "../phrases";

export default {
  name: "date-range-input",
  components: { DateInput, CalendarIcon, XCircleIcon, ArrowLeftIcon, ArrowRightIcon },
  props: {
    startDateId: {
      type: String,
      default: START_DATE
    },
    endDateId: {
      type: String,
      default: END_DATE
    },
    startDatePlaceholderText: {
      type: String,
      default: "Start Date"
    },
    endDatePlaceholderText: {
      type: String,
      default: "End Date"
    },
    screenReaderMessage: {
      type: String,
      default: ""
    },
    handleStartDateFocus: {
      type: Function,
      default: function() {}
    },
    handleEndDateFocus: {
      type: Function,
      default: function() {}
    },
    handleStartDateChange: {
      type: Function,
      default: function() {}
    },
    handleEndDateChange: {
      type: Function,
      default: function() {}
    },
    handleStartDateShiftTab: {
      type: Function,
      default: function() {}
    },
    handleEndDateTab: {
      type: Function,
      default: function() {}
    },
    handleClearDates: {
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

    startDate: {
      type: String,
      default: ""
    },
    endDate: {
      type: String,
      default: ""
    },

    isStartDateFocused: {
      type: Boolean,
      default: false
    },
    isEndDateFocused: {
      type: Boolean,
      default: false
    },
    showClearDates: {
      type: Boolean,
      default: false
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
  data() {
    return {
      screenReaderText: this.screenReaderMessage || this.phrases.keyboardNavigationInstructions,
      startDateDisabled: this.disabled === START_DATE || this.disabled === true,
      endDateDisabled: this.disabled === END_DATE || this.disabled === true
    };
  },
  computed: {
    iconBefore() {
      return this.inputIconPosition === ICON_BEFORE_POSITION;
    },
    iconAfter() {
      return this.inputIconPosition === ICON_AFTER_POSITION;
    }
  }
};
</script>

<style>
.DateRangePickerInput {
  background-color: white;
  display: inline-block;
}
.DateRangePickerInput__disabled {
  background: #f2f2f2;
}
.DateRangePickerInput__withBorder {
  border: 1px solid #cacccd;
}
.DateRangePickerInput__rtl {
  direction: rtl;
}
.DateRangePickerInput__block {
  display: block;
}
.DateRangePickerInput__showClearDates {
  padding-right: 30px;
}
.DateRangePickerInput_arrow {
  display: inline-block;
  vertical-align: middle;
}
.DateRangePickerInput_arrow_svg {
  vertical-align: middle;
  /* fill: #565a5c; */
  height: 24px;
  width: 24px;
}
.DateRangePickerInput_clearDates {
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  line-height: normal;
  overflow: visible;
  cursor: pointer;
  padding: 10px;
  margin: 0 10px 0 5px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.DateRangePickerInput_clearDates_default:focus,
.DateRangePickerInput_clearDates_default:hover {
  background: #dbdbdb;
  border-radius: 50%;
}
.DateRangePickerInput_clearDates__hide {
  visibility: hidden;
}
.DateRangePickerInput_clearDates_svg {
  fill: #82888a;
  height: 12px;
  width: 15px;
  vertical-align: middle;
}
.DateRangePickerInput_calendarIcon {
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  line-height: normal;
  overflow: visible;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  padding: 10px;
  margin: 0 5px 0 10px;
}
.DateRangePickerInput_calendarIcon_svg {
  fill: #82888a;
  height: 15px;
  width: 14px;
  vertical-align: middle;
}
</style>
