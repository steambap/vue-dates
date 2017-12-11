import moment from "moment";

import OutsideClickHandler from "./outside-click-handler";
import DayPicker from "./day-picker.vue";
import { DAY_SIZE, HORIZONTAL_ORIENTATION } from "../constants";
import { DayPickerPhrases } from "../phrases";
import {
  isTouchSupported,
  isSameDay,
  getVisibleDays,
  isAfterDay,
  toISODateString
} from "../helpers";

export default {
  name: "single-date-controller",
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
    handleOutsideClick: {
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
    this.modifiers = {
      today: day => this.isToday(day),
      blocked: day => this.isBlocked(day),
      "blocked-calendar": day => this.isDayBlocked(day),
      "blocked-out-of-range": day => this.isOutsideRange(day),
      "highlighted-calendar": day => this.isDayHighlighted(day),
      valid: day => !this.isBlocked(day),
      hovered: day => this.isHovered(day),
      selected: day => this.isSelected(day)
    };

    return {
      isTouchSupported: false,
      today: moment(),
      hoverDate: null,
      currentMonth: moment(),
      visibleDays: {}
    };
  },
  computed: {},
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
      this.visibleDays = Object.assign({}, this.visibleDays, modifiers);
    },
    onDayMouseLeave() {
      if (this.isTouchSupported || !this.hoverDate) {
        return;
      }

      const modifiers = this.deleteModifier({}, this.hoverDate, "hovered");

      this.hoverDate = null;
      this.visibleDays = Object.assign({}, this.visibleDays, modifiers);
    },
    onPrevMonthClick() {
      const newVisibleDays = {};
      Object.keys(this.visibleDays)
        .sort()
        .slice(0, this.numberOfMonths + 1)
        .forEach(month => {
          newVisibleDays[month] = this.visibleDays[month];
        });

      const prevMonth = this.currentMonth.clone().substract(1, "month");
      const prevMonthVisibleDays = getVisibleDays(
        prevMonth,
        1,
        this.enableOutsideDays
      );

      this.currentMonth = prevMonth;
      this.visibleDays = Object.assign(
        {},
        newVisibleDays,
        this.getModifiers(prevMonthVisibleDays)
      );

      this.handlePrevMonthClick(prevMonth.clone());
    },
    onNextMonthClick() {
      const newVisibleDays = {};
      Object.keys(this.visibleDays)
        .sort()
        .slice(1)
        .forEach(month => {
          newVisibleDays[month] = this.visibleDays[month];
        });

      const nextMonth = this.currentMonth
        .clone()
        .add(this.numberOfMonths, "month");
      const nextMonthVisibleDays = getVisibleDays(
        nextMonth,
        1,
        this.enableOutsideDays
      );

      const newCurrentMonth = this.currentMonth.clone().add(1, "month");
      this.currentMonth = newCurrentMonth;
      this.visibleDays = Object.assign(
        {},
        newVisibleDays,
        this.getModifiers(nextMonthVisibleDays)
      );

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
      return Object.keys(this.modifiers)
        .filter(modifier => this.modifiers[modifier](day))
        .filter((item, idx, self) => self.indexOf(item) === idx);
    },
    getStateForNewMonth() {
      throw "todo";
    },
    addModifier() {},
    deleteModifier() {},
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
    }
  },
  mounted() {
    this.isTouchSupported = isTouchSupported();
    const { currentMonth, visibleDays } = this.getStateForNewMonth();
    this.currentMonth = currentMonth;
    this.visibleDays = visibleDays;
  },
  render(h) {
    const ctx = this;
    const {
      numberOfMonths,
      orientation,
      monthFormat,
      renderMonth,
      withPortal,
      focused,
      enableOutsideDays,
      hideKeyboardShortcutsPanel,
      daySize,
      firstDayOfWeek,
      renderDay,
      isFocused,
      isRTL,
      phrases,
      handleOutsideClick,
      handleBlur,
      showKeyboardShortcutsOnInit,
      weekDayFormat,
      verticalHeight,
      noBorder,
      transitionDuration,
      currentMonth,
      visibleDays
    } = ctx;
    const dayPickerEl = h(DayPicker, {
      attrs: {
        orientation,
        enableOutsideDays,
        visibleDays,
        numberOfMonths,
        handleDayClick: ctx.onDayClick,
        handleDayMouseEnter: ctx.onDayMouseEnter,
        handleDayMouseLeave: ctx.onDayMouseLeave,
        handlePrevMonthClick: ctx.onPrevMonthClick,
        handleNextMonthClick: ctx.onNextMonthClick,
        monthFormat,
        withPortal,
        hidden: !focused,
        hideKeyboardShortcutsPanel,
        initialVisibleMonth: () => currentMonth,
        firstDayOfWeek,
        renderMonth,
        renderDay,
        isFocused,
        getFirstFocusableDay: ctx.getFirstFocusableDay,
        handleBlur,
        phrases,
        daySize,
        isRTL,
        showKeyboardShortcutsOnInit,
        weekDayFormat,
        verticalHeight,
        noBorder,
        transitionDuration
      }
    });

    if (handleOutsideClick) {
      return h(OutsideClickHandler, { attrs: { handleOutsideClick } }, [
        dayPickerEl
      ]);
    }

    return dayPickerEl;
  }
};
