<template>
  <day-picker
    :orientation="orientation"
    :enable-outside-days="enableOutsideDays"
    :modifiers="visibleDays"
    :number-of-months="numberOfMonths"
    :handle-day-click="onDayClick"
    :handle-day-mouse-enter="onDayMouseEnter"
    :handle-day-mouse-leave="onDayMouseLeave"
    :handle-prev-month-click="onPrevMonthClick"
    :handle-next-month-click="onNextMonthClick"
    :month-format="monthFormat"
    :render-month="renderMonth"
    :with-portal="withPortal"
    :hidden="!focusedInput"
    :initial-visible-month="getCurrentMonth"
    :day-size="daySize"
    :handle-outside-click="handleOutsideClick"
    :render-day="renderDay"
    :first-day-of-week="firstDayOfWeek"
    :hide-keyboard-shortcuts-panel="hideKeyboardShortcutsPanel"
    :is-focused="isFocused"
    :get-first-focusable-day="getFirstFocusableDay"
    :handle-blur="handleBlur"
    :show-keyboard-shortcuts-on-init="showKeyboardShortcutsOnInit"
    :phrases="phrases"
    :is-r-t-l="isRTL"
    :week-day-format="weekDayFormat"
    :day-aria-label-format="dayAriaLabelFormat"
    :vertical-height="verticalHeight"
    :no-border="noBorder"
    :transition-duration="transitionDuration"
  >
    <template slot="info-panel">
      <slot name="info-panel"></slot>
    </template>
  </day-picker>
</template>

<script>
import moment from "moment";
import { DayPickerPhrases } from "../phrases";
import {
  isTouchSupported,
  isInclusivelyAfterDay,
  isSameDay,
  isNextDay,
  isAfterDay,
  unique,
  getVisibleDays,
  toISODateString
} from "../helpers";
import {
  START_DATE,
  END_DATE,
  VERTICAL_ORIENTATION,
  HORIZONTAL_ORIENTATION,
  VERTICAL_SCROLLABLE,
  DAY_SIZE
} from "../constants";
import DayPicker from "./day-picker.vue";

const getChooseAvailableDatePhrase = (phrases, focusedInput) => {
  if (focusedInput === START_DATE) {
    return phrases.chooseAvailableStartDate;
  } else if (focusedInput === END_DATE) {
    return phrases.chooseAvailableEndDate;
  }
  return phrases.chooseAvailableDate;
};

