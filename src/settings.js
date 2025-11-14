import { 
    ADMIN_SITE_PREFERENCES_OVERRIDE,
    BACKGROUND_IMAGE_OVERRIDE,
    LOADING_GIF_OVERRIDE,
    BASE_INFO_CACHE_TIME_OVERRIDE,
    REACT_APP_DEFAULT_CACHE_TTL_OVERRIDE,
    AUTHENTICATION_FIELD_NAME_OVERRIDE,
    OBJECT_ACTION_ICON_SIZE_OVERRIDE,
    CONTENT_COLUMNS_OVERRIDE,
    API_ENDPOINTS_OVERRIDE,
    CUSTOM_VIEW_API_ENDPOINTS_OVERRIDE,
} from "./override";

/* ---------------- Messages ---------------- */

export const MESSAGE_TYPE_FAILURE = "F";
export const MESSAGE_TYPE_SUCCESS = "S";
export const MESSAGE_TYPE_WARNING = "W";
export const MESSAGE_TYPE_CRITICAL = "C";
export const MESSAGE_TYPE_INFO = "I";

export const MESSAGE_TYPE = {
    error: MESSAGE_TYPE_FAILURE,
    success: MESSAGE_TYPE_SUCCESS,
    warning: MESSAGE_TYPE_WARNING,
    critical: MESSAGE_TYPE_CRITICAL,
    info: MESSAGE_TYPE_INFO,
};

/* ---------------- Functional Preferences ---------------- */

export const BASE_INFO_CACHE_TIME = BASE_INFO_CACHE_TIME_OVERRIDE || 36000;

export const REACT_APP_DEFAULT_CACHE_TTL = REACT_APP_DEFAULT_CACHE_TTL_OVERRIDE || 300000;

export const AUTHENTICATION_FIELD_NAME = AUTHENTICATION_FIELD_NAME_OVERRIDE || "username";

/* ---------------- API endpoints ---------------- */

export const API_ENDPOINTS = {
    // --------------------------------
    // auth
    "password_change": () =>  "password_change/",
    "token_obtain_pair": () =>  "token/",
    "token_refresh": () =>  "token/refresh/",
    // --------------------------------
    // autocomplete
    "filter_autocomplete": (app_name, model_name) => `filter_autocomplete/${app_name}/${model_name}/`,
    "filter_autocomplete_retrieve_label": (app_name, model_name, pk) => `filter_autocomplete/${app_name}/${model_name}/${pk}/`,
    "field_autocomplete": (app,model,fieldname) => `field_autocomplete/?app_label=${app}&model_name=${model}&field_name=${fieldname}&q=`,
    // --------------------------------
    // base info
    "base_info": () => "base_info/",
    // --------------------------------
    // list
    "admin_list_create": (app_name, model_name) => `${app_name}/${model_name}/`,
    "admin_list_info": (app_name, model_name) => `${app_name}/${model_name}/info/`,
    "admin_list_action_preview": (app_name, model_name, action_name) => `${app_name}/${model_name}/action/${action_name}/preview/`,
    "admin_list_action_execute": (app_name, model_name, action_name) => `${app_name}/${model_name}/action/${action_name}/execute/`,
    // --------------------------------
    // object
    "admin_object_add": (app_name, model_name) => `${app_name}/${model_name}/add/`,
    "admin_object_edit": (app_name, model_name, pk) => `${app_name}/${model_name}/${pk}/edit/`,
    "admin_object_delete_confirm": (app_name, model_name, pk) => `${app_name}/${model_name}/${pk}/delete/`,
    "admin_object_history": (app_name, model_name, pk) => `${app_name}/${model_name}/${pk}/history/`,
    "admin_object": (app_name, model_name, pk) => `${app_name}/${model_name}/${pk}/`,
    // --------------------------------
    // extend for custom views appended manually
    ...API_ENDPOINTS_OVERRIDE
};

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const CUSTOM_VIEW_API_ENDPOINTS = {...CUSTOM_VIEW_API_ENDPOINTS_OVERRIDE};

/* ---------------- Visual Preferences ---------------- */

export const ADMIN_SITE_PREFERENCES = {
    site_name: "Django Admin Adapter",
    login_text: "Welcome to Django Admin",
    // logo
    logo_height_px: 55,
    logo_svg_path: "/static/images/body/default_logo.svg",
    logo_classes: "brand-image my-auto mx-0",
    // sidebar
    sidebar_icon_height_px: 35,
    sidebar_classes: "p-0 m-0 border-end border-bottom",
    header_classes: "border-bottom p-3 shadow-sm",
    // overriding
    ...ADMIN_SITE_PREFERENCES_OVERRIDE
};

export const BACKGROUND_IMAGE = {
    backgroundImage: "url(/static/images/body/default_bg.svg)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50% 25%",
    height: "100vh",
    ...BACKGROUND_IMAGE_OVERRIDE
};

export const LOADING_GIF = {
    path: "/static/images/body/animations/default_loading.gif",
    classes: "mx-auto",
    width: 80,
    ...LOADING_GIF_OVERRIDE
};

export const OBJECT_ACTION_ICON_SIZE = OBJECT_ACTION_ICON_SIZE_OVERRIDE || "30px";

export const CONTENT_COLUMNS = {
    xs: "12",
    md: "10",
    ...CONTENT_COLUMNS_OVERRIDE
};

let ACTIONS_COLS = {};

for (let breakpoint in CONTENT_COLUMNS) {
    ACTIONS_COLS[breakpoint] = 12 - CONTENT_COLUMNS[breakpoint];
}

/* ---------------- ---------------- ---------------- */

export { ACTIONS_COLS }
