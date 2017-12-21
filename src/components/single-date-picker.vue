<template>
  <div
    class="SingleDatePicker_picker"
  ></div>
</template>

<script>
import moment from 'moment';
import throttle from 'lodash/throttle';
import { XCircleIcon } from "vue-feather-icons";
import OutsideClickHandler from "./outside-click-handler";
import SingleDateInput from "./single-date-input.vue";
import SingleDateController from "./single-date-controller.vue";
import {
  HORIZONTAL_ORIENTATION,
  VERTICAL_ORIENTATION,
  ANCHOR_LEFT,
  OPEN_UP,
  OPEN_DOWN,
  DAY_SIZE,
  ICON_BEFORE_POSITION
} from "../constants";
import { SingleDatePickerPhrases } from "../phrases";
import { isTouchSupported } from "../helpers";

export default {
  name: 'single-date-picker',
  components: {OutsideClickHandler, SingleDateInput, SingleDateController, XCircleIcon},
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
      default: 'date'
    },
    placeholder: {
      type: String,
      default: 'Date'
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
    renderMonth: {
      type: Function
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
      default: 'MMMM YYYY'
    },
    weekDayFormat: {
      type: String,
      default: 'dd'
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
      isTouchDevice: false,
      isDayPickerFocused: false,
      isInputFocused: false,
      showKeyboardShortcuts: false
    }
  },
  methods: {
    adjustPickerPosition() {}
  },
  mounted() {
    this.isTouchDevice = isTouchSupported();
    window.addEventListener("resize", this.adjustPickerPosition, true);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.adjustPickerPosition, true);
  },
}
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
