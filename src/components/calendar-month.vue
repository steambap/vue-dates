<template>
	<div class="CalendarMonth"
		:class="CalendarMonthClass"
		:data-visible="isVisible">
		<div class="CalendarMonth_caption"
			:class="{CalendarMonth_caption__verticalScrollable: verticalScrollable}"
			ref="caption"
		>
			<strong>{{monthTitle}}</strong>
		</div>
		<table class="CalendarMonth_table">
			<tbody ref="dayGrid">
				<tr v-for="(week, i) in weeks" :key="i">
					<calendar-day v-for="(day, dayOfWeek) in week"
						:key="dayOfWeek"
						:day="day"
						:day-size="daySize"
						:is-outside-day="!day || day.month() !== month.month()"
						:tab-index="isVisible && isSameDay(day, focusedDate) ? 0 : -1"
						:is-focused="isFocused"
						:on-day-mouse-enter="onDayMouseEnter"
						:on-day-mouse-leave="onDayMouseLeave"
						:on-day-click="onDayClick"
						:render-day="renderDay"
						:modifiers="modifiers[toISODateString(day)]"
					></calendar-day>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import moment from 'moment';
import {
	HORIZONTAL_ORIENTATION,
	VERTICAL_ORIENTATION,
	VERTICAL_SCROLLABLE,
	DAY_SIZE
} from '../constants';
import {
	getCalendarMonthWeeks,
	isSameDay,
	toISODateString,
	calculateDimension
} from '../helpers';
import CalendarDay from './calendar-day.vue';

export default {
	name: 'calendar-month',
	components: {CalendarDay},
	props: {
		month: {
			type: moment,
			default: function() {
				return moment();
			}
		},
		isVisible: {
			type: Boolean,
			default: true
		},
		enableOutsideDays: {
			type: Boolean,
			default: false
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
		daySize: {
			type: Number,
			default: DAY_SIZE
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
		},
		renderMonth: {
			type: Function,
			default: null
		},
		firstDayOfWeek: {
			type: Number,
			default: moment.localeData().firstDayOfWeek()
		},
		setMonthHeightCb: {
			type: Function,
			default: function() {}
		},

		focusedDate: {
			type: moment,
			default: null
		},
		isFocused: {
			type: Boolean,
			default: false
		},

		monthFormat: {
			type: String,
			default: 'MMMM YYYY'
		}
	},
	data() {
		return {
			weeks: getCalendarMonthWeeks(this.month, this.enableOutsideDays, this.firstDayOfWeek)
		};
	},
	computed: {
		verticalScrollable() {
			return this.orientation === VERTICAL_SCROLLABLE;
		},
		CalendarMonthClass() {
			return {
				CalendarMonth__horizontal: this.orientation === HORIZONTAL_ORIENTATION,
				CalendarMonth__vertical: this.orientation === VERTICAL_ORIENTATION,
				CalendarMonth__verticalScrollable: this.verticalScrollable
			};
		},
		monthTitle() {
			return this.renderMonth ? this.renderMonth(this.month) : this.month.format(this.monthFormat);
		}
	},
	methods: {
		isSameDay, toISODateString,
		setMonthHeight() {
			const { setMonthHeightCb } = this;
			const captionHeight = calculateDimension(
				this.$refs.caption, 'height', true, true);
			const gridHeight = calculateDimension(this.$refs.dayGrid, 'height');

			setMonthHeightCb(captionHeight + gridHeight + 1);
		}
	},
	beforeCreate() {
		// Timer is not reactive
		this.setMonthHeightTimer = 0;
	},
	mounted() {
		this.setMonthHeightTimer = setTimeout(() => {
			this.setMonthHeight();
		}, 0);
	},
	beforeDestroy() {
		if (this.setMonthHeightTimer) {
			clearTimeout(this.setMonthHeightTimer);
		}
	}
}
</script>


<style>
.CalendarMonth {
	background: white;
	text-align: center;
	padding: 0 13px;
	vertical-align: top;
	user-select: none;
}
.CalendarMonth_table {
	border-collapse: collapse;
	border-spacing: 0;
}
.CalendarMonth_caption {
	color: #565a5c;
	font-size: 18px;
	text-align:center;
	padding-top: 22px;
	padding-bottom: 37px;
	caption-side: initial;
}
.CalendarMonth_caption__verticalScrollable {
	padding-top: 12px;
	padding-bottom: 7px;
}
</style>
