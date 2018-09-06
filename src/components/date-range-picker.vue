<template>
  <div
    class="DateRangePicker"
    :class="{ DateRangePicker__block: block }"
  >
    <outside-click-handler :handle-outside-click="onClearFocus">
      <date-range-input-controller
        :startDate="startDate"
        :startDateId="startDateId"
        :startDatePlaceholderText="startDatePlaceholderText"
        :isStartDateFocused="focusedInput === START_DATE && isDateRangePickerInputFocused === true"
        :endDate="endDate"
        :endDateId="endDateId"
        :endDatePlaceholderText="endDatePlaceholderText"
        :isEndDateFocused="focusedInput === END_DATE && isDateRangePickerInputFocused === true"
        :displayFormat="displayFormat"
        :showClearDates="showClearDates"
        :showCaret="!withPortal && !withFullScreenPortal && !hideFang"
        :showDefaultInputIcon="showDefaultInputIcon"
        :inputIconPosition="inputIconPosition"
        :customInputIcon="customInputIcon"
        :customArrowIcon="customArrowIcon"
        :customCloseIcon="customCloseIcon"
        :disabled="disabled"
        :required="required"
        :readOnly="readOnly"
        :openDirection="openDirection"
        :reopenPickerOnClearDates="reopenPickerOnClearDates"
        :keepOpenOnDateSelect="keepOpenOnDateSelect"
        :isOutsideRange="isOutsideRange"
        :minimumNights="minimumNights"
        :withFullScreenPortal="withFullScreenPortal"
        :onDatesChange="onDatesChange"
        :onFocusChange="onDateRangePickerInputFocus"
        :onKeyDownArrowDown="onDayPickerFocus"
        :onKeyDownQuestionMark="showKeyboardShortcutsPanel"
        :onClose="onClose"
        :phrases="phrases"
        :screenReaderMessage="screenReaderInputMessage"
        :isFocused="isDateRangePickerInputFocused"
        :isRTL="isRTL"
        :noBorder="noBorder"
        :block="block"
        :small="small"
        :regular="regular"
        :verticalSpacing="verticalSpacing"
      ></date-range-input-controller>
      <!--
        :handle-focus="onFocus"
      -->

      <div
        v-if="isDateRangePickerInputFocused && focusedInput === 'startDate' || isDateRangePickerInputFocused && focusedInput === 'endDate'"
        ref="container"
        class="DateRangePicker_picker"
        :class="containerClass"
        :style="containerStyle"
      >
        <date-range-controller
          :orientation="orientation"
          :enableOutsideDays="enableOutsideDays"
          :numberOfMonths="numberOfMonths"
          :onPrevMonthClick="onPrevMonthClick"
          :onNextMonthClick="onNextMonthClick"
          :onDatesChange="onDatesChange"
          :handleDatesChange="onDatesChange"
          :onFocusChange="onFocusChange"
          :handleFocusChange="onFocusChange"
          :onClose="onClose"
          :focusedInput="focusedInput"
          :startDate="startDate"
          :endDate="endDate"
          :monthFormat="monthFormat"
          :renderMonthText="renderMonthText"
          :withPortal="withAnyPortal"
          :daySize="daySize"
          :initialVisibleMonth="initialVisibleMonthThunk"
          :hideKeyboardShortcutsPanel="hideKeyboardShortcutsPanel"
          :navPrev="navPrev"
          :navNext="navNext"
          :minimumNights="minimumNights"
          :isOutsideRange="isOutsideRange"
          :isDayHighlighted="isDayHighlighted"
          :isDayBlocked="isDayBlocked"
          :keepOpenOnDateSelect="keepOpenOnDateSelect"
          :renderCalendarDay="renderCalendarDay"
          :renderDayContents="renderDayContents"
          :renderCalendarInfo="renderCalendarInfo"
          :renderMonthElement="renderMonthElement"
          :calendarInfoPosition="calendarInfoPosition"
          :isFocused="isDayPickerFocused"
          :showKeyboardShortcuts="showKeyboardShortcuts"
          :onBlur="onDayPickerBlur"
          :phrases="phrases"
          :dayAriaLabelFormat="dayAriaLabelFormat"
          :isRTL="isRTL"
          :firstDayOfWeek="firstDayOfWeek"
          :weekDayFormat="weekDayFormat"
          :verticalHeight="verticalHeight"
          :transitionDuration="transitionDuration"
          :disabled="disabled"
        >
          <template slot="info-panel">
            <slot name="info-panel"></slot>
          </template>
        </date-range-controller>
      </div>
    </outside-click-handler>
  </div>
