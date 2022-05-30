import { ApiFormApiParams } from "../../types";

export type ApiFormSubmitProps = {
  fieldType: "submit";
};

export const submitReady = (
  value: string | (string | null)[] | null | undefined
) => {
  const submitBlacklist = ["false", "0", ""];

  if (typeof value !== "undefined" && value !== null) {
    if (Array.isArray(value)) {
      return !submitBlacklist.includes(value[0] !== null ? value[0] : "");
    } else {
      return !submitBlacklist.includes(value);
    }
  } else {
    return false;
  }
};

export class ApiFormSubmit {
  cleanedData?: boolean;

  constructor(cleanData?: boolean) {
    this.cleanedData = cleanData;
  }

  loadData(query: URLSearchParams) {
    this.cleanedData = submitReady(query.get("submit"));
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
