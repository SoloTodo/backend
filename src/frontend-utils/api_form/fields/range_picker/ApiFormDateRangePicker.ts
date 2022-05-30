import { set, subDays, isValid as isValidDate, addDays } from "date-fns";
import { ApiFormApiParams } from "../../types";

export type ApiFormDateRangePickerProps = {
  fieldType: "date_range";
  name: string;
  required?: boolean;
};

export class ApiFormDateRangePicker {
  readonly name: string;
  readonly required: boolean;
  cleanedData?: [Date | null, Date | null];

  constructor(
    name: string,
    required?: boolean,
    cleanedData?: [Date | null, Date | null]
  ) {
    this.name = name;
    this.required = required || false;
    this.cleanedData = cleanedData;
  }

  loadData(query: URLSearchParams) {
    const after = query.get(`${this.name}_after`);
    const before = query.get(`${this.name}_before`);

    let past30 = this.required
      ? set(subDays(new Date(), 30), { hours: 0, minutes: 0, seconds: 0 })
      : null;
    const today = this.required
      ? set(new Date(), { hours: 0, minutes: 0, seconds: 0 })
      : null;

    let valueAfter = after
      ? set(new Date(after), { hours: 0, minutes: 0, seconds: 0 })
      : past30;
    const valueBefore = before
      ? set(new Date(before), { hours: 0, minutes: 0, seconds: 0 })
      : today;

    if (
      valueAfter !== null &&
      valueBefore !== null &&
      valueAfter > valueBefore
    ) {
      if (this.required) {
        valueAfter = past30;
      } else {
        valueAfter = null;
      }
    }

    this.cleanedData = [valueAfter, valueBefore];
  }

  isValid() {
    if (this.required) {
      return (
        typeof this.cleanedData !== "undefined" &&
        this.cleanedData[0] !== null &&
        this.cleanedData[1] !== null
      );
    } else {
      return typeof this.cleanedData !== "undefined";
    }
  }

  getApiParams(): ApiFormApiParams {
    if (typeof this.cleanedData === "undefined") {
      throw new Error("Invalid call on invalid field");
    }
    const apiParams: ApiFormApiParams = {};
    if (this.cleanedData[0] !== null && isValidDate(this.cleanedData[0]))
      apiParams[`${this.name}_after`] = [this.cleanedData[0].toISOString()];
    if (this.cleanedData[1] !== null && isValidDate(this.cleanedData[1]))
      apiParams[`${this.name}_before`] = [
        addDays(this.cleanedData[1], 1).toISOString(),
      ];
    return apiParams;
  }
}
