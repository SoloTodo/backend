import { subDays } from "date-fns";
import { ApiFormApiParams } from "../../types";

export type ApiFormDatePickerProps = {
  fieldType: "date";
  name: string;
  label: string;
};

export class ApiFormDatePicker {
  readonly name: string;
  readonly label: string;
  cleanedData?: Date | null;

  constructor(name: string, label: string, cleanedData?: Date) {
    this.name = name;
    this.label = label;
    this.cleanedData = cleanedData;
  }

  loadData(query: URLSearchParams) {
    const value = query.get(this.name);
    if (this.name === "timestamp_after") {
      let past = subDays(new Date(), 30);
      this.cleanedData = value ? new Date(value) : past;
    } else if (this.name === "timestamp_before") {
      this.cleanedData = value ? new Date(value) : new Date();
    } else {
      this.cleanedData = value ? new Date(value) : null;
    }
  }

  isValid() {
    return typeof this.cleanedData !== "undefined";
  }

  getApiParams(): ApiFormApiParams {
    if (typeof this.cleanedData === "undefined") {
      throw new Error("Invalid call on invalid field");
    }
    const apiParams: ApiFormApiParams = {};
    if (this.cleanedData !== null) apiParams[this.name] = [this.cleanedData.toISOString()];
    return apiParams;
  }
}