export default {
  name: "date-range-controller",
  components: { DayPicker },
  props: {
    startDate: {
      type: moment,
      default: null
    },
    endDate: {
      type: moment,
      default: null
    },
    handleDatesChange: {
      type: Function,
      default: function() {}
    },
    focusedInput: {
      type: String,
      default: START_DATE
    },
    handleFocusChange: {
      type: Function,
      default: function() {}
    },
    handleClose: {
      type: Function,
      default: function() {}
    },
    keepOpenOnDateSelect: {
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
    isDayBlocked: {
      type: Function,
      default: function() {}
    },
    isDayHighlighted: {
      type: Function,
      default: function() {}
    },
    // DayPicker props
    renderMonth: {
      type: Function,
      default: null
    },
    enableOutsideDays: {
      type: Boolean,
      default: false
    },
    numberOfMonths: {
      type: Number,
      default: 1
    },
    orientation: {
      type: String,
      default: HORIZONTAL_ORIENTATION
    },
    withPortal: {
      type: Boolean,
      default: false
    },
    hideKeyboardShortcutsPanel: {
      type: Boolean,
      default: false
    },
    initialVisibleMonth: {
      type: Function,
      default: null
    },
    firstDayOfWeek: {
      type: Number,
      default: moment.localeData().firstDayOfWeek()
    },
    daySize: {
      type: Number,
      default: DAY_SIZE
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
    handlePrevMonthClick: {
      type: Function,
      default: function() {}
    },
    handleNextMonthClick: {
      type: Function,
      default: function() {}
    },
    handleOutsideClick: {
      type: Function,
      default: function() {}
    },
    renderDay: {
      type: Function,
      default: null
    },
    handleBlur: {
      type: Function,
      default: function() {}
    },
    isFocused: {
      type: Boolean,
      default: false
    },
    showKeyboardShortcutsOnInit: {
      type: Boolean,
      default: false
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
        return DayPickerPhrases;
      }
    },
    dayAriaLabelFormat: {
      type: String
    },
    isRTL: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const today = (this.today = moment());
    let currentMonth = today;
    if (this.startDate) {
      currentMonth = this.startDate;
    }
    if (this.initialVisibleMonth) {
      currentMonth = this.initialVisibleMonth();
    }

    return {
      isTouchSupported: false,
      hoverDate: null,
      currentMonth
    };
  },
  computed: {
    modifierFns() {
      return {
        today: day => this.isToday(day),
        blocked: day => this.isBlocked(day),
        "blocked-calendar": day => this.isDayBlocked(day),
        "blocked-out-of-range": day => this.isOutsideRange(day),
        "highlighted-calendar": day => this.isDayHighlighted(day),
        valid: day => !this.isBlocked(day),
        "selected-start": day => this.isStartDate(day),
        "selected-end": day => this.isEndDate(day),
        "blocked-minimum-nights": day => this.doesNotMeetMinimumNights(day),
        "selected-span": day => this.isInSelectedSpan(day),
        "last-in-range": day => this.isLastInRange(day),
        hovered: day => this.isHovered(day),
        "hovered-span": day => this.isInHoveredSpan(day),
        "after-hovered-start": day => this.isDayAfterHoveredStartDate(day)
      };
    },
    phraseData() {
      return Object.assign(
        getChooseAvailableDatePhrase(this.phrases, this.focusedInput),
        this.phrases
      );
    },
    visibleDays() {
      const {
        currentMonth,
        numberOfMonths,
        enableOutsideDays,
        hoverDate,
        orientation
      } = this;

      const withoutTransitionMonths = orientation === VERTICAL_SCROLLABLE;

      const modifiers = this.getModifiers(
        getVisibleDays(
          currentMonth,
          numberOfMonths,
          enableOutsideDays,
          withoutTransitionMonths
        )
      );

      return modifiers;
    }
  },
  methods: {
    onDayClick(day, e) {
      if (e) {
        e.preventDefault();
      }
      if (this.isBlocked(day)) {
        return;
      }
      const {
        keepOpenOnDateSelect,
        minimumNights,
        handleBlur,
        focusedInput,
        handleFocusChange,
        handleClose
      } = this;
      let startDate = this.startDate;
      let endDate = this.endDate;

      if (focusedInput === START_DATE) {
        handleFocusChange(END_DATE);

        startDate = day;

        if (isInclusivelyAfterDay(day, endDate)) {
          endDate = null;
        }
      } else if (focusedInput === END_DATE) {
        const firstAllowedEndDate =
          startDate && startDate.clone().add(minimumNights, "day");

        if (!startDate) {
          endDate = day;
          handleFocusChange(START_DATE);
        } else if (isInclusivelyAfterDay(day, firstAllowedEndDate)) {
          endDate = day;
          if (!keepOpenOnDateSelect) {
            handleFocusChange(null);
            handleClose({ startDate, endDate });
          }
        } else {
          startDate = day;
          endDate = null;
        }
      }

      this.handleDatesChange({ startDate, endDate });
      handleBlur();
    },
    onDayMouseEnter(day) {
      if (this.isTouchSupported) {
        return;
      }

      this.hoverDate = day;
    },
    onDayMouseLeave() {
      if (this.isTouchSupported || !this.hoverDate) {
        return;
      }

      this.hoverDate = null;
    },
    onPrevMonthClick() {
      const prevMonth = this.currentMonth.clone().subtract(1, "month");
      this.currentMonth = prevMonth;
      this.handlePrevMonthClick(prevMonth.clone());
    },
    onNextMonthClick() {
      const nextMonth = this.currentMonth.clone().add(1, "month");
      this.currentMonth = nextMonth;
      this.handleNextMonthClick(nextMonth.clone());
    },
    getFirstFocusableDay(newMonth) {
      const {
        startDate,
        endDate,
        focusedInput,
        minimumNights,
        numberOfMonths
      } = this;

      let focusedDate = newMonth.clone().startOf("month");
      if (focusedInput === START_DATE && startDate) {
        focusedDate = startDate.clone();
      } else if (focusedInput === END_DATE && !endDate && startDate) {
        focusedDate = startDate.clone().add(minimumNights, "days");
      } else if (focusedInput === END_DATE && endDate) {
        focusedDate = endDate.clone();
      }

      if (this.isBlocked(focusedDate)) {
        const days = [];
        const lastVisibleDay = newMonth
          .clone()
          .add(numberOfMonths - 1, "months")
          .endOf("month");
        let currentDay = focusedDate.clone();
        while (!isAfterDay(currentDay, lastVisibleDay)) {
          currentDay = currentDay.clone().add(1, "day");
          days.push(currentDay);
        }

        const viableDays = days.filter(day => !this.isBlocked(day));

        if (viableDays.length > 0) {
          focusedDate = viableDays[0];
        }
      }

      return focusedDate;
    },
    getModifiers(visibleDays) {
      const modifiers = {};
      Object.keys(visibleDays).forEach(month => {
        modifiers[month] = {};
        visibleDays[month].forEach(day => {
          modifiers[month][toISODateString(day)] = this.getModifiersForDay(day);
        });
      });

      return modifiers;
    },
    getModifiersForDay(day) {
      return unique(
        Object.keys(this.modifierFns).filter(modifier =>
          this.modifierFns[modifier](day)
        )
      );
    },
    doesNotMeetMinimumNights(day) {
      const { startDate, isOutsideRange, focusedInput, minimumNights } = this;
      if (focusedInput !== END_DATE) {
        return false;
      }

      if (startDate) {
        const dayDiff = day.diff(
          startDate
            .clone()
            .startOf("day")
            .hour(12),
          "days"
        );
        return dayDiff < minimumNights && dayDiff >= 0;
      }

      return isOutsideRange(moment(day).subtract(minimumNights, "day"));
    },
    isDayAfterHoveredStartDate(day) {
      const { startDate, endDate, minimumNights, hoverDate } = this;
      return (
        Boolean(startDate) &&
        !endDate &&
        !this.isBlocked(day) &&
        isNextDay(hoverDate, day) &&
        minimumNights > 0 &&
        isSameDay(hoverDate, startDate)
      );
    },
    isEndDate(day) {
      return isSameDay(day, this.endDate);
    },
    isHovered(day) {
      return isSameDay(day, this.hoverDate);
    },
    isInHoveredSpan(day) {
      const { startDate, endDate, hoverDate } = this;

      const isForwardRange =
        Boolean(startDate) &&
        !endDate &&
        (day.isBetween(startDate, hoverDate) || isSameDay(hoverDate, day));
      const isBackwardRange =
        Boolean(endDate) &&
        !startDate &&
        (day.isBetween(hoverDate, endDate) || isSameDay(hoverDate, day));

      const isValidDayHovered = hoverDate && !this.isBlocked(hoverDate);

      return (isForwardRange || isBackwardRange) && isValidDayHovered;
    },
    isInSelectedSpan(day) {
      const { startDate, endDate } = this;
      return day.isBetween(startDate, endDate);
    },
    isLastInRange(day) {
      return this.isInSelectedSpan(day) && isNextDay(day, this.endDate);
    },
    isStartDate(day) {
      return isSameDay(day, this.startDate);
    },
    isBlocked(day) {
      return this.isDayBlocked(day) || this.isOutsideRange(day);
    },
    isToday(day) {
      return isSameDay(day, this.today);
    },
    getCurrentMonth() {
      return this.currentMonth;
    }
  },
  mounted() {
    this.isTouchSupported = isTouchSupported();
  },
  beforeUpdate() {
    this.today = moment();
  }
};
</script>
