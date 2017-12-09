<template>
	<div class="CalendarMonthGrid"
		:class="monthGridClass"
		:style="monthGridStyles"
		ref="container"
	>
		<div
			v-for="month in monthList"
			:key="month.monthString"
			:class="month.cssClass"
			:style="month.styles"
		>
			<calendar-month
				:month="month.data"
				:is-visible="month.isVisible"
				:enable-outside-days="enableOutsideDays"
				:modifiers="modifiers[month.monthString]"
				:month-format="monthFormat"
				:orientation="orientation"
				:handle-day-mouse-enter="handleDayMouseEnter"
				:handle-day-mouse-leave="handleDayMouseLeave"
				:handle-day-click="handleDayClick"
				:render-month="renderMonth"
				:render-day="renderDay"
				:first-day-of-week="firstDayOfWeek"
				:day-size="daySize"
				:focused-date="month.isVisible ? focusedDate : null"
				:is-focused="isFocused"
				:set-month-height-cb="month.setMonthHeight"
			></calendar-month>
		</div>
	</div>
</template>

<script>
import moment from "moment";
import CalendarMonth from "./calendar-month.vue";
import {
  getMonths,
  getCalendarMonthWidth,
  getTransformStyles,
  toISOMonthString,
  isTransitionEndSupported
} from "../helpers";
import {
  HORIZONTAL_ORIENTATION,
  VERTICAL_SCROLLABLE,
  VERTICAL_ORIENTATION,
  DAY_SIZE
} from "../constants";

