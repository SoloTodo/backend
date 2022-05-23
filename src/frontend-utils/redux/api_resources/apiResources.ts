import { Country, Currency, StoreType } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/store/store";
import { HYDRATE } from "next-redux-wrapper";
import { Category, Store } from "src/frontend-utils/types/store";
import { apiSettings } from "src/frontend-utils/settings";

export type ApiResourceObject = Currency | Country | StoreType | Category | Store;
export type ApiResourceObjectRecord = Record<string, ApiResourceObject>;

const initialState = {} as ApiResourceObjectRecord;

const apiResourceObjectsSlice = createSlice({
  name: "apiResourceObjects",
  initialState,
  reducers: {
    addApiResourceObjects: (
      state,
      action: PayloadAction<ApiResourceObject[]>
    ) => {
      const newState = { ...state };
      for (const apiResourceObject of action.payload) {
        newState[apiResourceObject.url] = apiResourceObject;
      }
      return newState;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.apiResourceObjects,
      };
    },
  },
});

export function useApiResourceObjects(state: RootState) {
  return state.apiResourceObjects;
}

export function selectApiResourceObjects(
  apiResourceObjects: ApiResourceObjectRecord,
  resourceName: string
) {
  return Object.values(apiResourceObjects).reduce(
    (acc: { label: string; value: number }[], r) => {
      if (r.url.includes(resourceName)) {
        return [...acc, { label: r.name, value: r.id }];
      }
      return acc;
    },
    []
  );
}

export function getApiResourceObject(
  apiResourceObjects: ApiResourceObjectRecord,
  resourceName: string,
  resourceId: string
) {
  const resourceUrl = `${apiSettings.endpoint}${resourceName}/${resourceId}/`;
  return apiResourceObjects[resourceUrl];
}

export function getApiResourceObjects(
  apiResourceObjects: ApiResourceObjectRecord,
  resourceName: string,
) {
  return Object.values(apiResourceObjects).reduce((acc: ApiResourceObject[], r) => {
    if (r.url.includes(resourceName)) {
      return [ ...acc, r ];
    }
    return acc;
  }, []);
}

export default apiResourceObjectsSlice;
