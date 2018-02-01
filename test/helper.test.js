import moment from "moment";
import * as _ from "../src/helpers";

describe("isSameDay", () => {
  const today = moment();
  const tomorrow = moment().add(1, "days");

  test("returns true if args are the same day", () => {
    expect(_.isSameDay(today, today)).toBe(true);
  });
  test("returns false if args are not the same day", () => {
    expect(_.isSameDay(today, tomorrow)).toBe(false);
  });
  test("returns false for same days of week", () => {
    expect(_.isSameDay(moment("2000-01-01"), moment("2000-01-08"))).toBe(false);
  });
});

describe("toMomentObject", () => {
  test("returns null for null input", () => {
    expect(_.toMomentObject(null)).toBe(null);
  });

  test("returns null for undefined input", () => {
    expect(_.toMomentObject(undefined)).toBe(null);
    expect(_.toMomentObject()).toBe(null);
  });

  test("returns null for falsy input", () => {
    expect(_.toMomentObject("")).toBe(null);
    expect(_.toMomentObject(false)).toBe(null);
  });

  test("returns time at 12p.m.", () => {
    expect(_.toMomentObject("1991-07-13").hour()).toBe(12);
  });

  test("parses custom format", () => {
    const date = _.toMomentObject("1991---13/07", "YYYY---DD/MM");

    expect(date).not.toBe(null);
    expect(date.month()).toBe(6); // moment months are zero-indexed
    expect(date.date()).toBe(13);
    expect(date.year()).toBe(1991);
  });

  test("parses localized format", () => {
    const date = _.toMomentObject(moment("1991-07-13").format("L"));

    expect(date).not.toBe(null);
    expect(date.month()).toBe(6); // moment months are zero-indexed
    expect(date.date()).toBe(13);
    expect(date.year()).toBe(1991);
  });
});

describe("isBeforeDay", () => {
  const today = moment();
  const tomorrow = moment().add(1, "days");

  test("returns true if first arg is before the second but have same month and year", () => {
    expect(_.isBeforeDay(today, tomorrow)).toBe(true);
  });

  test("returns true if first arg is before the second but have same day and year", () => {
    expect(
      _.isBeforeDay(
        today,
        moment()
          .clone()
          .add(1, "month")
      )
    ).toBe(true);
  });

  test("returns true if first arg is before the second but have same day and month", () => {
    expect(
      _.isBeforeDay(
        today,
        moment()
          .clone()
          .add(1, "year")
      )
    ).toBe(true);
  });

  test("returns false if args are the same day", () => {
    expect(_.isBeforeDay(today, today)).toBe(false);
  });

  test("returns false if first arg is after the second", () => {
    expect(_.isBeforeDay(tomorrow, today)).toBe(false);
  });
});

describe("isAfterDay", () => {
  const today = moment();
  const tomorrow = moment().add(1, "days");

  test("returns true if first arg is after the second but have same month and year", () => {
    expect(_.isAfterDay(tomorrow, today)).toBe(true);
  });

  test("returns true if first arg is after the second but have same day and year", () => {
    expect(
      _.isAfterDay(
        moment()
          .clone()
          .add(1, "month"),
        today
      )
    ).toBe(true);
  });

  test("returns true if first arg is after the second but have same day and month", () => {
    expect(
      _.isAfterDay(
        moment()
          .clone()
          .add(1, "year"),
        today
      )
    ).toBe(true);
  });

  test("returns false if args are the same day", () => {
    expect(_.isAfterDay(today, today)).toBe(false);
  });

  test("returns false if first arg is after the second", () => {
    expect(_.isAfterDay(today, tomorrow)).toBe(false);
  });
});

describe("isDayVisible", () => {
  test("returns true if arg is in visible months", () => {
    const test = moment().add(3, "months");
    const currentMonth = moment().add(2, "months");
    expect(_.isDayVisible(test, currentMonth, 2)).toBe(true);
  });

  test("returns false if arg is before first month", () => {
    const test = moment().add(1, "months");
    const currentMonth = moment().add(2, "months");
    expect(_.isDayVisible(test, currentMonth, 2)).toBe(false);
  });

  test("returns false if arg is after last month", () => {
    const test = moment().add(4, "months");
    const currentMonth = moment().add(2, "months");
    expect(_.isDayVisible(test, currentMonth, 2)).toBe(false);
  });
});

describe("getCalendarMonthWeeks", () => {
  const today = moment();
  const weeks = _.getCalendarMonthWeeks(today);
  const weeksWithOutsideDays = _.getCalendarMonthWeeks(today, true);

  describe("input validation", () => {
    test("throws a TypeError if first arg is not a valid moment object", () => {
      const invalidValues = [
        null,
        "2017-01-01T00:00:00Z",
        new Date(),
        moment.invalid()
      ];
      invalidValues.forEach(value => {
        expect(() => _.getCalendarMonthWeeks(value)).toThrow(TypeError);
      });
    });

    test("throws a TypeError if third arg is not an integer between 0 and 6", () => {
      const invalidValues = [null, -1, 7, "0", "1", 1.5];
      invalidValues.forEach(value => {
        expect(() => _.getCalendarMonthWeeks(today, true, value)).toThrow(
          TypeError
        );
      });
    });
  });

  test("returns an array of arrays", () => {
    expect(weeks).toBeInstanceOf(Array);

    weeks.forEach(week => {
      expect(week).toBeInstanceOf(Array);
    });
  });

  test("today is included", () => {
    let isIncluded = false;
    weeks.forEach(week => {
      week.forEach(day => {
        if (day && day.isSame(today, "day")) {
          isIncluded = true;
        }
      });
    });

    expect(isIncluded).toBe(true);
  });

  test("all days have a time of 12PM", () => {
    weeks.forEach(week => {
      week.forEach(day => {
        if (day) {
          expect(day.hours()).toBe(12);
        }
      });
    });
  });

  describe('padding when enableOutsideDays is false', () => {
    let weeksWithPadding;

    beforeEach(() => {
      // using specific month Feb 2017 to manually compare with calendar
      weeksWithPadding = _.getCalendarMonthWeeks(moment('2017-02-01'), false);
    });

    test('null pads leading days', () => {
      const firstWeek = weeksWithPadding[0];
      expect(firstWeek[0]).toBe(null); // Sun Jan 29
      expect(firstWeek[1]).toBe(null); // Mon Jan 30
      expect(firstWeek[2]).toBe(null); // Tue Jan 31
      expect(firstWeek[3]).not.toBe(null); // Wed Feb 1
    });

    test('null pads trailing days', () => {
      const lastWeek = weeksWithPadding[weeksWithPadding.length - 1];
      expect(lastWeek[2]).not.toBe(null); // Tue Feb 28
      expect(lastWeek[3]).toBe(null); // Wed Mar 1
      expect(lastWeek[4]).toBe(null); // Thu Mar 2
      expect(lastWeek[5]).toBe(null); // Fri Mar 3
      expect(lastWeek[6]).toBe(null); // Sat Mar 4
    });
  });
});
