import { configureStore } from "@reduxjs/toolkit"
import apiResourceObjectsSlice from "./api_resources/apiResources"
import userSlice from "./user"

const reactUtilsStore = configureStore({
    reducer: {
        user: userSlice.reducer,
        apiResourceObjects: apiResourceObjectsSlice.reducer
    }
})

export type ReactUtilsState = ReturnType<typeof reactUtilsStore.getState>
export type ReactUtilsDispatch = typeof reactUtilsStore.dispatch