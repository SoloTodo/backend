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
  ApiFormDatePicker,
  ApiFormDatePickerProps,
} from "./fields/date_picker/ApiDatePicker";
import { ApiFormSubmit, ApiFormSubmitProps } from "./fields/submit/ApiFormSubmit";
import { ApiFormRemoveListField, ApiFormRemoveListFieldProps } from "./fields/remove/ApiFormRemoveListField";
import { ApiFormRangePicker, ApiFormRangePickerProps } from "./fields/range_picker/ApiFormRangePicker";

export type ApiFormFieldMetadata =
  | ApiFormSelectProps
  | ApiFormPaginationProps
  | ApiFormTextProps
  | ApiFormDatePickerProps
  | ApiFormRangePickerProps
  | ApiFormSubmitProps
  | ApiFormRemoveListFieldProps;
export type ApiFormField =
  | ApiFormSelect
  | ApiFormPagination
  | ApiFormText
  | ApiFormDatePicker
  | ApiFormRangePicker
  | ApiFormSubmit
  | ApiFormRemoveListField;

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
          this.fields[fieldMetadata.name] =
            new ApiFormSelect(
              fieldMetadata.name,
              fieldMetadata.label,
              fieldMetadata.choices,
              fieldMetadata.multiple,
              fieldMetadata.required,
              initialData && initialData[fieldMetadata.name]
            );
          break;
        case "pagination":
          this.fields['pagination'] =
            new ApiFormPagination(
              initialData && initialData['pagination']
            )
          break;
        case "text":
          this.fields[fieldMetadata.name] =
            new ApiFormText(
              fieldMetadata.name,
              fieldMetadata.label,
              fieldMetadata.inputType,
              initialData && initialData[fieldMetadata.name]
            )
          break;
        case "date":
          this.fields[fieldMetadata.name] =
            new ApiFormDatePicker(
              fieldMetadata.name,
              fieldMetadata.label,
              initialData && initialData[fieldMetadata.name]
            )
          break;
        case "date_range":
          this.fields[fieldMetadata.name] =
            new ApiFormRangePicker(
              fieldMetadata.name,
              fieldMetadata.required,
              initialData && initialData[fieldMetadata.name]
            )
          break;
        case "submit":
          this.fields['submit'] =
            new ApiFormSubmit(
              fieldMetadata.name,
              initialData && initialData[fieldMetadata.name]
            )
          break;
        case "remove":
          this.fields[fieldMetadata.name] =
            new ApiFormRemoveListField(
              fieldMetadata.name,
              fieldMetadata.label,
              initialData && initialData[fieldMetadata.name]
            )
          break;
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
    return Object.values(this.fields).every(field => field.isValid());
  }

  getField(name: string): ApiFormField {
    return this.fields[name];
  }
}
