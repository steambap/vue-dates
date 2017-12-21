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
