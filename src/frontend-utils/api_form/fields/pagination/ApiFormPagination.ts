import { ApiFormApiParams } from "../../types";

export type PagintationData = {
  count: number;
  next: string;
  previous: string;
  results: any[];
};

export type ApiFormPaginationProps = {
  fieldType: "pagination";
  name: "store" | "page" | "page_size";
};

export class ApiFormPagination {
  readonly name: string;
  cleanedData?: string;

  constructor(name: string, cleanedData?: string) {
    this.name = name;
    this.cleanedData = cleanedData;
  }

  loadData(data: string | string[]) {
    if (data.length !== 0) {
      this.cleanedData = data[0];
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
    apiParams[this.name] = [this.cleanedData];
    return apiParams;
  }
}
