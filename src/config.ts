import {SettingsValueProps} from "./components/settings/type";

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
    MOBILE_HEIGHT: 64,
    MAIN_DESKTOP_HEIGHT: 88,
    DASHBOARD_DESKTOP_HEIGHT: 92,
    DASHBOARD_DESKTOP_OFFSET_HEIGHT: 92 - 32,
};

export const NAVBAR = {
    BASE_WIDTH: 260,
    DASHBOARD_WIDTH: 280,
    DASHBOARD_COLLAPSE_WIDTH: 88,
    //
    DASHBOARD_ITEM_ROOT_HEIGHT: 48,
    DASHBOARD_ITEM_SUB_HEIGHT: 40,
    DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const ICON = {
    NAVBAR_ITEM: 22,
    NAVBAR_ITEM_HORIZONTAL: 20,
};

// SETTINGS
// ----------------------------------------------------------------------

export const cookiesExpires = 3;

export const cookiesKey = {
    themeMode: "themeMode",
    themeDirection: "themeDirection",
    themeColorPresets: "themeColorPresets",
    themeLayout: "themeLayout",
    themeStretch: "themeStretch",
};

export const defaultSettings: SettingsValueProps = {
    themeMode: "dark",
    themeDirection: "ltr",
    themeColorPresets: "orange",
    themeLayout: "horizontal",
    themeStretch: true,
};

export const websiteId = 1;
// export const defaultLlmModel = 'claude-3-5-haiku-latest';
export const defaultLlmModel = 'gpt-4.1-mini';

export const lenovoRetailerTier: Record<string, number[]> = {
    A: [9, 11, 18, 43, 87, 30, 5, 12, 260],
    B: [86, 14, 294, 45, 4880, 788],
};
