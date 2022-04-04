import { Country, StoreType } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { apiSettings } from "../../settings";
// import { NextPageContext } from "next";
// import { jwtFetch } from "../../nextjs/utils";
import { RootState } from "src/store/store";
import { HYDRATE } from "next-redux-wrapper";

export type ApiResourceObject = Country | StoreType;
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

// export function updateApiResourceObjects(
//   resourceName: keyof typeof apiSettings.apiResourceEndpoints,
//   context?: NextPageContext
// ) {
//   return async function fetchResourceObjectsThunk(
//     dispatch: ReactUtilsDispatch
//   ) {
//     const endpoint = apiSettings.apiResourceEndpoints[resourceName];
//     const res = await jwtFetch(context, endpoint);
//     dispatch(apiResourceObjectsSlice.actions.addApiResourceObjects(res));
//   };
// }

export default apiResourceObjectsSlice;
