import { ApiFormApiParams } from "../../types";

export type ApiFormSubmitProps = {
  fieldType: "submit";
  name: string;
};

export class ApiFormSubmit {
  readonly name: string;
  cleanedData?: boolean;

  constructor(name: string, cleanData?: boolean) {
    this.name = name;
    this.cleanedData = cleanData
  }

  loadData(query: URLSearchParams) {
    this.cleanedData = query.get(this.name) === 'true';
  }

  isValid() {
    return typeof this.cleanedData !== "undefined";
  }

  getApiParams(): ApiFormApiParams {
    if (typeof this.cleanedData === "undefined") {
      throw new Error("Invalid call on invalid field");
    }

    const apiParams: ApiFormApiParams = {};
    apiParams[this.name] = [this.cleanedData.toString()];
    return apiParams;
  }
}