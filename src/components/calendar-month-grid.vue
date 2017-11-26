<template>
	<div class="CalendarMonthGrid"
		:class="monthGridClass"
		:style="monthGridStyles"
	>
		<div
			v-for="month in monthList"
			:key="month.key"
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
				:on-day-mouse-enter="onDayMouseEnter"
				:on-day-mouse-leave="onDayMouseLeave"
				:on-day-click="onDayClick"
				:render-month="renderMonth"
				:render-day="renderDay"
				:first-day-of-week="firstDayOfWeek"
				:day-size="daySize"
				:focused-date="month.isVisible ? focusedDate : null"
				:is-focused="isFocused"
				:set-month-height="function(){}"
			></calendar-month>
		</div>
	</div>
</template>

<script>
import moment from 'moment';
import CalendarMonth from './calendar-month.vue';
import {
	getMonths,
	getCalendarMonthWidth,
	getTransformStyles,
	toISOMonthString
} from '../helpers';
import {
	HORIZONTAL_ORIENTATION,
	VERTICAL_SCROLLABLE,
	VERTICAL_ORIENTATION,
	DAY_SIZE
} from '../constants';

export default {
	name: 'calendar-month-grid',
	components: {CalendarMonth},
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
		onMonthTransitionEnd: {
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
			default: 'none'
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
			default: 'MMMM YYYY'
		}
	},
	data() {
		const withoutTransitionMonths = this.orientation === VERTICAL_SCROLLABLE;
		return {
			months: getMonths(this.initialMonth, this.numberOfMonths, withoutTransitionMonths)
		};
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
			return this.isVertical || this.isVerticalScrollable ?
				this.calendarMonthWidth :
				(this.numberOfMonths + 2) * this.calendarMonthWidth;
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
				transition: this.isAnimating ? 'transform 0.2s ease-in-out' : 'none',
				width: this.gridWidth + 'px',
				...getTransformStyles(this.transformValue)
			};
		},
		monthList() {
			return this.months.map((month, i) => {
				const isVisible = (i >= this.firstVisibleMonthIndex) && (i < this.firstVisibleMonthIndex + this.numberOfMonths);
				const hideForAnimation = i === 0 && !isVisible;
				const showForAnimation = i === 0 && this.isAnimating && isVisible;
				const monthString = toISOMonthString(month);
				const cssClass = {
					CalendarMonthGrid_month__horizontal: this.isHorizontal,
					CalendarMonthGrid_month__hideForAnimation: hideForAnimation
				};
				const styles = {};
				if (showForAnimation && !this.isVertical && !this.isRTL) {
					styles.position = 'absolute';
					styles.left = - this.calendarMonthWidth;
				}
				if (showForAnimation && !this.isVertical && this.isRTL) {
					styles.position = 'absolute';
					styles.right = 0;
				}
				if (showForAnimation && this.isVertical) {
					styles.position = 'absolute';
					//styles.top = 
				}
				// const setMonthHeight = (height) => this.setMonthHeight(height, i);

				return {
					isVisible, hideForAnimation, showForAnimation, monthString,
					cssClass, styles,
					key: i,
					data: month
				};
			});
		}
	}
}
</script>

<style>
.CalendarMonthGrid {
	background: #fff;
	text-align: center;
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
