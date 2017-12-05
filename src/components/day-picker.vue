<template>
  <div role="application" class="DayPicker">

  </div>
</template>

<script>
import moment from "moment";
import {
  HORIZONTAL_ORIENTATION,
  VERTICAL_ORIENTATION,
  VERTICAL_SCROLLABLE,
  DAY_SIZE,
  keys
} from "../constants";
import { DayPickerPhrases } from "../phrases";
import { isTouchSupported, getCalendarMonthWidth, isDayVisible, getActiveElement } from "../helpers";

const MONTH_PADDING = 23;
const DAY_PICKER_PADDING = 9;
const PREV_TRANSITION = 'prev';
const NEXT_TRANSITION = 'next';

export default {
  name: "day-picker",
  components: {},
  props: {
    enableOutsideDays: {
      type: Boolean,
      default: false
    },
    numberOfMonths: {
      type: Number,
      default: 2
    },
    orientation: {
      type: String,
      default: HORIZONTAL_ORIENTATION
    },
    withPortal: {
      type: Boolean,
      default: false
    },
    handleOutsideClick: {
      type: Function,
      default: function() {}
    },
    hidden: {
      type: Boolean,
      default: false
    },
    initialVisibleMonth: {
      type: Function,
      default: function() {
        return moment();
      }
    },
    firstDayOfWeek: {
      type: Number,
      default: moment.localeData().firstDayOfWeek()
    },
    renderCalendarInfo: {
      type: Function,
      default: null
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
    noBorder: {
      type: Boolean,
      default: false
    },
    transitionDuration: {
      type: Number,
      default: undefined
    },

    // Navigation props
    // navPrev and navNext
    handlePrevMonthClick: {
      type: Function,
      default: function() {}
    },
    handleNextMonthClick: {
      type: Function,
      default: function() {}
    },
    handleMultiScrollableMonths: {
      type: Function,
      default: function() {}
    },
    // Month props
    renderMonth: {
      type: Function,
      default: null
    },
    // Day props
    modifiers: {
      type: Object,
      default: function() {
        return {};
      }
    },
    renderDay: {
      type: Function,
      default: null
    },
    handleDayClick: {
      type: Function,
      default: function() {}
    },
    handleDayMouseEnter: {
      type: Function,
      default: function() {}
    },
    handleDayMouseLeave: {
      type: Function,
      default: function() {}
    },
    // Accessibility props
    isFocused: {
      type: Boolean,
      default: false
    },
    getFirstFocusableDay: {
      type: Function,
      default: null
    },
    handleBlur: {
      type: Function,
      default: function() {}
    },
    showKeyboardShortcuts: {
      type: Boolean,
      default: false
    },
    // Internationalization
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
        return DayPickerPhrases;
      }
    }
  },
  data() {
    const currentMonth = this.hidden ? moment() : this.initialVisibleMonth();
    let focusedDate = currentMonth.clone().startOf('month');
    if (this.getFirstFocusableDay) {
      focusedDate = this.getFirstFocusableDay(currentMonth);
    }

    const translationValue = this.isRTL && (this.orientation === HORIZONTAL_ORIENTATION)
    ? -getCalendarMonthWidth(this.daySize)
    : 0;

    return {
      currentMonth,
      monthTransition: null,
      translationValue,
      scrollabelMonthMultiple: 1,
      focusedDate: (!this.hidden || this.isFocused) ? focusedDate : null,
      nextFocusDate: null,
      onKeyboardShortcutsPanelClose: function() {},
      isTouchSupported: isTouchSupported(),
      withMouseInteractions: true,
      hasSetHeight: false,
      // Additional data that is not in react-dates
      hasSetInitialVisibleMonth: !this.hidden
    };
  },
  computed: {
    calendarMonthWidth() {
      return getCalendarMonthWidth(this.daySize);
    },
    isHorizontal() {
      return this.orientation === HORIZONTAL_ORIENTATION;
    },
    isVertical() {
      return this.orientation === VERTICAL_ORIENTATION;
    }
  },
  methods: {
    onKeyDown(e) {
      e.stopPropagation();
      this.withMouseInteractions = false;

      const {focusedDate, handleBlur, isRTL, showKeyboardShortcuts} = this;
      if (!focusedDate) {
        return;
      }

      const newFocusedDate = focusedDate.clone();

      let didTransitionMonth = false;

      // Focus might be anywhere when the keyboard shortcuts panel is opened so we want to
      // return it to wherever it was before when the panel was opened
      const activeElm = getActiveElement();
      const onKeyboardShortcutsPanelClose = () => {
        if (activeElm) {
          activeElm.focus();
        }
      };

      switch (e.keyCode) {
        case keys.arrowUp:
          e.preventDefault();
          newFocusedDate.subtract(1, 'week');
          didTransitionMonth = this.maybeTransitionPrevMonth(newFocusedDate);
          break;
        case keys.arrowLeft:
          e.preventDefault();
          if (isRTL) {
            newFocusedDate.add(1, 'day');
          } else {
            newFocusedDate.subtract(1, 'day');
          }
          didTransitionMonth = this.maybeTransitionPrevMonth(newFocusedDate);
          break;
        case keys.home:
          e.preventDefault();
          newFocusedDate.startOf('week');
          didTransitionMonth = this.maybeTransitionPrevMonth(newFocusedDate);
          break;
        case keys.pageUp:
          e.preventDefault();
          newFocusedDate.subtract(1, 'month');
          didTransitionMonth = this.maybeTransitionPrevMonth(newFocusedDate);
          break;

        case keys.arrowDown:
          e.preventDefault();
          newFocusedDate.add(1, 'week');
          didTransitionMonth = this.maybeTransitionNextMonth(newFocusedDate);
          break;
        case keys.arrowRight:
          e.preventDefault();
          if (isRTL) {
            newFocusedDate.subtract(1, 'day');
          } else {
            newFocusedDate.add(1, 'day');
          }
          didTransitionMonth = this.maybeTransitionNextMonth(newFocusedDate);
          break;
        case keys.end:
          e.preventDefault();
          newFocusedDate.endOf('week');
          didTransitionMonth = this.maybeTransitionNextMonth(newFocusedDate);
          break;
        case keys.pageDown:
          e.preventDefault();
          newFocusedDate.add(1, 'month');
          didTransitionMonth = this.maybeTransitionNextMonth(newFocusedDate);
          break;

        case keys.question:
          this.openKeyboardShortcutsPanel(onKeyboardShortcutsPanelClose);
          break;

        case keys.esc:
          if (showKeyboardShortcuts) {
            this.closeKeyboardShortcutsPanel();
          } else {
            handleBlur();
          }
          break;
      
        default:
          break;
      }

      // If there was a month transition, do not update the focused date until the transition has
      // completed. Otherwise, attempting to focus on a DOM node may interrupt the CSS animation. If
      // didTransitionMonth is true, the focusedDate gets updated in #updateStateAfterMonthTransition
      if (!didTransitionMonth) {
        this.focusedDate = newFocusedDate;
      }
    },
    onPrevMonthClick(nextFocusedDate, e) {
      const { numberOfMonths, isRTL, calendarMonthWidth } = this;

      if (e) {
        e.preventDefault();
      }

      let translationValue = this.isVertical ? this.calendarMonthHeights[0] : calendarMonthWidth;

      if (this.isHorizontal) {
        if (isRTL) {
          translationValue = -2 * calendarMonthWidth;
        }

        const newMonthHeight = Math.max(0, ...this.calendarMonthHeights.slice(0, numberOfMonths));
        this.adjustDayPickerHeight(newMonthHeight);
      }

      this.monthTransition = PREV_TRANSITION;
      this.translationValue = translationValue;
      this.focusedDate = null;
      this.nextFocusedDate = nextFocusedDate;
    },
    onNextMonthClick() {},
    multiScrollableMonths() {},
    updateDataAfterMonthTransition() {},
    openKeyboardShortcutsPanel() {},
    closeKeyboardShortcutsPanel() {},
    setCalendarMonthHeights() {},
    getFocusedDay(newMonth) {
      const {getFirstFocusableDay, numberOfMonths} = this;

      let focusedDate;
      if (getFirstFocusableDay) {
        focusedDate = getFirstFocusableDay(newMonth);
      }

      if (newMonth && (!focusedDate || !isDayVisible(focusedDate, newMonth, numberOfMonths))) {
        focusedDate = newMonth.clone().startOf('month');
      }

      return focusedDate;
    },
    maybeTransitionNextMonth(newFocusedDate) {
      const { numberOfMonths, currentMonth, focusedDate } = this;

      const newFocusedMonth = newFocusedDate.month();
      const focusedDateMonth = focusedDate.month();
      const isNewDateVisible = isDayVisible(newFocusedDate, currentMonth, numberOfMonths);
      if (newFocusedMonth !== focusedDateMonth && !isNewDateVisible) {
        this.onNextMonthClick(newFocusedDate);

        return true;
      }

      return false;
    },
    maybeTransitionPrevMonth(newFocusedDate) {
      const { numberOfMonths, currentMonth, focusedDate } = this;

      const newFocusedMonth = newFocusedDate.month();
      const focusedDateMonth = focusedDate.month();
      const isNewDateVisible = isDayVisible(newFocusedDate, currentMonth, numberOfMonths);
      if (newFocusedMonth !== focusedDateMonth && !isNewDateVisible) {
        this.onPrevMonthClick(newFocusedDate);

        return true;
      }

      return false;
    },
    adjustDayPickerHeight(newMonthHeight) {
      const monthHeight = newMonthHeight + MONTH_PADDING;
      if (monthHeight !== this.calendarMonthGridHeight) {
        this.calendarMonthGridHeight = monthHeight;
        this.$ref.container.style.height = `${monthHeight}px`;
      }
    }
  },
  beforeCreate() {
    this.calendarMonthHeights = [];
    this.calendarMonthGridHeight = 0;
  },
  mounted() {
    this.isTouchSupported = isTouchSupported();
  },
  updated() {
    if (this.isFocused && !this.focusedDate) {
      this.$ref.container.focus();
    }
  },
  watch: {
    hidden(oldVal, newVal) {
      if (!newVal) {
        if (!this.hasSetInitialVisibleMonth) {
          this.hasSetInitialVisibleMonth = true;
          this.currentMonth = this.initialVisibleMonth();
        }
      }
    },
    isFocused(oldVal, newVal) {
      if (oldVal !== newVal) {
        if (newVal) {
          this.focusedDate = this.getFocusedDay(this.currentMonth);

          if (this.showKeyboardShortcuts) {
            this.onKeyboardShortcutsPanelClose = this.handleBlur;
          }
          this.withMouseInteractions = false;

        } else {
          this.focusedDate = null;
        }
      }
    }
  }
};
</script>

