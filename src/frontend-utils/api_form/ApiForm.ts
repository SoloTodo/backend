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
import {
  ApiFormSubmit,
  ApiFormSubmitProps,
} from "./fields/submit/ApiFormSubmit";
import {
  ApiFormRemoveListField,
  ApiFormRemoveListFieldProps,
} from "./fields/remove/ApiFormRemoveListField";
import {
  ApiFormDateRangePicker,
  ApiFormDateRangePickerProps,
} from "./fields/range_picker/ApiFormDateRangePicker";
import {
  ApiFormSlider,
  ApiFormSliderProps,
} from "./fields/slider/ApiFormSlider";
import {
  ApiFormPriceRange,
  ApiFormPriceRangeProps,
} from "./fields/price_range/ApiFormPriceRange";

export type ApiFormFieldMetadata =
  | ApiFormSelectProps
  | ApiFormPaginationProps
  | ApiFormTextProps
  | ApiFormDateRangePickerProps
  | ApiFormSubmitProps
  | ApiFormRemoveListFieldProps
  | ApiFormSliderProps
  | ApiFormPriceRangeProps;
export type ApiFormField =
  | ApiFormSelect
  | ApiFormPagination
  | ApiFormText
  | ApiFormDateRangePicker
  | ApiFormSubmit
  | ApiFormRemoveListField
  | ApiFormSlider
  | ApiFormPriceRange;

export class ApiForm {
  private fields: Record<string, ApiFormField> = {};
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
          this.fields[fieldMetadata.name] = new ApiFormSelect(
            fieldMetadata.name,
            fieldMetadata.choices,
            fieldMetadata.multiple,
            fieldMetadata.required,
            initialData && initialData[fieldMetadata.name]
          );
          break;
        case "pagination":
          this.fields["pagination"] = new ApiFormPagination(
            initialData && initialData["pagination"]
          );
          break;
        case "text":
          this.fields[fieldMetadata.name] = new ApiFormText(
            fieldMetadata.name,
            initialData && initialData[fieldMetadata.name]
          );
          break;
        case "date_range":
          this.fields[fieldMetadata.name] = new ApiFormDateRangePicker(
            fieldMetadata.name,
            fieldMetadata.required,
            initialData && initialData[fieldMetadata.name]
          );
          break;
        case "submit":
          this.fields["submit"] = new ApiFormSubmit(
            initialData && initialData["submit"]
          );
          break;
        case "remove":
          this.fields[fieldMetadata.name] = new ApiFormRemoveListField(
            fieldMetadata.name,
            initialData && initialData[fieldMetadata.name]
          );
          break;
        case "slider":
          this.fields[fieldMetadata.name] = new ApiFormSlider(
            fieldMetadata.name,
            fieldMetadata.choices,
            fieldMetadata.step,
            fieldMetadata.unit,
            initialData && initialData[fieldMetadata.name]
          );
          break;
        case "price_range":
          this.fields[fieldMetadata.name] = new ApiFormPriceRange(
            fieldMetadata.name,
            initialData && initialData[fieldMetadata.name]
          );
      }
    }
  }

  initialize(context?: GetServerSidePropsContext) {
    this.fetchFunction = (input: string, init?: FetchJsonInit) =>
      jwtFetch(context, input, init);

    const currentUrl =
      context && context.req
        ? new URL(context.req.url || "", `https://${context.req.headers.host}`)
        : new URL(window.location.href);
    const query = currentUrl.searchParams;
    for (const field of Object.values(this.fields)) {
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

    for (const field of Object.values(this.fields)) {
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

  isValid(): boolean {
    return Object.values(this.fields).every((field) => field.isValid());
  }

  getField(name: string): ApiFormField {
    return this.fields[name];
  }
}
