import { ApiFormApiParams } from "../../types";

export type ApiFormSubmitProps = {
  fieldType: "submit";
  name: string;
};

const submitBlacklist = ["false", "0", ""];

export const submitReady = (value: string | (string | null)[] | null | undefined) => {
  if (typeof value !== "undefined" && value !== null && !Array.isArray(value)) {
    return !submitBlacklist.includes(value);
  } else {
    return false;
  }
};

export class ApiFormSubmit {
  readonly name: string;
  cleanedData?: boolean;

  constructor(name: string, cleanData?: boolean) {
    this.name = name;
    this.cleanedData = cleanData;
  }

  loadData(query: URLSearchParams) {
    this.cleanedData = submitReady(query.get(this.name));
  }

  isValid() {
    return typeof this.cleanedData !== "undefined";
  }

  getApiParams(): ApiFormApiParams {
    if (typeof this.cleanedData === "undefined") {
      throw new Error("Invalid call on invalid field");
    }

    return {};
  }
}
