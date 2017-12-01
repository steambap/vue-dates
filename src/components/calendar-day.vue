<template>
	<td :style="daySizeStyles"
		class="CalendarDay_container"
		:class="classObject">
		<button class="CalendarDay_button"
			type="button"
			:class="{CalendarDay_button__default: useDefaultCursor}"
			@mouseenter="onMouseEnter($event)"
			@mouseleave="onMouseLeave($event)"
			@click="onClick($event)"
			:tabindex="tabIndex"
			ref="button"
		>
			{{formatDay}}
		</button>
	</td>
</template>

<script>
import moment from "moment";
import { DAY_SIZE } from "../constants";
import { contains } from "../helpers";

export default {
  name: "calendar-day",
  props: {
    day: {
      type: moment,
      default: function() {
        return moment();
      }
    },
    daySize: {
      type: Number,
      default: DAY_SIZE
    },
    isOutsideDay: {
      type: Boolean,
      default: false
    },
    modifiers: {
      type: Array,
      default: function() {
        return [];
      }
    },
    isFocused: {
      type: Boolean,
      default: false
    },
    tabIndex: {
      type: Number,
      default: -1
    },
    onDayClick: {
      type: Function,
      default: function() {}
    },
    onDayMouseEnter: {
      type: Function,
      default: function() {}
    },
    onDayMouseLeave: {
      type: Function,
      default: function() {}
    },
    renderDay: {
      type: Function,
      default: null
    }
  },
  computed: {
    daySizeStyles() {
      return {
        width: this.daySize + "px",
        height: this.daySize - 1 + "px"
      };
    },
    useDefaultCursor() {
      return (
        contains(this.modifiers, "blocked-minimum-nights") ||
        contains(this.modifiers, "blocked-calendar") ||
        contains(this.modifiers, "blocked-out-of-range")
      );
    },
    selected() {
      return (
        contains(this.modifiers, "selected") ||
        contains(this.modifiers, "selected-start") ||
        contains(this.modifiers, "selected-end")
      );
    },
    hoveredSpan() {
      return (
        !this.selected &&
        (contains(this.modifiers, "hovered-span") ||
          contains(this.modifiers, "after-hovered-start"))
      );
    },
    classObject() {
      const { modifiers } = this;
      return {
        CalendarDay__outside: this.isOutsideDay,
        CalendarDay__highlighted_calendar: contains(
          modifiers,
          "highlighted-calendar"
        ),
        CalendarDay__blocked_minimum_nights: contains(
          modifiers,
          "blocked-minimum-nights"
        ),
        CalendarDay__blocked_calendar: contains(modifiers, "blocked-calendar"),
        CalendarDay__hovered_span: this.hoveredSpan,
        CalendarDay__selected_span: contains(modifiers, "selected-span"),
        CalendarDay__last_in_range: contains(modifiers, "last-in-range"),
        CalendarDay__selected_start: contains(modifiers, "selected-start"),
        CalendarDay__selected_end: contains(modifiers, "selected-end"),
        CalendarDay__selected: this.selected,
        CalendarDay__blocked_out_of_range: contains(
          modifiers,
          "blocked-out-of-range"
        )
      };
    },
    formatDay() {
      return this.renderDay
        ? this.renderDay(this.day, this.modifiers)
        : this.day.format("D");
    }
  },
  methods: {
    onMouseEnter(e) {
      this.onDayMouseEnter(this.day, e);
    },
    onMouseLeave(e) {
      this.onDayMouseLeave(this.day, e);
    },
    onClick(e) {
      this.onDayClick(this.day, e);
    }
  },
  watch: {
    tabIndex: function(oldVal, newVal) {
      if (newVal === 0) {
        if (this.isFocused || newVal !== oldVal) {
          this.$refs.button.focus();
        }
      }
    }
  }
};
</script>

<style>
.CalendarDay_container {
  border: 1px solid #e4e7e7;
  padding: 0;
  box-sizing: border-box;
  color: #565a5c;
  background: #fff;
}
.CalendarDay_container:hover {
  background: #e4e7e7;
  border: 1px double #e4e7e7;
  color: inherit;
}
.CalendarDay_button {
  position: relative;
  height: 100%;
  width: 100%;
  text-align: center;
  background: transparent;
  border: none;
  margin: 0;
  padding: 0;
  color: inherit;
  font: inherit;
  line-height: normal;
  overflow: visible;
  box-sizing: border-box;
  cursor: pointer;
}
.CalendarDay_button:active {
  outline: 0;
}
.CalendarDay_button__default {
  cursor: default;
}
.CalendarDay__outside {
  border: none;
  background: #fff;
  color: #565a5c;
}

.CalendarDay__blocked_minimum_nights {
  background: #fff;
  border: 1px solid #eceeee;
  color: #cacccd;
}
.CalendarDay__blocked_minimum_nights:hover,
.CalendarDay__blocked_minimum_nights:active {
  background: #fff;
  color: #cacccd;
}
.CalendarDay__highlighted_calendar {
  background: #ffe8bc;
  color: #565a5c;
}
.CalendarDay__highlighted_calendar:hover,
.CalendarDay__highlighted_calendar:active {
  background: #ffce71;
  color: #565a5c;
}
.CalendarDay__selected_span {
  background: #66e2da;
  border: 1px solid #33dacd;
  color: #fff;
}
.CalendarDay__selected_span:hover,
.CalendarDay__selected_span:active {
  background: #33dacd;
  border: 1px solid #00a699;
  color: #fff;
}
.CalendarDay__last_in_range {
  border-right: #00a699;
}
.CalendarDay__selected {
  background: #00a699;
  border: 1px solid #00a699;
  color: #fff;
}
.CalendarDay__selected:hover,
.CalendarDay__selected:active {
  background: #00a699;
  border: 1px solid #00a699;
  color: #fff;
}
.CalendarDay__hovered_span {
  background: #b2f1ec;
  border: 1px solid #80e8e0;
  color: #007a87;
}
.CalendarDay__hovered_span:hover {
  background: #80e8e0;
  border: 1px solid #80e8e0;
  color: #007a87;
}
.CalendarDay__hovered_span:active {
  background: #b2f1ec;
  border: 1px solid #80e8e0;
  color: #007a87;
}
.CalendarDay__blocked_calendar {
  background: #cacccd;
  border: 1px solid #cacccd;
  color: #82888a;
}
.CalendarDay__blocked_calendar:hover,
.CalendarDay__blocked_calendar:active {
  background: #cacccd;
  border: 1px solid #cacccd;
  color: #82888a;
}
.CalendarDay__blocked_out_of_range {
  background: #fff;
  border: 1px solid #e4e7e7;
  color: #cacccd;
}
.CalendarDay__blocked_out_of_range:hover,
.CalendarDay__blocked_out_of_range:active {
  background: #fff;
  border: 1px solid #e4e7e7;
  color: #cacccd;
}
</style>
