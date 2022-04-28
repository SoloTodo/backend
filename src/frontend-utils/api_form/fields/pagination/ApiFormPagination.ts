import { ApiFormApiParams } from "../../types";

export type ApiFormPaginationData = {
  page?: number;
  page_size?: number;
};

export type ApiFormPaginationProps = {
  fieldType: "pagination";
  name: string;
};

export class ApiFormPagination {
  readonly name: string;
  cleanedData?: ApiFormPaginationData;

  constructor(name: string, cleanedData?: ApiFormPaginationData) {
    this.name = name;
    this.cleanedData = cleanedData;
  }

  loadData(query: URLSearchParams) {
    this.cleanedData = this.cleanData(query);
  }

  cleanData(query?: URLSearchParams): ApiFormPaginationData {
    const newData: any = {
      page_size: 20,
    };
    const arr = ["page", "page_size"];
    arr.forEach((a) => {
      const q = query?.get(a);
      if (q) newData[a] = q;
    });
    return newData;
  }

  isValid() {
    return typeof this.cleanedData !== "undefined";
  }

  getApiParams(): ApiFormApiParams {
    if (typeof this.cleanedData === "undefined") {
      throw new Error("Invalid call on invalid field");
    }

    const apiParams: ApiFormApiParams = {};
    Object.keys(this.cleanedData).map((k) => {
      apiParams[k] = [(this.cleanedData as any)[k]];
    });
    return apiParams;
  }
}