</template>

<script>
import moment from "moment";
import throttle from "lodash/throttle";
import { XCircleIcon } from "vue-feather-icons";
import isTouchDevice from 'is-touch-device';
import OutsideClickHandler from "./outside-click-handler";
import DateRangeInput from "./date-range-input.vue";
import DateRangeInputController from "./date-range-input-controller.vue";
import DateRangeController from "./date-range-controller.vue";
import {
  START_DATE,
  END_DATE,
  HORIZONTAL_ORIENTATION,
  VERTICAL_ORIENTATION,
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
import {
  isTouchSupported,
  toLocalizedDateString,
  toMomentObject,
  getResponsiveContainerStyles
} from "../helpers";

export default {
  name: 'date-range-picker',
  components: {
    OutsideClickHandler,
    DateRangeInput,
    DateRangeInputController,
    DateRangeController,
    XCircleIcon
  },
  props: {
    startDateId: {
      type: String,
      default: START_DATE
    },
    endDateId: {
      type: String,
      default: END_DATE
    },
    onDatesChange: {
      type: Function,
      default: function() {}
    },


    id: {
      type: String,
      default: null
    },
    // placeholder: {
    //   type: String,
    //   default: null
    // },
    // focused: {
    //   type: Boolean,
    //   default: false
    // },
    // isInputFocused: {
    //   type: String,
    //   default: null
    // },
    // clearDate: {
    //   type: String,
    //   default: null
    // },
    // showClearDate: {
    //   type: Boolean,
    //   default: false
    // },
    // getDateString: {
    //   type: Function,
    //   default: null
    // },
    // date: {
    //   type: String,
    //   default: null
    // },
    // onChange: {
    //   type: Function,
    //   default: null
    // },
    // onFocus: {
    //   type: Function,
    //   default: null
    // },

    // required props for a functional interactive DateRangePicker
    startDate: {
      type: moment,
      default: null
    },
    endDate: {
      type: moment,
      default: null
    },
    focusedInput: {
      type: String,
      default: null
    },

    // input related props
    startDatePlaceholderText: {
      type: String,
      default: 'Start Date'
    },
    endDatePlaceholderText: {
      type: String,
      default: 'End Date'
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
    screenReaderInputMessage: {
      type: String,
      default: ''
    },
    showClearDates: {
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
    keepFocusOnInput: {
      type: Boolean,
      default: false
    },

    // calendar presentation and interaction related props
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
      type: String,
      default: null
    },
    numberOfMonths: {
      type: Number,
      default: 2
    },
    keepOpenOnDateSelect: {
      type: Boolean,
      default: false
    },
    reopenPickerOnClearDates: {
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
    firstDayOfWeek: {
      type: Number,
      default: null
    },
    verticalHeight: {
      type: String,
      default: null
    },
    transitionDuration: {
      type: String,
      default: undefined
    },
    verticalSpacing: {
      type: String,
      default: DEFAULT_VERTICAL_SPACING
    },

    // navigation related props
    navPrev: {
      type: String,
      default: null
    },
    navNext: {
      type: String,
      default: null
    },

    onPrevMonthClick: {
      type: Function,
      default: function() {}
    },
    onNextMonthClick: {
      type: Function,
      default: function() {}
    },

    onClose: {
      type: Function,
      default: function() {}
    },

    onFocusChange: {
      type: Function,
      default: function() {}
    },

    // day presentation and interaction related props
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
    isDayBlocked: {
      type: Function,
      default: function() {
        return false
      }
    },
    isOutsideRange: {
      type: Function,
      default: function(day) {
        return !isInclusivelyAfterDay(day, moment())
      }
    },
    isDayHighlighted: {
      type: Function,
      default: function() {
        return false
      }
    },

    // internationalization
    displayFormat: {
      type: Function,
      default: function() {
        return moment.localeData().longDateFormat('L')
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
    phrases: DateRangePickerPhrases,
    dayAriaLabelFormat: {
      type: String,
      default: undefined
    },
  },
  data() {
    return {
      isDateRangePickerInputFocused: false,
      isDayPickerFocused: false,
      showKeyboardShortcuts: false,
      // focusedInput: this.autoFocusEndDate ? END_DATE : START_DATE,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
      HORIZONTAL_ORIENTATION: HORIZONTAL_ORIENTATION,
      VERTICAL_ORIENTATION: VERTICAL_ORIENTATION,
      ANCHOR_LEFT: ANCHOR_LEFT,
      ANCHOR_RIGHT: ANCHOR_RIGHT,
      OPEN_DOWN: OPEN_DOWN,
      OPEN_UP: OPEN_UP,
      DAY_SIZE: DAY_SIZE,
      ICON_BEFORE_POSITION: ICON_BEFORE_POSITION,
      INFO_POSITION_BOTTOM: INFO_POSITION_BOTTOM,
      FANG_HEIGHT_PX: FANG_HEIGHT_PX,
      DEFAULT_VERTICAL_SPACING: DEFAULT_VERTICAL_SPACING,
      hideFang: this.verticalSpacing < FANG_HEIGHT_PX,
      // inputHeight: this.getInputHeight(this.reactDates, this.small),
      withAnyPortal: this.withPortal || this.withFullScreenPortal,
      initialVisibleMonthThunk: this.initialVisibleMonth || (
        () => (this.startDate || this.endDate || moment())
      )
    };
  },

  created() {
    // this.dayPickerContainerStyles = {}
    this.isDateRangePickerInputFocused = false
    this.isDayPickerFocused = false
    this.showKeyboardShortcuts = false

    this.isTouchDevice = false;
  },

  mounted() {
    // this.removeEventListener = addEventListener(
    //   window,
    //   'resize',
    //   this.responsivizePickerPosition,
    //   { passive: true },
    // );
    this.responsivizePickerPosition();
    this.disableScroll();

    const { focusedInput } = this;
    if (focusedInput) {
      // this.setState({
      //   isDateRangePickerInputFocused: true,
      // });
      this.isDateRangePickerInputFocused = true;
    }

    this.isTouchDevice = isTouchDevice();
  },

  // componentDidUpdate(prevProps) {
  //   const { focusedInput } = this.props;
  //   if (!prevProps.focusedInput && focusedInput && this.isOpened()) {
  //     // The date picker just changed from being closed to being open.
  //     this.responsivizePickerPosition();
  //     this.disableScroll();
  //   } else if (prevProps.focusedInput && !focusedInput && !this.isOpened()) {
  //     // The date picker just changed from being open to being closed.
  //     if (this.enableScroll) this.enableScroll();
  //   }
  // },

  beforeDestroy() {
    if (this.removeEventListener) this.removeEventListener();
    if (this.enableScroll) this.enableScroll();
  },

  methods: {
    
    onDateRangePickerInputFocus(focusedInput) {
      console.log('onDateRangePickerInputFocus')
      const {
        onFocusChange,
        readOnly,
        withPortal,
        withFullScreenPortal,
        keepFocusOnInput,
      } = this;

      if (focusedInput) {
        const withAnyPortal = withPortal || withFullScreenPortal;
        const moveFocusToDayPicker = withAnyPortal
          || (readOnly && !keepFocusOnInput)
          || (this.isTouchDevice && !keepFocusOnInput);

        if (moveFocusToDayPicker) {
          this.onDayPickerFocus();
        } else {
          this.onDayPickerBlur();
        }
      }

      onFocusChange(focusedInput);
    },

    onDayPickerFocus() {
      console.log('onDayPickerFocus')
      const { focusedInput, onFocusChange } = this;
      if (!focusedInput) onFocusChange(START_DATE);

      // this.setState({
      //   isDateRangePickerInputFocused: false,
      //   isDayPickerFocused: true,
      //   showKeyboardShortcuts: false,
      // });
      this.isDateRangePickerInputFocused = false;
      this.isDayPickerFocused = true;
      this.showKeyboardShortcuts = false;
    },

    onDayPickerBlur() {
      console.log('onDayPickerBlur')
      // this.setState({
      //   isDateRangePickerInputFocused: true,
      //   isDayPickerFocused: false,
      //   showKeyboardShortcuts: false,
      // });
      this.isDateRangePickerInputFocused = true;
      this.isDayPickerFocused = false;
      this.showKeyboardShortcuts = false;
    },

    onClearFocus() {
      this.isDateRangePickerInputFocused = false;
      this.isDayPickerFocused = false;
      this.showKeyboardShortcuts = false;
    },

    setDayPickerContainerRef(ref) {
      this.dayPickerContainer = ref;
    },

    setContainerRef(ref) {
      this.container = ref;
    },

    isOpened() {
      const { focusedInput } = this;
      return focusedInput === START_DATE || focusedInput === END_DATE;
    },

    disableScroll() {
      const { appendToBody, disableScroll: propDisableScroll } = this;
      if (!appendToBody && !propDisableScroll) return;
      if (!this.isOpened()) return;

      // Disable scroll for every ancestor of this DateRangePicker up to the
      // document level. This ensures the input and the picker never move. Other
      // sibling elements or the picker itself can scroll.
      this.enableScroll = disableScroll(this.container);
    },

    responsivizePickerPosition() {
      // It's possible the portal props have been changed in response to window resizes
      // So let's ensure we reset this back to the base state each time
      // this.setState({ dayPickerContainerStyles: {} });

      if (!this.isOpened()) {
        return;
      }

      const {
        openDirection,
        anchorDirection,
        horizontalMargin,
        withPortal,
        withFullScreenPortal,
        appendToBody,
      } = this;
      // const { dayPickerContainerStyles } = this.state;

      const isAnchoredLeft = anchorDirection === ANCHOR_LEFT;
      if (!withPortal && !withFullScreenPortal) {
        const containerRect = this.dayPickerContainer.getBoundingClientRect();
        const currentOffset = dayPickerContainerStyles[anchorDirection] || 0;
        const containerEdge = isAnchoredLeft
          ? containerRect[ANCHOR_RIGHT]
          : containerRect[ANCHOR_LEFT];

        // this.setState({
        //   dayPickerContainerStyles: {
        //     ...getResponsiveContainerStyles(
        //       anchorDirection,
        //       currentOffset,
        //       containerEdge,
        //       horizontalMargin,
        //     ),
        //     ...(appendToBody && getDetachedContainerStyles(
        //       openDirection,
        //       anchorDirection,
        //       this.container,
        //     )),
        //   },
        // });
      }
    },

    showKeyboardShortcutsPanel() {
      this.setState({
        isDateRangePickerInputFocused: false,
        isDayPickerFocused: true,
        showKeyboardShortcuts: true,
      });
      this.isDateRangePickerInputFocused = false;
      this.isDayPickerFocused = true;
      this.showKeyboardShortcuts = true;
    },

    maybeRenderDayPickerWithPortal() {
      const { withPortal, withFullScreenPortal, appendToBody } = this;

      if (!this.isOpened()) {
        return null;
      }

      if (withPortal || withFullScreenPortal || appendToBody) {
        return (
          <Portal>
            {this.renderDayPicker()}
          </Portal>
        );
      }

      return this.renderDayPicker();
    },

    getDateString(date) {
      const displayFormat = this.displayFormat();
      if (date && displayFormat) {
        return date && date.format(displayFormat);
      }

      return toLocalizedDateString(date);
    },
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
        DateRangePicker_picker__directionLeft: this.anchorDirection === ANCHOR_LEFT,
        DateRangePicker_picker__directionRight: this.anchorDirection === ANCHOR_RIGHT,
        DateRangePicker_picker__openDown: this.openDirection === OPEN_DOWN,
        DateRangePicker_picker__openUp: this.openDirection === OPEN_UP,
        DateRangePicker_picker__horizontal: this.orientation === HORIZONTAL_ORIENTATION,
        DateRangePicker_picker__vertical: this.orientation === VERTICAL_ORIENTATION,
        DateRangePicker_picker__rtl: this.isRTL
      };
    }
  },
}
</script>

<style>
.DateRangePicker {
  position: relative;
  display: inline-block;
}
.DateRangePicker__block {
  display: block;
}
.DateRangePicker_picker {
  z-index: 1;
  background-color: white;
  position: absolute;
}
.DateRangePicker_picker__rtl {
  direction: rtl;
}
.DateRangePicker_picker__directionLeft {
  left: 0;
}
.DateRangePicker_picker__directionRight {
  right: 0;
}
.DateRangePicker_picker__openDown {
  top: 72px;
}
.DateRangePicker_picker__openUp {
  bottom: 72px;
}
.DateRangePicker_closeButton {
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
.DateRangePicker_closeButton:hover,
.DateRangePicker_closeButton:focus {
  color: #b0b3b4;
  text-decoration: none;
}
.DateRangePicker_closeButton_svg {
  height: 15px;
  width: 15px;
  fill: #cacccd;
}
</style>
