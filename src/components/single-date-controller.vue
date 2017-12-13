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
    :with-portal="withPortal"
    :hidden="!focused"
    :hide-keyboard-shortcuts-panel="hideKeyboardShortcutsPanel"
    :initial-visible-month="getCurrentMonth"
    :first-day-of-week="firstDayOfWeek"
    :render-month="renderMonth"
    :render-day="renderDay"
    :is-focused="isFocused"
    :get-first-focusable-day="getFirstFocusableDay"
    :handle-blur="handleBlur"
    :phrases="phrases"
    :day-size="daySize"
    :is-r-t-l="isRTL"
    :show-keyboard-shortcuts-on-init="showKeyboardShortcutsOnInit"
    :week-day-format="weekDayFormat"
    :vertical-height="verticalHeight"
    :no-border="noBorder"
    :transition-duration="transitionDuration"
  >
    <slot name="info-panel"></slot>
  </day-picker>
</template>

<script>
import moment from "moment";

import DayPicker from "./day-picker.vue";
import { DAY_SIZE, HORIZONTAL_ORIENTATION } from "../constants";
import { DayPickerPhrases } from "../phrases";
import {
  isTouchSupported,
  isSameDay,
  getVisibleDays,
  isAfterDay,
  toISODateString,
  toISOMonthString,
  unique,
  isDayVisible
} from "../helpers";

export default {
  name: "single-date-controller",
  components: { DayPicker },
  props: {
    date: {
      type: moment,
      default: null
    },
    handleDateChange: {
      type: Function,
      default: function() {}
    },
    focused: {
      type: Boolean,
      default: false
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
      default: null
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
    renderDay: {
      type: Function,
      default: null
    },
    // Accessibility props
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
    isRTL: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const today = moment();
    let currentMonth = today;
    if (this.date) {
      currentMonth = this.date;
    }
    if (this.initialVisibleMonth) {
      currentMonth = this.initialVisibleMonth();
    }

    return {
      isTouchSupported: false,
      today,
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
        hovered: day => this.isHovered(day),
        selected: day => this.isSelected(day)
      };
    },
    visibleDays() {
      const {
        currentMonth,
        numberOfMonths,
        enableOutsideDays,
        hoverDate
      } = this;

      const modifiers = this.getModifiers(
        getVisibleDays(currentMonth, numberOfMonths, enableOutsideDays)
      );

      if (!hoverDate) {
        return modifiers;
      }
      if (
        !isDayVisible(
          hoverDate,
          currentMonth,
          numberOfMonths,
          enableOutsideDays
        )
      ) {
        return modifiers;
      }

      const isoMonth = toISOMonthString(hoverDate);
      const isoDay = toISODateString(hoverDate);
      const dayModifiers = modifiers[isoMonth][isoDay];
      dayModifiers.push("hovered");
      modifiers[isoMonth][isoDay] = unique(dayModifiers);

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

      this.handleDateChange(day);
      if (!this.keepOpenOnDateSelect) {
        this.handleFocusChange({ focused: false });
        this.handleClose({ date: day });
      }
    },
    onDayMouseEnter(day) {
      if (this.isTouchSupported) {
        return;
      }

      let modifiers = this.deleteModifier({}, this.hoverDate, "hovered");
      modifiers = this.addModifier(modifiers, day, "hovered");

      this.hoverDate = day;
      // this.visibleDays = Object.assign({}, this.visibleDays, modifiers);
    },
    onDayMouseLeave() {
      if (this.isTouchSupported || !this.hoverDate) {
        return;
      }

      const modifiers = this.deleteModifier({}, this.hoverDate, "hovered");

      this.hoverDate = null;
      // this.visibleDays = Object.assign({}, this.visibleDays, modifiers);
    },
    onPrevMonthClick() {
      // const newVisibleDays = {};
      // Object.keys(this.visibleDays)
      //   .sort()
      //   .slice(0, this.numberOfMonths + 1)
      //   .forEach(month => {
      //     newVisibleDays[month] = this.visibleDays[month];
      //   });

      const prevMonth = this.currentMonth.clone().substract(1, "month");
      // const prevMonthVisibleDays = getVisibleDays(
      //   prevMonth,
      //   1,
      //   this.enableOutsideDays
      // );

      this.currentMonth = prevMonth;
      // this.visibleDays = Object.assign(
      //   {},
      //   newVisibleDays,
      //   this.getModifiers(prevMonthVisibleDays)
      // );

      this.handlePrevMonthClick(prevMonth.clone());
    },
    onNextMonthClick() {
      // const newVisibleDays = {};
      // Object.keys(this.visibleDays)
      //   .sort()
      //   .slice(1)
      //   .forEach(month => {
      //     newVisibleDays[month] = this.visibleDays[month];
      //   });

      // const nextMonth = this.currentMonth
      //   .clone()
      //   .add(this.numberOfMonths, "month");
      // const nextMonthVisibleDays = getVisibleDays(
      //   nextMonth,
      //   1,
      //   this.enableOutsideDays
      // );

      const newCurrentMonth = this.currentMonth.clone().add(1, "month");
      this.currentMonth = newCurrentMonth;
      // this.visibleDays = Object.assign(
      //   {},
      //   newVisibleDays,
      //   this.getModifiers(nextMonthVisibleDays)
      // );

      this.handleNextMonthClick(newCurrentMonth.clone());
    },
    getFirstFocusableDay(newMonth) {
      const { date, numberOfMonths } = this;
      const focusedDate = newMonth.clone().startOf("month");
      if (date) {
        focusedDate = date.clone();
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

        const viableDays = days.filter(
          day => !this.isBlocked(day) && isAfterDay(day, focusedDate)
        );
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
    // getStateForNewMonth() {},
    // addModifier() {},
    // deleteModifier() {},
    isBlocked(day) {
      return this.isDayBlocked(day) || this.isOutsideRange(day);
    },
    isHovered(day) {
      return isSameDay(day, this.hoverDate);
    },
    isSelected(day) {
      return isSameDay(day, this.date);
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
