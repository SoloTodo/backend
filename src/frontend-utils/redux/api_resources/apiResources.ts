import { Country } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiSettings } from "../../settings";
import {GetServerSidePropsContext} from "next";
import { jwtFetch } from "../../nextjs/utils";
import { ReactUtilsDispatch } from "../redux";

type ApiResourceObject = Country;
type ApiResourceObjectRecord = Record<string, ApiResourceObject>;

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
});

export function updateApiResourceObjects(
  resourceName: keyof typeof apiSettings.apiResourceEndpoints,
  context?: GetServerSidePropsContext
) {
  return async function fetchResourceObjectsThunk(
    dispatch: ReactUtilsDispatch
  ) {
    const endpoint = apiSettings.apiResourceEndpoints[resourceName];
    const res = await jwtFetch(context, endpoint);
    dispatch(apiResourceObjectsSlice.actions.addApiResourceObjects(res));
  };
}

export default apiResourceObjectsSlice;