<style>
.DayPicker {
  background: #fff;
  position: relative;
  text-align: left;
}
.DayPicker__horizontal {
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.07);
  border-radius: 3px;
}
.DayPicker__verticalScrollable {
  height: 100%;
}
.DayPicker__hidden {
  visibility: hidden;
}
.DayPicker_portal__horizontal {
  box-shadow: none;
  position: absolute;
  left: 50%;
  top: 50%;
}
.DayPicker_portal__vertical {
  position: initial;
}
.DayPicker_focusRegion {
  outline: none;
}
.DayPicker_weekHeaders {
  position: relative;
}
.DayPicker_weekHeaders__horizontal {
  margin-left: 9px;
}
.DayPicker_weekHeader {
  color: #757575;
  position: absolute;
  top: 62px;
  z-index: 2;
  padding: 0 13px;
  text-align: left;
}
.DayPicker_weekHeader__vertical {
  left: 50%;
}
.DayPicker_weekHeader__verticalScrollable {
  top: 0;
  display: table-row;
  border-bottom: 1px solid #dbdbdb;
  background: #fff;
  margin-left: 0;
  left: 0;
  width: 100%;
  text-align: center;
}
.DayPicker_weekHeader_ul {
  list-style: none;
  margin: 1px 0;
  padding-left: 0;
  padding-right: 0;
}
.DayPicker_weekHeader_li {
  display: inline-block;
  text-align: center;
}
.DayPicker_transitionContainer {
  position: relative;
  overflow: hidden;
  border-radius: 3px;
}
.DayPicker_transitionContainer__horizontal {
  transition: height 0.2s ease-in-out;
}
.DayPicker_transitionContainer__vertical {
  width: 100%;
}
.DayPicker_transitionContainer__verticalScrollable {
  padding-top: 20px;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow-y: scroll;
}
</style>
