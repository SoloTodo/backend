import { ApiFormApiParams } from "../../types";

export type ApiFormRemoveListFieldProps = {
  fieldType: "remove";
  name: string;
};

export class ApiFormRemoveListField {
  readonly name: string;
  cleanedData?: string[];

  constructor(name: string, label: string, cleanedData?: string[]) {
    this.name = name;
    this.cleanedData = cleanedData;
  }

  loadData(query: URLSearchParams) {
    const value = query.getAll(this.name);
    if (typeof value !== "undefined" && value !== null) {
      this.cleanedData = typeof value === "string" ? [value] : value;
    } else {
      this.cleanedData = [];
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
    apiParams[this.name] = this.cleanedData;
    return apiParams;
  }
}
