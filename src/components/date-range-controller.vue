<template>
  
</template>

<script>
import moment from "moment";
import { DayPickerPhrases } from "../phrases";
import { isTouchSupported, isInclusivelyAfterDay, isSameDay, isNextDay } from "../helpers";
import { START_DATE, END_DATE } from "../constants";
import DayPicker from "./day-picker";

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
    // this.modifiers = {
    //   today: day => this.isToday(day),
    //   blocked: day => this.isBlocked(day),
    //   "blocked-calendar": day => this.isDayBlocked(day),
    //   "blocked-out-of-range": day => this.isOutsideRange(day),
    //   "highlighted-calendar": day => this.isDayHighlighted(day),
    //   valid: day => !this.isBlocked(day),
    //   'selected-start': day => this.isSta
    //   hovered: day => this.isHovered(day)
    // };

    // initialize phrases
    // set the appropriate CalendarDay phrase based on focusedInput
    const chooseAvailableDate = getChooseAvailableDatePhrase(
      props.phrases,
      props.focusedInput
    );

    return {
      isTouchSupported: false,
      today: moment(),
      hoverDate: null,
      currentMonth: moment(),
      visibleDays: {}
    };
  },
  computed: {
    phraseData() {
      return Object.assign(
        getChooseAvailableDatePhrase(this.phrases, this.focusedInput),
        this.phrases
      );
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
    onDayMouseEnter(day) {},
    onDayMouseLeave(day) {},
    onPrevMonthClick() {},
    onNextMonthClick() {},
    onMultiplyScrollableMonths() {},
    getFirstFocusableDay(newMonth) {},
    getModifiers() {},
    getModifiersForDay() {},
    getStateForNewMonth() {},
    addModifier() {},
    addModifierToRange() {},
    deleteModifier() {},
    deleteModifierFromRange() {},
    doesNotMeetMinimumNights(day) {
      const {
        startDate,
        isOutsideRange,
        focusedInput,
        minimumNights
      } = this;
      if (focusedInput !== END_DATE) {
        return false;
      }

      if (startDate) {
        const dayDiff = day.diff(startDate.clone().startOf('day').hour(12), 'days');
        return dayDiff < minimumNights && dayDiff >= 0;
      }

      return isOutsideRange(moment(day).subtract(minimumNights, 'day'));
    },
    isDayAfterHoveredStartDate(day) {
      const {startDate, endDate, minimumNights, hoverDate} = this;
      return Boolean(startDate) && !endDate && !this.isBlocked(day) && isNextDay(hoverDate,day) &&
        minimumNights > 0 && isSameDay(hoverDate, startDate);
    },
    isEndDate(day) {
      return isSameDay(day, this.endDate);
    },
    isHovered(day) {
      return isSameDay(day, this.hoverDate);
    },
    isInHoveredSpan(day) {
      const {startDate, endDate, hoverDate} = this;

      const isForwardRange = Boolean(startDate) && !endDate &&
        (day.isBetween(startDate, hoverDate) ||
        isSameDay(hoverDate, day));
      const isBackwardRange = Boolean(endDate) && !startDate &&
        (day.isBetween(hoverDate, endDate) ||
        isSameDay(hoverDate, day));

      const isValidDayHovered = hoverDate && !this.isBlocked(hoverDate);

      return (isForwardRange || isBackwardRange) && isValidDayHovered;
    },
    isInSelectedSpan(day) {
      const {startDate, endDate} = this;
      return day.isBetween(startDate, endDate);
    },
    isLastInRange(day) {
      return this.isInSelectedSpan(day) && isNextDay(day, this.endDate)
    },
    isStartDate(day) {
      return isSameDay(day, this.startDate);
    },
    isBlocked(day) {
      return this.isDayBlocked(day) || this.isOutsideRange(day);
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
  }
};
</script>
