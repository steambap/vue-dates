import moment from "moment";

import {
  WEEKDAYS,
  DISPLAY_FORMAT,
  ISO_FORMAT,
  ISO_MONTH_FORMAT,
  ANCHOR_LEFT
} from "./constants";

export function contains(arr, elm) {
  return arr.indexOf(elm) !== -1;
}

export function getCalendarMonthWeeks(
  month,
  enableOutsideDays,
  firstDayOfWeek = moment.localeData().firstDayOfWeek()
) {
  if (!moment.isMoment(month) || !month.isValid()) {
    throw new TypeError("`month` must be a valid moment object");
  }
  if (!contains(WEEKDAYS, firstDayOfWeek)) {
    throw new TypeError("`firstDayOfWeek` must be an integer between 0 and 6");
  }

  // Set utc offset to get correct dates in future (when timezone changes)
  const firstOfMonth = month
    .clone()
    .startOf("month")
    .hour(12);
  const lastOfMonth = month
    .clone()
    .endOf("month")
    .hour(12);

  // Calculate the exact first and last days to fill the entire matrix
  // (considering days outside month)
  const prevDays = (firstOfMonth.day() - firstDayOfWeek) % 7;
  const nextDays = (firstDayOfWeek + 6 - lastOfMonth.day()) % 7;
  const firstDay = firstOfMonth.clone().subtract(prevDays, "day");
  const lastDay = lastOfMonth.clone().add(nextDays, "day");

  const totalDays = lastDay.diff(firstDay, "days") + 1;

  const currentDay = firstDay.clone();
  const weeksInMonth = [];

  for (let i = 0; i < totalDays; i++) {
    if (i % 7 === 0) {
      weeksInMonth.push([]);
    }

    let day = null;
    if ((i >= prevDays && i < totalDays - nextDays) || enableOutsideDays) {
      day = currentDay.clone();
    }

    weeksInMonth[weeksInMonth.length - 1].push(day);

    currentDay.add(1, "day");
  }

  return weeksInMonth;
}

export function isSameDay(a, b) {
  if (!moment.isMoment(a) || !moment.isMoment(b)) {
    return false;
  }
  // Compare least significant, most likely to change units first
  // Moment's isSame clones moment inputs and is a tad slow
  return (
    a.date() === b.date() && a.month() === b.month() && a.year() === b.year()
  );
}

export function toMomentObject(dateString, customeFormat) {
  const dateFormats = customeFormat
    ? [customeFormat, DISPLAY_FORMAT, ISO_FORMAT]
    : [DISPLAY_FORMAT, ISO_FORMAT];

  const date = moment(dateString, dateFormats, true);

  return date.isValid() ? date.hour(12) : null;
}

export function toISODateString(date, currentFormat) {
  const dateObj = moment.isMoment(date)
    ? date
    : toMomentObject(date, currentFormat);
  if (!dateObj) {
    return "";
  }

  return dateObj.format(ISO_FORMAT);
}

export function getMonths(
  initialMonth,
  numberOfMonths,
  withoutTransitionMonths
) {
  let month = initialMonth.clone();
  if (!withoutTransitionMonths) {
    month = month.subtract(1, "month");
  }

  const months = [];
  for (
    let i = 0;
    i < (withoutTransitionMonths ? numberOfMonths : numberOfMonths + 2);
    i++
  ) {
    months.push(month);
    month = month.clone().add(1, "month");
  }

  return months;
}

const CALENDAR_MONTH_PADDING = 9;

export function getCalendarMonthWidth(daySize) {
  return 7 * (daySize + 1) + 2 * (CALENDAR_MONTH_PADDING + 1);
}

export function getTransformStyles(transformValue) {
  return {
    transform: transformValue,
    msTransform: transformValue,
    MozTransform: transformValue,
    WebkitTransform: transformValue
  };
}

export function toISOMonthString(date, currentFormat) {
  const dateObj = moment.isMoment(date)
    ? date
    : toMomentObject(date, currentFormat);
  if (!dateObj) {
    return "";
  }

  return dateObj.format(ISO_MONTH_FORMAT);
}

/**
 * @param {HTMLElement} el
 * @param {string} axis
 * @param {boolean} borderBox
 * @param {boolean} withMargin
 */
export function calculateDimension(
  el,
  axis,
  borderBox = false,
  withMargin = false
) {
  if (!el) {
    return 0;
  }

  const axisStart = axis === "width" ? "Left" : "Top";
  const axisEnd = axis === "width" ? "Right" : "Bottom";

  // Only read styles if we need to
  const style = !borderBox || withMargin ? window.getComputedStyle(el) : null;

  // Offset includes border and padding
  const { offsetWidth, offsetHeight } = el;
  let size = axis === "width" ? offsetWidth : offsetHeight;

  // Get the inner size
  if (!borderBox) {
    size -=
      parseFloat(style[`padding${axisStart}`]) +
      parseFloat(style[`padding${axisEnd}`]) +
      parseFloat(style[`border${axisStart}Width`]) +
      parseFloat(style[`border${axisEnd}Width`]);
  }

  // Apply margin
  if (withMargin) {
    size +=
      parseFloat(style[`margin${axisStart}`]) +
      parseFloat(style[`margin${axisEnd}`]);
  }

  return size;
}

