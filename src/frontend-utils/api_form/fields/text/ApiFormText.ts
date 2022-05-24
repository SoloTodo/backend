import { ApiFormApiParams } from "../../types";

export type ApiFormTextProps = {
  fieldType: "text";
  name: string;
  label: string;
  inputType: "text" | "number" | "url";
};

export class ApiFormText {
  readonly name: string;
  readonly label: string;
  readonly inputType: "text" | "number" | "url";
  cleanedData?: string | null;

  constructor(
    name: string,
    label: string,
    inputType: "text" | "number" | "url",
    cleanedData?: string
  ) {
    this.name = name;
    this.label = label;
    this.inputType = inputType;
    this.cleanedData = cleanedData;
  }

  loadData(query: URLSearchParams) {
    const value = query.get(this.name);
    this.cleanedData = value ? value : null;
  }

  isValid() {
    return typeof this.cleanedData !== "undefined";
  }

  getApiParams(): ApiFormApiParams {
    if (typeof this.cleanedData === "undefined") {
      throw new Error("Invalid call on invalid field");
    }

    const apiParams: ApiFormApiParams = {};
    if (this.cleanedData != null) apiParams[this.name] = [this.cleanedData];
    return apiParams;
  }

}
