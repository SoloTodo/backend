import { GetServerSidePropsContext } from "next";
import {
  ApiFormSelect,
  ApiFormSelectProps,
} from "./fields/select/ApiFormSelect";
import { FetchJsonInit } from "../network/utils";
import { jwtFetch } from "../nextjs/utils";
import {
  ApiFormPaginationProps,
  ApiFormPagination,
} from "./fields/pagination/ApiFormPagination";
import { ApiFormText, ApiFormTextProps } from "./fields/text/ApiFormText";

export type ApiFormFieldMetadata = ApiFormSelectProps | ApiFormPaginationProps | ApiFormTextProps;
export type ApiFormField = ApiFormSelect | ApiFormPagination | ApiFormText;

export class ApiForm {
  private fields: ApiFormField[] = [];
  private endpoint: URL;
  private fetchFunction: (input: string, init?: FetchJsonInit) => Promise<any>;

  constructor(
    fieldsMetadata: ApiFormFieldMetadata[],
    endpoint: string,
    initialData?: Record<string, any> | null
  ) {
    this.endpoint = new URL(endpoint);
    this.fetchFunction = (input: string, init?: FetchJsonInit) =>
      jwtFetch(null, input, init);

    for (const fieldMetadata of fieldsMetadata) {
      switch (fieldMetadata.fieldType) {
        case "select":
          this.fields.push(
            new ApiFormSelect(
              fieldMetadata.name,
              fieldMetadata.label,
              fieldMetadata.choices,
              fieldMetadata.multiple,
              fieldMetadata.required,
              initialData && initialData[fieldMetadata.name]
            )
          );
          break;
        case "pagination":
          this.fields.push(
            new ApiFormPagination(
              fieldMetadata.name,
              initialData && initialData[fieldMetadata.name]
            )
          );
          break;
        case "text":
          this.fields.push(
            new ApiFormText(
              fieldMetadata.name,
              fieldMetadata.label,
              fieldMetadata.inputType,
              initialData && initialData[fieldMetadata.name]
            )
          );
          break;
      }
    }
  }

  initialize(context?: GetServerSidePropsContext) {
    this.fetchFunction = (input: string, init?: FetchJsonInit) =>
      jwtFetch(context, input, init);

    const currentUrl =
      context && context.req
        ? new URL(context.req.url || "", `http://${context.req.headers.host}`)
        : new URL(window.location.href);
    const query = currentUrl.searchParams;
    for (const field of this.fields) {
      field.loadData(query);
    }
  }

  submit() {
    if (!this.isValid()) {
      throw Error("Form must be valid in order to be submitted");
    }

    const endpointSearch = this.endpoint.searchParams.toString();
    const querySearchParams: URLSearchParams = new URLSearchParams(
      endpointSearch
    );

    for (const field of this.fields) {
      for (const [key, values] of Object.entries(field.getApiParams())) {
        for (const value of values) {
          querySearchParams.append(key, value);
        }
      }
    }
    
    const querySearch = querySearchParams.toString();
    const queryUrl = new URL(this.endpoint.href);
    queryUrl.search = "?" + querySearch;
    return this.fetchFunction(queryUrl.href);
  }

  isValid() {
    return this.fields.every((field) => field.isValid());
  }

  getCleanedData() {
    if (!this.isValid()) {
      return null;
    }

    const cleanedData = {} as Record<string, any>;
    for (const field of this.fields) {
      cleanedData[field.name] = field.cleanedData;
    }

    return cleanedData;
  }

  getField(name: string) {
    return this.fields.find((field) => field.name === name);
  }
}
