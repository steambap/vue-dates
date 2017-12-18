<template>
  <div role="application"
    class="DayPicker"
    :class="dayPickerClass"
    :style="dayPickerStyle"
  >
    <outside-click-handler :handle-outside-click="handleOutsideClick">
      <div class="DayPicker_weekHeaders"
        :class="{DayPicker_weekHeaders__horizontal: isHorizontal}"
        aria-hidden="true"
        role="presentation"
      >
        <div
          v-for="w in weekHeaders"
          :key="w.key"
          class="DayPicker_weekHeader"
          :class="{
            'DayPicker_weekHeader__vertical': isVertical,
            'DayPicker_weekHeader__verticalScrollable': verticalScrollable
          }"
          :style="w.style"
        >
          <ul class="DayPicker_weekHeader_ul">
            <li
              v-for="day in w.header"
              :key="day.key"
              class="DayPicker_weekHeader_li"
              :style="{width: daySize + 'px'}"
            >
              <small>{{day.title}}</small>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="DayPicker_focusRegion"
        ref="container"
        @click.stop
        @keydown="throttleKeyDown"
        @mouseup="withMouseInteractions = true"
        role="region"
        tabindex="-1"
      >
        <day-picker-navigation
          v-if="!verticalScrollable"
          :handle-prev-month-click="navPrevMonthClick"
          :handle-next-month-click="navNextMonthClick"
          :orientation="orientation"
          :is-r-t-l="isRTL"
        ></day-picker-navigation>

        <div
          class="DayPicker_transitionContainer"
          :class="{
            'DayPicker_transitionContainer__horizontal': isHorizontalAndAnimating,
            'DayPicker_transitionContainer__vertical': isVertical,
            'DayPicker_transitionContainer__verticalScrollable': verticalScrollable
          }"
          :style="transitionContainerStyle"
          ref="transitionContainer"
        >
          <calendar-month-grid
            :set-calendar-month-heights="setCalendarMonthHeights"
            :transform-value="transformStyle"
            :enable-outside-days="enableOutsideDays"
            :first-visible-month-index="getFirstVisibleIndex()"
            :initial-month="currentMonth"
            :is-animating="isCalendarMonthGridAnimating"
            :modifiers="modifiers"
            :orientation="orientation"
            :number-of-months="numberOfMonths * scrollabelMonthMultiple"
            :handle-day-click="handleDayClick"
            :handle-day-mouse-enter="handleDayMouseEnter"
            :handle-day-mouse-leave="handleDayMouseLeave"
            :render-month="renderMonth"
            :render-day="renderDay"
            :handle-month-transition-end="updateDataAfterMonthTransition"
            :month-format="monthFormat"
            :day-size="daySize"
            :first-day-of-week="firstDayOfWeek"
            :is-focused="!isCalendarMonthGridAnimating && isFocused"
            :focused-date="focusedDate"
            :is-r-t-l="isRTL"
            :transition-duration="transitionDuration"
            :day-aria-label-format="dayAriaLabelFormat"
          >
          </calendar-month-grid>
          <day-picker-navigation
            v-if="verticalScrollable"
            :handle-prev-month-click="navPrevMonthClick"
            :handle-next-month-click="navNextMonthClick"
            :orientation="orientation"
            :is-r-t-l="isRTL"
          ></day-picker-navigation>
        </div>

        <day-picker-keyboard-shortcuts
          v-if="!isTouchSupported && !hideKeyboardShortcutsPanel"
          :block="isVertical && !withPortal"
          :button-location="buttonLocation"
          :show-keyboard-shortcuts-panel="showKeyboardShortcuts"
          :open-keyboard-shortcuts-panel="openKeyboardShortcutsPanel"
          :close-keyboard-shortcuts-panel="closeKeyboardShortcutsPanel"
          :phrases="phrases"
        >
        </day-picker-keyboard-shortcuts>
      </div>

      <slot name="info-panel"></slot>
    </outside-click-handler>
  </div>
