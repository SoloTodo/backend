import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { ReactUtilsState } from "./redux";
import { RootState } from "src/store/store"; 
import { HYDRATE } from "../nextjs/StoreWrapper";

import { UserState } from "../types/user";


// Slices
// ----------------------------------------------------------------------

const initialState: UserState = null as UserState;

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (_state, action: PayloadAction<UserState>) => {
            return action.payload
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.user,
            };
        },
    },
});

export default userSlice;

export function useUser(state: RootState) {
    return state.user
}