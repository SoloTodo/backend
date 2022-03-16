import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppDispatch, RootState} from "./store";
import nookies from "nookies";

export type Config = {
    sidebarShow: boolean,
    darkTheme: boolean
}

const initialState:Config = {
    sidebarShow: true,
    darkTheme: false
}

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        toggleSidebarShow: state => {
            return {
                ...state,
                sidebarShow: !state.sidebarShow
            }
        },
        setSidebarShow: (state, newState:PayloadAction<boolean>) => {
            return {
                ...state,
                sidebarShow: newState.payload
            }
        },
        setDarkTheme: (state, newState:PayloadAction<boolean>) => {
            return {
                ...state,
                darkTheme: newState.payload
            }
        }

    }
});

export default configSlice;

export function useSidebarShow(state:RootState) {
    return state.config.sidebarShow
}

export function useDarkTheme(state:RootState) {
    return state.config.darkTheme
}

export function setDarkTheme(newValue:boolean, saveCookie:boolean=false) {
    return (dispatch:AppDispatch) => {
        if (saveCookie) {
            nookies.set(null, 'useDarkTheme', String(Number(newValue)))
        }

        dispatch(configSlice.actions.setDarkTheme(newValue))
    }
}