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
