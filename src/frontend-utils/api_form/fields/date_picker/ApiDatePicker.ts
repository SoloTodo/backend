import { format } from "date-fns";
import { ApiFormApiParams } from "../../types";

export type ApiFormDatePickerProps = {
  fieldType: "date";
  name: string;
  label: string;
};

export class ApiFormDatePicker {
  readonly name: string;
  readonly label: string;
  cleanedData?: Date;

  constructor(name: string, label: string, cleanedData?: Date) {
    this.name = name;
    this.label = label;
    this.cleanedData = cleanedData;
  }

  loadData(query: URLSearchParams) {
    const value = query.get(this.name);
    this.cleanedData = value ? new Date(value) : undefined;
  }

  isValid() {
    return typeof this.cleanedData !== "undefined" && this.cleanedData !== null;
  }

  getApiParams(): ApiFormApiParams {
    if (typeof this.cleanedData === "undefined") {
      throw new Error("Invalid call on invalid field");
    }

    const apiParams: ApiFormApiParams = {};
    apiParams[this.name] = [this.cleanedData.toISOString()];
    return apiParams;
  }
}
