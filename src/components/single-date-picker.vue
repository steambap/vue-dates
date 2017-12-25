<template>
  <div
    class="SingleDatePicker"
    :class="{ SingleDatePicker__block: block }"
  >
    <outside-click-handler :handle-outside-click="onClearFocus">
      <single-date-input
        :id="id"
        :placeholder="placeholder"
        :focused="focused"
        :is-focused="isInputFocused"
        :disabled="disabled"
        :required="required"
        :read-only="readOnly"
        :open-direction="openDirection"
        :show-caret="true"
        :handle-clear-date="clearDate"
        :show-clear-date="showClearDate"
        :show-default-input-icon="showDefaultInputIcon"
        :input-icon-position="inputIconPosition"
        :display-value="getDateString(date)"
        :handle-change="onChange"
        :handle-focus="onFocus"
        :handle-key-down-shift-tab="onClearFocus"
        :handle-key-down-tab="onClearFocus"
        :handle-key-down-arrow-down="onDayPickerFocus"
        :handle-key-down-question-mark="showKeyboardShortcutsPanel"
        :screen-reader-message="screenReaderInputMessage"
        :phrases="phrases"
        :is-r-t-l="isRTL"
        :no-border="noBorder"
        :block="block"
      ></single-date-input>

      <div
        ref="container"
        v-show="focused"
        class="SingleDatePicker_picker"
        :class="containerClass"
        :style="containerStyle"
      >
        <single-date-controller
          :date="date"
          :handle-date-change="handleDateChange"
          :handle-focus-change="handleFocusChange"
          :orientation="orientation"
          :enable-outside-days="enableOutsideDays"
          :number-of-months="numberOfMonths"
          :month-format="monthFormat"
          :focused="focused"
          :keep-open-on-date-select="keepOpenOnDateSelect"
          :hide-keyboard-shortcuts-panel="hideKeyboardShortcutsPanel"
          :initial-visible-month="initialVisibleMonth"
          :handle-close="handleClose"
          :render-month="renderMonth"
          :render-day="renderDay"
          :is-focused="isDayPickerFocused"
          :show-keyboard-shortcuts-on-init="showKeyboardShortcuts"
          :handle-blur="onDayPickerBlur"
          :phrases="phrases"
          :day-size="daySize"
          :is-r-t-l="isRTL"
          :is-outside-range="isOutsideRange"
          :is-day-highlighted="isDayHighlighted"
          :is-day-blocked="isDayBlocked"
          :first-day-of-week="firstDayOfWeek"
          :week-day-format="weekDayFormat"
          :vertical-height="verticalHeight"
          :transition-duration="transitionDuration"
        >
          <template slot="info-panel">
            <slot name="info-panel"></slot>
          </template>
        </single-date-controller>
      </div>
    </outside-click-handler>
  </div>
</template>

<script>
import moment from "moment";
import throttle from "lodash/throttle";
import { XCircleIcon } from "vue-feather-icons";
import OutsideClickHandler from "./outside-click-handler";
import SingleDateInput from "./single-date-input.vue";
import SingleDateController from "./single-date-controller.vue";
import {
  HORIZONTAL_ORIENTATION,
  VERTICAL_ORIENTATION,
  ANCHOR_LEFT,
  ANCHOR_RIGHT,
  OPEN_UP,
  OPEN_DOWN,
  DAY_SIZE,
  ICON_BEFORE_POSITION
} from "../constants";
import { SingleDatePickerPhrases } from "../phrases";
import {
  isTouchSupported,
  toLocalizedDateString,
  toMomentObject,
  getResponsiveContainerStyles
} from "../helpers";