</template>

<script>
import moment from "moment";
import throttle from "lodash/throttle";
import {
  HORIZONTAL_ORIENTATION,
  VERTICAL_ORIENTATION,
  VERTICAL_SCROLLABLE,
  DAY_SIZE,
  keys,
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_RIGHT
} from "../constants";
import { DayPickerPhrases } from "../phrases";
import {
  isTouchSupported,
  getCalendarMonthWidth,
  isDayVisible,
  getActiveElement
} from "../helpers";
import OutsideClickHandler from "./outside-click-handler";
import DayPickerNavigation from "./day-picker-navigation.vue";
import CalendarMonthGrid from "./calendar-month-grid.vue";
import DayPickerKeyboardShortcuts from "./day-picker-keyboard-shortcuts.vue";

const MONTH_PADDING = 23;
const DAY_PICKER_PADDING = 9;
const PREV_TRANSITION = "prev";
const NEXT_TRANSITION = "next";

export default {
  name: "day-picker",
  components: {
    OutsideClickHandler,
    DayPickerNavigation,
    CalendarMonthGrid,
    DayPickerKeyboardShortcuts
  },
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
    showKeyboardShortcutsOnInit: {
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
    },
    dayAriaLabelFormat: {
      type: String
    }
  },
  data() {
    const currentMonth = this.hidden ? moment() : this.initialVisibleMonth();
    let focusedDate = currentMonth.clone().startOf("month");
    if (this.getFirstFocusableDay) {
      focusedDate = this.getFirstFocusableDay(currentMonth);
    }

    const translationValue =
      this.isRTL && this.orientation === HORIZONTAL_ORIENTATION
        ? -getCalendarMonthWidth(this.daySize)
        : 0;

    return {
      currentMonth,
      monthTransition: null,
      translationValue,
      scrollabelMonthMultiple: 1,
      focusedDate: !this.hidden || this.isFocused ? focusedDate : null,
      nextFocusDate: null,
      showKeyboardShortcuts: this.showKeyboardShortcutsOnInit,
      onKeyboardShortcutsPanelClose: function() {},
      isTouchSupported: isTouchSupported(),
      withMouseInteractions: true,
      hasSetHeight: false,
      // Additional data that is not in react-dates
      hasSetInitialVisibleMonth: !this.hidden,
      calendarMonthGridHeight: 0
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
      return (
        this.orientation === VERTICAL_ORIENTATION ||
        this.orientation === VERTICAL_SCROLLABLE
      );
    },
    verticalScrollable() {
      return this.orientation === VERTICAL_SCROLLABLE;
    },
    horizontalWidth() {
      return (
        this.calendarMonthWidth * this.numberOfMonths + 2 * DAY_PICKER_PADDING
      );
    },
    dayPickerClass() {
      return {
        DayPicker__horizontal: this.isHorizontal,
        DayPicker__vertical: this.isVertical,
        DayPicker__verticalScrollable: this.verticalScrollable,
        DayPicker_portal__horizontal: this.isHorizontal && this.withPortal,
        DayPicker_portal__vertical: this.isVertical && this.withPortal,
        DayPicker__hidden: !this.hasSetHeight,
        DayPicker__withBorder: !this.noBorder
      };
    },
    dayPickerStyle() {
      const width = this.isHorizontal ? this.horizontalWidth + "px" : undefined;
      const marginLeft =
        this.isHorizontal && this.withPortal
          ? -this.horizontalWidth / 2 + "px"
          : undefined;
      const marginTop =
        this.isHorizontal && this.withPortal
          ? -this.calendarMonthWidth / 2 + "px"
          : undefined;

      return {
        width: width,
        marginLeft: marginLeft,
        marginTop: marginTop
      };
    },
    weekHeaders() {
      const { weekDayFormat, calendarMonthWidth, firstDayOfWeek } = this;

      const numOfWeekHeaders = this.isVertical ? 1 : this.numberOfMonths;
      const weekHeaders = [];
      for (let i = 0; i < numOfWeekHeaders; i += 1) {
        const horizontalStyle = {
          left: i * calendarMonthWidth + "px"
        };
        const verticalStyle = {
          marginLeft: -calendarMonthWidth / 2 + "px"
        };

        let weekHeaderStyle = {};
        if (this.isHorizontal) {
          weekHeaderStyle = horizontalStyle;
        } else if (this.isVertical && !this.verticalScrollable) {
          weekHeaderStyle = verticalStyle;
        }

        const dayHeader = [];
        for (let j = 0; j < 7; j++) {
          dayHeader.push({
            key: j,
            title: moment()
              .day((j + firstDayOfWeek) % 7)
              .format(weekDayFormat)
          });
        }

        weekHeaders.push({
          key: "week-" + i,
          header: dayHeader,
          style: weekHeaderStyle
        });
      }

      return weekHeaders;
    },
    isCalendarMonthGridAnimating() {
      return this.monthTransition !== null;
    },
    isHorizontalAndAnimating() {
      return this.isHorizontal && this.isCalendarMonthGridAnimating;
    },
    transitionContainerStyle() {
      let height;
      if (this.isHorizontal) {
        height = this.calendarMonthGridHeight + "px";
      } else if (
        this.isVertical &&
        !this.verticalScrollable &&
        !this.withPortal
      ) {
        height = (this.verticalHeight || 1.75 * this.calendarMonthWidth) + "px";
      }

      let width;
      if (this.isHorizontal) {
        width = this.horizontalWidth + "px";
      }

      return { width, height };
    },
    transformStyle() {
      const transformType = this.isVertical ? "translateY" : "translateX";

      return `${transformType}(${this.translationValue}px)`;
    },
    buttonLocation() {
      let loc = BOTTOM_RIGHT;
      if (this.isVertical) {
        loc = this.withPortal ? TOP_LEFT : TOP_RIGHT;
      }

      return loc;
    }
  },
  methods: {
    throttleKeyDown: throttle(function(e) {
      this.onKeyDown(e);
    }, 300),
    onKeyDown(e) {
      e.stopPropagation();
      this.withMouseInteractions = false;

      const { focusedDate, handleBlur, isRTL, showKeyboardShortcuts } = this;
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
          newFocusedDate.subtract(1, "week");
          didTransitionMonth = this.maybeTransitionPrevMonth(newFocusedDate);
          break;
        case keys.arrowLeft:
          e.preventDefault();
          if (isRTL) {
            newFocusedDate.add(1, "day");
          } else {
            newFocusedDate.subtract(1, "day");
          }
          didTransitionMonth = this.maybeTransitionPrevMonth(newFocusedDate);
          break;
        case keys.home:
          e.preventDefault();
          newFocusedDate.startOf("week");
          didTransitionMonth = this.maybeTransitionPrevMonth(newFocusedDate);
          break;
        case keys.pageUp:
          e.preventDefault();
          newFocusedDate.subtract(1, "month");
          didTransitionMonth = this.maybeTransitionPrevMonth(newFocusedDate);
          break;

        case keys.arrowDown:
          e.preventDefault();
          newFocusedDate.add(1, "week");
          didTransitionMonth = this.maybeTransitionNextMonth(newFocusedDate);
          break;
        case keys.arrowRight:
          e.preventDefault();
          if (isRTL) {
            newFocusedDate.subtract(1, "day");
          } else {
            newFocusedDate.add(1, "day");
          }
          didTransitionMonth = this.maybeTransitionNextMonth(newFocusedDate);
          break;
        case keys.end:
          e.preventDefault();
          newFocusedDate.endOf("week");
          didTransitionMonth = this.maybeTransitionNextMonth(newFocusedDate);
          break;
        case keys.pageDown:
          e.preventDefault();
          newFocusedDate.add(1, "month");
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
      // didTransitionMonth is true, the focusedDate gets updated in #updateDataAfterMonthTransition
      if (!didTransitionMonth) {
        this.focusedDate = newFocusedDate;
      }
    },
    navPrevMonthClick(e) {
      return this.onPrevMonthClick(null, e);
    },
    onPrevMonthClick(nextFocusedDate, e) {
      const { numberOfMonths, isRTL, calendarMonthWidth } = this;

      if (e) {
        e.preventDefault();
      }

      let translationValue = this.isVertical
        ? this.calendarMonthHeights[0]
        : calendarMonthWidth;

      if (this.isHorizontal) {
        if (isRTL) {
          translationValue = -2 * calendarMonthWidth;
        }

        const newMonthHeight = Math.max(
          0,
          ...this.calendarMonthHeights.slice(0, numberOfMonths)
        );
        this.adjustDayPickerHeight(newMonthHeight);
      }

      this.monthTransition = PREV_TRANSITION;
      this.translationValue = translationValue;
      this.focusedDate = null;
      this.nextFocusedDate = nextFocusedDate;
    },
    navNextMonthClick(e) {
      if (this.orientation === VERTICAL_SCROLLABLE) {
        this.multiScrollableMonths();
      } else {
        this.onNextMonthClick(null, e);
      }
    },
    onNextMonthClick(nextFocusedDate, e) {
      const { numberOfMonths, isRTL, calendarMonthWidth } = this;

      if (e) {
        e.preventDefault();
      }

      let translationValue = this.isVertical
        ? -this.calendarMonthHeights[1]
        : -calendarMonthWidth;

      if (this.isHorizontal) {
        if (isRTL) {
          translationValue = 0;
        }

        const newMonthHeight = Math.max(
          0,
          ...this.calendarMonthHeights.slice(2)
        );
        this.adjustDayPickerHeight(newMonthHeight);
      }

      this.monthTransition = NEXT_TRANSITION;
      this.translationValue = translationValue;
      this.focusedDate = null;
      this.nextFocusedDate = nextFocusedDate;
    },
    getFirstVisibleIndex() {
      const { orientation, monthTransition } = this;

      if (orientation === VERTICAL_SCROLLABLE) {
        return 0;
      }

      let firstVisibleMonthIndex = 1;
      if (monthTransition === PREV_TRANSITION) {
        firstVisibleMonthIndex -= 1;
      } else if (monthTransition === NEXT_TRANSITION) {
        firstVisibleMonthIndex += 1;
      }

      return firstVisibleMonthIndex;
    },
    multiScrollableMonths(e) {
      const { handleMultiScrollableMonths } = this;
      if (e) {
        e.preventDefault();
      }

      if (handleMultiScrollableMonths) {
        handleMultiScrollableMonths(e);
      }

      this.scrollabelMonthMultiple = this.scrollabelMonthMultiple + 1;
    },
    updateDataAfterMonthTransition() {
      const {
        handlePrevMonthClick,
        handleNextMonthClick,
        currentMonth,
        monthTransition,
        focusedDate,
        nextFocusedDate,
        withMouseInteractions,
        calendarMonthWidth
      } = this;

      if (!monthTransition) {
        return;
      }

      const newMonth = currentMonth.clone();
      if (monthTransition === PREV_TRANSITION) {
        if (handlePrevMonthClick) {
          handlePrevMonthClick();
        }
        newMonth.subtract(1, "month");
      } else if (monthTransition === NEXT_TRANSITION) {
        if (handleNextMonthClick) {
          handleNextMonthClick();
        }
        newMonth.add(1, "month");
      }

      let newFocusedDate = null;
      if (nextFocusedDate) {
        newFocusedDate = nextFocusedDate;
      } else if (!focusedDate && !withMouseInteractions) {
        newFocusedDate = this.getFocusedDay(newMonth);
      }

      this.currentMonth = newMonth;
      this.monthTransition = null;
      this.translationValue =
        this.isRTL && this.isHorizontal ? -calendarMonthWidth : 0;
      this.nextFocusedDate = null;
      this.focusedDate = newFocusedDate;
      // We don't want to focus on the relevant calendar day after a month transition
      // if the user is navigating around using a mouse
      this.$nextTick(() => {
        if (withMouseInteractions) {
          const activeElm = getActiveElement();
          if (activeElm && activeElm !== document.body) {
            activeElm.blur();
          }
        }
      });
    },
    openKeyboardShortcutsPanel(onCloseCallback) {
      this.showKeyboardShortcuts = true;
      this.onKeyboardShortcutsPanelClose = onCloseCallback;
    },
    closeKeyboardShortcutsPanel() {
      const { onKeyboardShortcutsPanelClose } = this;
      if (onKeyboardShortcutsPanelClose) {
        onKeyboardShortcutsPanelClose();
      }

      this.onKeyboardShortcutsPanelClose = null;
      this.showKeyboardShortcuts = false;
    },
    setCalendarMonthHeights(calendarMonthHeights) {
      const firstVisibleMonthIndex = this.getFirstVisibleIndex();
      const lastVisibleMonthIndex =
        firstVisibleMonthIndex + this.numberOfMonths;

      this.calendarMonthHeights = calendarMonthHeights;
      const visibleCalendarMonthHeights = calendarMonthHeights.filter(
        (_, i) => i >= firstVisibleMonthIndex && i < lastVisibleMonthIndex
      );
      this.calendarMonthGridHeight =
        Math.max(0, ...visibleCalendarMonthHeights) + MONTH_PADDING;
      this.hasSetHeight = true;
    },
    getFocusedDay(newMonth) {
      const { getFirstFocusableDay, numberOfMonths } = this;

      let focusedDate;
      if (getFirstFocusableDay) {
        focusedDate = getFirstFocusableDay(newMonth);
      }

      if (
        newMonth &&
        (!focusedDate || !isDayVisible(focusedDate, newMonth, numberOfMonths))
      ) {
        focusedDate = newMonth.clone().startOf("month");
      }

      return focusedDate;
    },
    maybeTransitionNextMonth(newFocusedDate) {
      const { numberOfMonths, currentMonth, focusedDate } = this;

      const newFocusedMonth = newFocusedDate.month();
      const focusedDateMonth = focusedDate.month();
      const isNewDateVisible = isDayVisible(
        newFocusedDate,
        currentMonth,
        numberOfMonths
      );
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
      const isNewDateVisible = isDayVisible(
        newFocusedDate,
        currentMonth,
        numberOfMonths
      );
      if (newFocusedMonth !== focusedDateMonth && !isNewDateVisible) {
        this.onPrevMonthClick(newFocusedDate);

        return true;
      }

      return false;
    },
    adjustDayPickerHeight(newMonthHeight) {
      const monthHeight = newMonthHeight + MONTH_PADDING;
      this.calendarMonthGridHeight = monthHeight;
    }
  },
  beforeCreate() {
    this.calendarMonthHeights = [];
  },
  mounted() {
    this.isTouchSupported = isTouchSupported();
  },
  updated() {
    if (this.isFocused && !this.focusedDate) {
      this.$refs.container.focus();
    }
  },
  watch: {
    hidden(newVal) {
      if (!newVal) {
        if (!this.hasSetInitialVisibleMonth) {
          this.hasSetInitialVisibleMonth = true;
          this.currentMonth = this.initialVisibleMonth();
        }
      }
    },
    isFocused(newVal, oldVal) {
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
}
.DayPicker__verticalScrollable {
  height: 100%;
}
.DayPicker__hidden {
  visibility: hidden;
}
.DayPicker__withBorder {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.07);
  border-radius: 3px;
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
