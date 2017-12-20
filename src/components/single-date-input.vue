<template>
  <div
    class="SingleDatePickerInput"
    :class="{
      'SingleDatePickerInput__disabled': disabled,
      'SingleDatePickerInput__rtl': isRTL,
      'SingleDatePickerInput__withBorder': !noBorder,
      'SingleDatePickerInput__block': block,
      'SingleDatePickerInput__showClearDate': showClearDate
    }"
  >
    <button
      v-if="showDefaultInputIcon && iconBefore"
      class="SingleDatePickerInput_calendarIcon"
      type="button"
      :disabled="disabled"
      :aria-label="phrases.focusStartDate"
      @click="handleFocus"
    >
      <calendar-icon class="SingleDatePickerInput_calendarIcon_svg"></calendar-icon>
    </button>
    <date-input
      :id="id"
      :placeholder="placeholder"
      :display-value="displayValue"
      :screen-reader-message="screenReaderMessage || phrases.keyboardNavigationInstructions"
      :focused="focused"
      :is-focused="isFocused"
      :disabled="disabled"
      :required="required"
      :read-only="readOnly"
      :show-caret="showCaret"
      :handle-change="handleChange"
      :handle-focus="handleFocus"
      :handle-key-down-shift-tab="handleKeyDownShiftTab"
      :handle-key-down-tab="handleKeyDownTab"
      :handle-key-down-arrow-down="handleKeyDownArrowDown"
      :handle-key-down-question-mark="handleKeyDownQuestionMark"
      :open-direction="openDirection"
    ></date-input>
    <button
      v-if="showClearDate"
      class="SingleDatePickerInput_clearDate SingleDatePickerInput_clearDate__default"
      :class="{
        'SingleDatePickerInput_clearDate__hide': !displayValue
      }"
      type="button"
      :aria-label="phrases.clearDate"
      :disabled="disabled"
      @click="handleClearDate"
    >
      <x-circle-icon class="SingleDatePickerInput_clearDate_svg"></x-circle-icon>
    </button>
    <button
      v-if="showDefaultInputIcon && iconAfter"
      class="SingleDatePickerInput_calendarIcon"
      type="button"
      :disabled="disabled"
      :aria-label="phrases.focusStartDate"
      @click="handleFocus"
    >
      <calendar-icon class="SingleDatePickerInput_calendarIcon_svg"></calendar-icon>
    </button>
  </div>
</template>

<script>
import { CalendarIcon, XCircleIcon } from "vue-feather-icons";
import DateInput from "./date-input.vue";
import {
  ICON_BEFORE_POSITION,
  ICON_AFTER_POSITION,
  OPEN_DOWN,
  OPEN_UP
} from "../constants";
import { SingleDatePickerInputPhrases } from "../phrases";

export default {
  name: "single-date-input",
  components: { DateInput, CalendarIcon, XCircleIcon },
  props: {
    id: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: "Select Date"
    },
    displayValue: {
      type: String,
      default: ""
    },
    screenReaderMessage: {
      type: String,
      default: ""
    },
    focused: {
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
      default: null
    },
    openDirection: {
      type: String,
      default: OPEN_DOWN
    },
    showCaret: {
      type: Boolean,
      default: false
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
    isRTL: {
      type: Boolean,
      default: false
    },
    noBorder: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    handleChange: {
      type: Function,
      default: function() {}
    },
    handleClearDate: {
      type: Function,
      default: function() {}
    },
    handleFocus: {
      type: Function,
      default: function() {}
    },
    handleKeyDownShiftTab: {
      type: Function,
      default: function() {}
    },
    handleKeyDownTab: {
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
    isFocused: {
      type: Boolean,
      default: false
    },
    phrases: {
      type: Object,
      default: function() {
        return SingleDatePickerInputPhrases;
      }
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
.SingleDatePickerInput {
  display: inline-block;
  background: white;
}
.SingleDatePickerInput__withBorder {
  border: 1px solid #dbdbdb;
}
.SingleDatePickerInput__rtl {
  direction: rtl;
}
.SingleDatePickerInput__disabled {
  background-color: #f2f2f2;
}
.SingleDatePickerInput__block {
  display: block;
}
.SingleDatePickerInput__showClearDate {
  padding-right: 30px;
}
.SingleDatePickerInput_clearDate {
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
.SingleDatePickerInput_clearDate__default:focus,
.SingleDatePickerInput_clearDate__default:hover {
  background: #dbdbdb;
  border-radius: 50%;
}
.SingleDatePickerInput_clearDate__hide {
  fill: #82888a;
  height: 12px;
  width: 15px;
  vertical-align: middle;
}
.SingleDatePickerInput_calendarIcon {
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
.SingleDatePickerInput_calendarIcon_svg {
  fill: #82888a;
  height: 12px;
  width: 15px;
  vertical-align: middle;
}
</style>
