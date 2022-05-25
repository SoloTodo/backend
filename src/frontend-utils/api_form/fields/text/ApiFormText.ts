import { ApiFormApiParams } from "../../types";

export type ApiFormTextProps = {
  fieldType: "text";
  name: string;
};

export class ApiFormText {
  readonly name: string;
  cleanedData?: string;

  constructor(
    name: string,
    cleanedData?: string
  ) {
    this.name = name;
    this.cleanedData = cleanedData;
  }

  loadData(query: URLSearchParams) {
    const value = query.get(this.name);
    this.cleanedData = value ? value : "";
  }

  isValid() {
    return typeof this.cleanedData !== "undefined";
  }

  getApiParams(): ApiFormApiParams {
    if (typeof this.cleanedData === "undefined") {
      throw new Error("Invalid call on invalid field");
    }

    const apiParams: ApiFormApiParams = {};
    if (this.cleanedData != "") apiParams[this.name] = [this.cleanedData];
    return apiParams;
  }

}