export default {
  name: "single-date-picker",
  components: {
    OutsideClickHandler,
    SingleDateInput,
    SingleDateController,
    XCircleIcon
  },
  props: {
    date: {
      type: moment,
      default: null
    },
    handleDateChange: {
      type: Function,
      required: true
    },
    focused: {
      type: Boolean,
      default: false
    },
    handleFocusChange: {
      type: Function,
      required: true
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
      type: Object,
      default: function() {
        return SingleDatePickerPhrases;
      }
    }
  },
  data() {
    return {
      isTouchSupported: false,
      isDayPickerFocused: false,
      isInputFocused: false,
      showKeyboardShortcuts: false
    };
  },
  computed: {
    containerStyle() {
      const { anchorDirection, horizontalMargin } = this;
      const ctnr = this.$refs.container;
      if (!ctnr) {
        return {};
      }

      const containerRect = ctnr.getBoundingClientRect();
      const containerEdge =
        anchorDirection === ANCHOR_LEFT
          ? containerRect[ANCHOR_RIGHT]
          : containerRect[ANCHOR_LEFT];

      return getResponsiveContainerStyles(
        anchorDirection,
        0,
        containerEdge,
        horizontalMargin
      );
    },
    containerClass() {
      return {
        SingleDatePicker_picker__directionLeft: this.anchorDirection === ANCHOR_LEFT,
        SingleDatePicker_picker__directionRight: this.anchorDirection === ANCHOR_RIGHT,
        SingleDatePicker_picker__openDown: this.openDirection === OPEN_DOWN,
        SingleDatePicker_picker__openUp: this.openDirection === OPEN_UP,
        SingleDatePicker_picker__horizontal: this.orientation === HORIZONTAL_ORIENTATION,
        SingleDatePicker_picker__vertical: this.orientation === VERTICAL_ORIENTATION,
        SingleDatePicker_picker__rtl: this.isRTL
      };
    }
  },
  methods: {
    onChange(dateString) {
      const {
        isOutsideRange,
        keepOpenOnDateSelect,
        handleDateChange,
        handleFocusChange,
        handleClose
      } = this;
      const newDate = toMomentObject(dateString, this.displayFormat());

      const isValid = newDate && !isOutsideRange(newDate);
      if (isValid) {
        handleDateChange(newDate);
        if (!keepOpenOnDateSelect) {
          handleFocusChange({ focused: false });
          handleClose({ date: newDate });
        }
      } else {
        handleDateChange(null);
      }
    },
    onFocus() {
      const { disabled, handleFocusChange, isTouchSupported } = this;
      if (isTouchSupported) {
        this.onDayPickerFocus();
      } else {
        this.onDayPickerBlur();
      }

      if (!disabled) {
        handleFocusChange({ focused: true });
      }
    },
    onClearFocus() {
      const { date, focused, handleFocusChange, handleClose } = this;
      if (!focused) {
        return;
      }

      this.isInputFocused = false;
      this.isDayPickerFocused = false;

      handleFocusChange({ focused: false });
      handleClose({ date });
    },
    onDayPickerFocus() {
      this.isInputFocused = false;
      this.isDayPickerFocused = true;
      this.showKeyboardShortcuts = false;
    },
    onDayPickerBlur() {
      this.isInputFocused = true;
      this.isDayPickerFocused = false;
      this.showKeyboardShortcuts = false;
    },
    getDateString(date) {
      const displayFormat = this.displayFormat();
      if (date && displayFormat) {
        return date && date.format(displayFormat);
      }

      return toLocalizedDateString(date);
    },
    clearDate() {
      this.handleDateChange(null);
      if (this.reopenPickerOnClearDate) {
        this.handleFocusChange({ focused: true });
      }
    },
    showKeyboardShortcutsPanel() {
      this.isInputFocused = false;
      this.isDayPickerFocused = true;
      this.showKeyboardShortcuts = true;
    }
  },
  mounted() {
    this.isTouchSupported = isTouchSupported();
    if (this.focused) {
      this.isInputFocused = true;
    }
  }
};
</script>

<style>
.SingleDatePicker {
  position: relative;
  display: inline-block;
}
.SingleDatePicker__block {
  display: block;
}
.SingleDatePicker_picker {
  z-index: 1;
  background-color: white;
  position: absolute;
}
.SingleDatePicker_picker__rtl {
  direction: rtl;
}
.SingleDatePicker_picker__directionLeft {
  left: 0;
}
.SingleDatePicker_picker__directionRight {
  right: 0;
}
.SingleDatePicker_picker__openDown {
  top: 72px;
}
.SingleDatePicker_picker__openUp {
  bottom: 72px;
}
.SingleDatePicker_picker__portal {
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
.SingleDatePicker_picker__fullScreenPortal {
  background-color: white;
}
.SingleDatePicker_closeButton {
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  line-height: normal;
  overflow: visible;
  cursor: pointer;

  position: absolute;
  top: 0;
  right: 0;
  padding: 15px;
  z-index: 2;
}
.SingleDatePicker_closeButton:hover,
.SingleDatePicker_closeButton:focus {
  color: #b0b3b4;
  text-decoration: none;
}
.SingleDatePicker_closeButton_svg {
  height: 15px;
  width: 15px;
  fill: #cacccd;
}
</style>
