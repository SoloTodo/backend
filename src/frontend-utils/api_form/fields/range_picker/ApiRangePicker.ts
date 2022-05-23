import { subDays } from "date-fns";
import { ApiFormApiParams } from "../../types";

export type ApiFormRangePickerProps = {
  fieldType: "date_range";
  name: string;
};

export class ApiFormRangePicker {
  readonly name: string;
  cleanedData?: [Date | null, Date | null];

  constructor(name: string, cleanedData?: [Date | null, Date | null]) {
    this.name = name;
    this.cleanedData = cleanedData;
  }

  loadData(query: URLSearchParams) {
    const after = query.get(`${this.name}_after`);
    const before = query.get(`${this.name}_before`);

    let past30 = this.name.includes("timestamp")
      ? subDays(new Date(), 30)
      : null;
    const today = this.name.includes("timestamp") ? new Date() : null;

    const valueAfter = after ? new Date(after) : past30;
    const valueBefore = before ? new Date(before) : today;

    this.cleanedData = [valueAfter, valueBefore];
  }

  isValid() {
    return typeof this.cleanedData !== "undefined";
  }

  getApiParams(): ApiFormApiParams {
    if (typeof this.cleanedData === "undefined") {
      throw new Error("Invalid call on invalid field");
    }
    const apiParams: ApiFormApiParams = {};
    if (this.cleanedData[0] !== null)
      apiParams[`${this.name}_after`] = [this.cleanedData[0].toISOString()];
    if (this.cleanedData[1] !== null)
      apiParams[`${this.name}_before`] = [this.cleanedData[1].toISOString()];
    return apiParams;
  }
}
