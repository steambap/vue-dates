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
      <calendar-icon class="DateRangePickerInput_calendarIcon_svg"></calendar-icon>
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
      :onChange="onStartDateChange"
      :handleFocus="onStartDateFocus"
      :onKeyDownShiftTab="onStartDateShiftTab"
      :onKeyDownArrowDown="onKeyDownArrowDown"
      :onKeyDownQuestionMark="onKeyDownQuestionMark"
      :verticalSpacing="verticalSpacing"
      :small="small"
      :regular="regular"
    ></date-input>

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
      :onChange="onEndDateChange"
      :handleFocus="onEndDateFocus"
      :onKeyDownTab="onEndDateTab"
      :onKeyDownArrowDown="onKeyDownArrowDown"
      :onKeyDownQuestionMark="onKeyDownQuestionMark"
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
      <x-circle-icon></x-circle-icon>
    </button>
    <button
      v-if="showDefaultInputIcon && iconAfter"
      class="DateRangePickerInput_calendarIcon"
      type="button"
      :disabled="disabled"
      :aria-label="phrases.focusStartDate"
      @click="handleKeyDownArrowDown"
    >
      <calendar-icon class="DateRangePickerInput_calendarIcon_svg"></calendar-icon>
    </button>
  </div>
</template>

<script>
import { CalendarIcon, XCircleIcon } from "vue-feather-icons";
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
  components: { DateInput, CalendarIcon, XCircleIcon },
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
      default: 'Start Date'
    },
    endDatePlaceholderText: {
      type: String,
      default: 'End Date'
    },
    screenReaderMessage: {
      type: String,
      default: ''
    },
    onStartDateFocus: {
      type: Function,
      default: function() {}
    },
    onEndDateFocus: {
      type: Function,
      default: function() {}
    },
    onStartDateChange: {
      type: Function,
      default: function() {}
    },
    onEndDateChange: {
      type: Function,
      default: function() {}
    },
    onStartDateShiftTab: {
      type: Function,
      default: function() {}
    },
    onEndDateTab: {
      type: Function,
      default: function() {}
    },
    onClearDates: {
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

    startDate: {
      type: String,
      default: ''
    },
    endDate: {
      type: String,
      default: ''
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
      default: DateRangePickerInputPhrases
    },

    isRTL: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      screenReaderText: this.screenReaderMessage || this.phrases.keyboardNavigationInstructions,
      startDateDisabled: this.disabled === START_DATE || this.disabled === true,
      endDateDisabled: this.disabled === END_DATE || this.disabled === true
    }
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
  fill: #565a5c;
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