export default {
  name: "calendar-month-grid",
  components: { CalendarMonth },
  props: {
    enableOutsideDays: {
      type: Boolean,
      default: false
    },
    firstVisibleMonthIndex: {
      type: Number,
      default: 0
    },
    initialMonth: {
      type: moment,
      default: function() {
        return moment();
      }
    },
    isAnimating: {
      type: Boolean,
      default: false
    },
    numberOfMonths: {
      type: Number,
      default: 1
    },
    modifiers: {
      type: Object,
      default: function() {
        return {};
      }
    },
    orientation: {
      type: String,
      default: HORIZONTAL_ORIENTATION
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
    handleMonthTransitionEnd: {
      type: Function,
      default: function() {}
    },
    renderDay: {
      type: Function,
      default: null
    },
    renderMonth: {
      type: Function,
      default: null
    },
    transformValue: {
      type: String,
      default: "none"
    },
    daySize: {
      type: Number,
      default: DAY_SIZE
    },
    focusedDate: {
      type: moment,
      default: null
    },
    isFocused: {
      type: Boolean,
      default: false
    },
    firstDayOfWeek: {
      type: Number,
      default: moment.localeData().firstDayOfWeek()
    },
    setCalendarMonthHeights: {
      type: Function,
      default: function() {}
    },
    isRTL: {
      type: Boolean,
      default: false
    },
    monthFormat: {
      type: String,
      default: "MMMM YYYY"
    }
  },
  computed: {
    isVertical() {
      return this.orientation === VERTICAL_ORIENTATION;
    },
    isVerticalScrollable() {
      return this.orientation === VERTICAL_SCROLLABLE;
    },
    isHorizontal() {
      return this.orientation === HORIZONTAL_ORIENTATION;
    },
    calendarMonthWidth() {
      return getCalendarMonthWidth(this.daySize);
    },
    gridWidth() {
      return this.isVertical || this.isVerticalScrollable
        ? this.calendarMonthWidth
        : (this.numberOfMonths + 2) * this.calendarMonthWidth;
    },
    monthGridClass() {
      return {
        CalendarMonthGrid__horizontal: this.isHorizontal,
        CalendarMonthGrid__vertical: this.isVertical,
        CalendarMonthGrid__vertical_scrollable: this.isVerticalScrollable,
        CalendarMonthGrid__animating: this.isAnimating
      };
    },
    monthGridStyles() {
      return {
        transition: this.isAnimating ? "transform 0.2s ease-in-out" : "none",
        width: this.gridWidth + "px",
        ...getTransformStyles(this.transformValue)
      };
    },
    monthList() {
      const withoutTransitionMonths = this.orientation === VERTICAL_SCROLLABLE;
      const months = getMonths(
        this.initialMonth,
        this.numberOfMonths,
        withoutTransitionMonths
      );

      return months.map((month, i) => {
        const isVisible =
          i >= this.firstVisibleMonthIndex &&
          i < this.firstVisibleMonthIndex + this.numberOfMonths;
        const hideForAnimation = i === 0 && !isVisible;
        const showForAnimation = i === 0 && this.isAnimating && isVisible;
        const monthString = toISOMonthString(month);
        const cssClass = {
          CalendarMonthGrid_month__horizontal: this.isHorizontal,
          CalendarMonthGrid_month__hideForAnimation: hideForAnimation
        };
        const styles = {};
        if (showForAnimation && !this.isVertical && !this.isRTL) {
          styles.position = "absolute";
          styles.left = -this.calendarMonthWidth + "px";
        }
        if (showForAnimation && !this.isVertical && this.isRTL) {
          styles.position = "absolute";
          styles.right = 0;
        }
        if (showForAnimation && this.isVertical) {
          styles.position = "absolute";
          styles.top = -this.calendarMonthHeights[0] + "px";
        }
        const setMonthHeight = height => this.setMonthHeight(height, i);

        return {
          isVisible,
          hideForAnimation,
          showForAnimation,
          monthString,
          cssClass,
          styles,
          setMonthHeight,
          data: month
        };
      });
    },
    isTransitionEndSupported
  },
  methods: {
    setMonthHeight(height, idx) {
      if (this.calendarMonthHeights[idx]) {
        if (idx === 0) {
          this.calendarMonthHeights = [height].concat(
            this.calendarMonthHeights.slice(0, -1)
          );
        } else if (idx === this.calendarMonthHeights.length - 1) {
          this.calendarMonthHeights = this.calendarMonthHeights
            .slice(1)
            .concat(height);
        }
      } else {
        this.calendarMonthHeights[idx] = height;
      }
    },
    onTransitionEnd() {
      this.handleMonthTransitionEnd();
    }
  },
  beforeCreate() {
    // Non-reactive members
    this.calendarMonthHeights = [];
    this.locale = moment.locale();
  },
  mounted() {
    this.$refs.container.addEventListener(
      "transitionend",
      this.onTransitionEnd
    );

    this.$nextTick(() => {
      this.setCalendarMonthHeights(this.calendarMonthHeights);
    });
  },
  updated() {
    // For IE9, immediately call handleMonthTransitionEnd instead of
    // waiting for the animation to complete
    if (!this.isTransitionEndSupported && this.isAnimating) {
      this.handleMonthTransitionEnd();
    }
  },
  beforeDestroy() {
    this.$refs.container.removeEventListener(
      "transitionend",
      this.onTransitionEnd
    );
  },
  watch: {
    isAnimating: function(oldVal, newVal) {
      if (!newVal && oldVal) {
        this.$nextTick(() => {
          this.setCalendarMonthHeights(this.calendarMonthHeights);
        });
      }
    }
  }
};
</script>

<style>
.CalendarMonthGrid {
  background: #fff;
  text-align: left;
  z-index: 0;
}
.CalendarMonthGrid__animating {
  z-index: 1;
}
.CalendarMonthGrid__horizontal {
  position: absolute;
  left: 9px;
}
.CalendarMonthGrid__vertical {
  margin: 0 auto;
}
.CalendarMonthGrid__vertical_scrollable {
  margin: 0 auto;
  overflow-y: scroll;
}
.CalendarMonthGrid_month__horizontal {
  display: inline-block;
  vertical-align: top;
  min-height: 100%;
}
.CalendarMonthGrid_month__hideForAnimation {
  position: absolute;
  z-index: -1;
  opacity: 0;
  pointer-events: none;
}
</style>