export function isTransitionEndSupported() {
  return Boolean(typeof window !== "undefined" && "TransitionEvent" in window);
}

export function isBeforeDay(a, b) {
  if (!moment.isMoment(a) || !moment.isMoment(b)) {
    return false;
  }

  const aYear = a.year();
  const aMonth = a.month();

  const bYear = b.year();
  const bMonth = b.month();

  const isSameYear = aYear === bYear;
  const isSameMonth = aMonth === bMonth;

  if (isSameYear && isSameMonth) {
    return a.date() < b.date();
  }
  if (isSameYear) {
    return aMonth < bMonth;
  }
  return aYear < bYear;
}

export function isAfterDay(a, b) {
  return !isBeforeDay(a, b) && !isSameDay(a, b);
}

export function isDayVisible(day, month, numberOfMonths, enableOutsideDays) {
  let firstDayOfFirstMonth = month.clone().startOf("month");
  if (enableOutsideDays) {
    firstDayOfFirstMonth = firstDayOfFirstMonth.startOf("week");
  }
  if (isBeforeDay(day, firstDayOfFirstMonth)) {
    return false;
  }

  let lastDayOfLastMonth = month
    .clone()
    .add(numberOfMonths - 1, "month")
    .endOf("month");
  if (enableOutsideDays) {
    lastDayOfLastMonth = lastDayOfLastMonth.endOf("week");
  }

  return !isAfterDay(day, lastDayOfLastMonth);
}

export function getActiveElement() {
  return typeof document !== "undefined" && document.activeElement;
}

export function getResponsiveContainerStyles(
  anchorDirection,
  currentOffset,
  containerEdge,
  margin
) {
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const calculatedOffset =
    anchorDirection === ANCHOR_LEFT
      ? windowWidth - containerEdge
      : containerEdge;
  const calculatedMargin = margin || 0;

  return {
    [anchorDirection]: Math.min(
      currentOffset + calculatedOffset - calculatedMargin + "px",
      0
    )
  };
}

export function isTouchSupported() {
  return (
    Boolean(
      typeof window !== "undefined" &&
        ("ontouchstart" in window ||
          (window.DocumentTouch &&
            typeof document !== "undefined" &&
            document instanceof window.DocumentTouch))
    ) ||
    Boolean(
      typeof navigator !== "undefined" &&
        (navigator.maxTouchPoints || navigator.msMaxTouchPoints)
    )
  );
}

export function getVisibleDays(
  month,
  numberOfMonths,
  enableOutsideDays,
  withoutTransitionMonths
) {
  if (!moment.isMoment(month)) {
    return {};
  }

  const visibleDaysByMonth = {};
  let currentMonth = withoutTransitionMonths
    ? month.clone()
    : month.clone().subtract(1, "month");
  for (
    let i = 0;
    i < (withoutTransitionMonths ? numberOfMonths : numberOfMonths + 2);
    i++
  ) {
    const visibleDays = [];
    const baseDate = currentMonth.clone();
    const firstOfMonth = baseDate
      .clone()
      .startOf("month")
      .hour(12);
    const lastOfMonth = baseDate
      .clone()
      .endOf("month")
      .hour(12);

    const currentDay = firstOfMonth.clone();
    // Days belonging to the previous month
    if (enableOutsideDays) {
      for (let j = 0; j < currentDay.weekday(); j += 1) {
        const prevDay = currentDay.clone().subtract(j + 1, "day");
        visibleDays.unshift(prevDay);
      }
    }

    while (currentDay < lastOfMonth) {
      visibleDays.push(currentDay.clone());
      currentDay.add(1, "day");
    }

    if (enableOutsideDays) {
      if (currentDay.weekday() !== 0) {
        for (
          let k = currentDay.weekday(), count = 0;
          k < 7;
          k += 1, count += 1
        ) {
          const nextDay = currentDay.clone().add(count, "day");
          visibleDays.push(nextDay);
        }
      }
    }

    visibleDaysByMonth[toISOMonthString(currentMonth)] = visibleDays;
    currentMonth = currentMonth.clone().add(1, "month");
  }

  return visibleDaysByMonth;
}

export function isInclusivelyAfterDay(a, b) {
  if (!moment.isMoment(a) || !moment.isMoment(b)) {
    return false;
  }

  return !isBeforeDay(a, b);
}

export function isNextDay(a, b) {
  if (!moment.isMoment(a) || !moment.isMoment(b)) {
    return false;
  }
  const nextDay = moment(a).add(1, "day");

  return isSameDay(nextDay, b);
}

export function unique(arr) {
  return arr.filter((item, idx, self) => self.indexOf(item) === idx);
}

export function getPhrase(phrase, args) {
  if (typeof phrase === "string") {
    return phrase;
  }
  if (typeof phrase === "function") {
    return phrase(args);
  }

  return "";
}

export function toLocalizedDateString(date, currentFormat) {
  const dateObj = moment.isMoment(date)
    ? date
    : toMomentObject(date, currentFormat);
  if (!dateObj) {
    return null;
  }

  return dateObj.format(DISPLAY_FORMAT);
}
