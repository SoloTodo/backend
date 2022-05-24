import { ApiFormApiParams } from "../../types";

export type ApiFormPaginationData = {
  page: number;
  page_size: number;
};

export type ApiFormPaginationProps = {
  fieldType: "pagination";
};

export class ApiFormPagination {
  cleanedData?: ApiFormPaginationData;

  constructor(cleanedData?: ApiFormPaginationData) {
    this.cleanedData = cleanedData;
  }

  loadData(query: URLSearchParams): void {
    this.cleanedData = this.cleanData(query);
  }

  cleanData(query: URLSearchParams): ApiFormPaginationData | undefined {
    const newData: ApiFormPaginationData = {
      page: 1,
      page_size: 20,
    };
    const arr = ['page' as 'page', 'page_size' as 'page_size'];
    for (const a of arr) {
      const q = query.get(a);

      if (q) {
        const parsedQ = parseInt(q)
        if (isNaN(parsedQ)) {
          return undefined
        }
        newData[a] = parsedQ;
      }
    }
    return newData;
  }

  isValid(): boolean {
    return typeof this.cleanedData !== "undefined";
  }

  getApiParams(): ApiFormApiParams {
    const cleanedData = this.cleanedData

    if (typeof cleanedData === 'undefined') {
      throw new Error('Invalid field')
    }

    const apiParams: ApiFormApiParams = {};
    ['page' as 'page', 'page_size' as 'page_size'].map((k) => {
      apiParams[k] = [cleanedData[k].toString()];
    })
    return apiParams
  }
}
