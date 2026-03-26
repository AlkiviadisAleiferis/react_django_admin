import { SITE_PATH_OVERRIDE, ADMIN_SITE_PREFERENCES_OVERRIDE, TOKEN_EXP_OVERHEAD_OVERRIDE, BASE_INFO_CACHE_TIME_OVERRIDE, REACT_APP_DEFAULT_CACHE_TTL_OVERRIDE, AUTHENTICATION_FIELD_NAME_OVERRIDE, API_ENDPOINTS_OVERRIDE } from "./override";

/* ---------------- Messages ---------------- */

export const VERSION = "0.2.0";

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
    info: MESSAGE_TYPE_INFO
};

/* ---------------- Functional Preferences ---------------- */

export const DEFAULT_CACHE_TTL = 300000;

export const TOKEN_EXP_OVERHEAD = TOKEN_EXP_OVERHEAD_OVERRIDE || 30000;

export const BASE_INFO_CACHE_TIME = BASE_INFO_CACHE_TIME_OVERRIDE || 36000;

export const REACT_APP_DEFAULT_CACHE_TTL = REACT_APP_DEFAULT_CACHE_TTL_OVERRIDE || 300000;

export const AUTHENTICATION_FIELD_NAME = AUTHENTICATION_FIELD_NAME_OVERRIDE || "username";

export const SITE_PATH = SITE_PATH_OVERRIDE || {
    object_view: (app_name, model_name, pk) => `/${app_name}/${model_name}/${pk}/`,
    object_add: (app_name, model_name) => `/${app_name}/${model_name}/add/`,
    object_edit: (app_name, model_name, pk) => `/${app_name}/${model_name}/${pk}/edit/`,
    object_delete_confirm: (app_name, model_name, pk) => `/${app_name}/${model_name}/${pk}/delete/`,
    object_history: (app_name, model_name, pk) => `/${app_name}/${model_name}/${pk}/history/`,
    list_action_preview: (app_name, model_name, action_name) => `/${app_name}/${model_name}/action/${action_name}/preview/`,
    list_action_execute: (app_name, model_name, action_name) => `/${app_name}/${model_name}/action/${action_name}/execute/`,
    list: (app_name, model_name) => `/${app_name}/${model_name}/`,
    password_change: () => `/password_change/`,
    action_preview: (app_name, model_name, action_name, select_across, objects_pks_str) => `/${app_name}/${model_name}/action/${action_name}/${select_across}/${objects_pks_str}/`
};

/* ---------------- API endpoints ---------------- */

export const API_ENDPOINTS = {
    // --------------------------------
    // auth
    password_change: () => "password_change/",
    token_obtain_pair: () => "token/",
    token_refresh: () => "token/refresh/",
    // --------------------------------
    // autocomplete
    filter_autocomplete: (app_name, model_name) => `filter_autocomplete/${app_name}/${model_name}/`,
    filter_autocomplete_retrieve_label: (app_name, model_name, pk) => `filter_autocomplete/${app_name}/${model_name}/${pk}/`,
    field_autocomplete: (app, model, fieldname) => `field_autocomplete/?app_label=${app}&model_name=${model}&field_name=${fieldname}&q=`,
    // --------------------------------
    // base info
    base_info: () => "base_info/",
    // --------------------------------
    // list
    admin_list_create: (app_name, model_name) => `${app_name}/${model_name}/`,
    admin_list_info: (app_name, model_name) => `${app_name}/${model_name}/info/`,
    admin_list_action_preview: (app_name, model_name, action_name) => `${app_name}/${model_name}/action/${action_name}/preview/`,
    admin_list_action_execute: (app_name, model_name, action_name) => `${app_name}/${model_name}/action/${action_name}/execute/`,
    // --------------------------------
    // object
    admin_object_view: (app_name, model_name, pk) => `${app_name}/${model_name}/${pk}/view/`,
    admin_object_add: (app_name, model_name) => `${app_name}/${model_name}/add/`,
    admin_object_edit: (app_name, model_name, pk) => `${app_name}/${model_name}/${pk}/edit/`,
    admin_object_delete_confirm: (app_name, model_name, pk) => `${app_name}/${model_name}/${pk}/delete/`,
    admin_object_history: (app_name, model_name, pk) => `${app_name}/${model_name}/${pk}/history/`,
    admin_object: (app_name, model_name, pk) => `${app_name}/${model_name}/${pk}/`,
    // --------------------------------
    // extend for custom views appended manually
    ...API_ENDPOINTS_OVERRIDE
};

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/* ---------------- Visual Preferences ---------------- */

export const ADMIN_SITE_PREFERENCES = {
    //
    // ------------------------
    // DEFAULT THEME
    // ------------------------
    //
    default_theme: "light", // light or dark
    background: {
        backgroundImage: "url(/static/images/body/bg.svg)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 25%",
        height: "100vh"
    },
    //
    // ------------------------
    // LOGIN
    // ------------------------
    //
    login_text: "Welcome to Django Admin Adapter demo",
    login_logo_height: "150px",
    //
    // ------------------------
    // HEADER
    // ------------------------
    //
    // header
    site_name: "Django admin adapter",
    header_classes: "py-3 border-bottom bg-alt",
    user_icon: <i className="fa-regular fa-user text-primary" style={{ fontSize: "25px" }}></i>,
    // index path
    index_path: "/", // where logo link and login leads
    // logo
    logo_height_px: 65,
    logo_svg_path: "/static/images/body/default_logo.svg",
    logo_classes: "brand-image my-auto ms-4",
    //
    // ------------------------
    // SIDEBAR
    // ------------------------
    //
    sidebar_classes: "p-0 m-0 h-100 d-none d-xxl-flex flex-nowrap bg-alt pb-5",
    sidebar_nav_classes: "d-flex flex-column flex-nowrap pb-5 w-100",
    sidebar_link_classes: "sidebar-item nav-link rounded mx-1 p-1 d-flex flex-row" + " align-items-center justify-content-center " + " w-100",
    sidebar_font_size: "14px",
    sidebar_default_icon: "fa-regular fa-circle",
    sidebar_icon_classes: "text-secondary",
    sidebar_icon_height_px: 27,
    //
    // ------------------------
    // BREADCRUMBS
    // ------------------------
    //
    breadcrumbs_add_button_classes: "btn btn-outline-primary px-3 py-1 d-flex " + "flex-row align-items-center justify-content-center" + " ms-auto",
    //
    // ------------------------
    // LIST
    // ------------------------
    //
    list_filters_container_classes: "col-12 col-md-3 col-xxl-2 d-flex flex-column justify-content-center align-items-start filter-container py-2",
    //
    // ------------------------
    // OBJECT
    // ------------------------
    //
    object_content_columns: {
        xs: "12",
        md: "9",
        xl: "6"
    },
    // object actions columns are calculated below
    object_action_columns: {
        xs: "0",
        md: "3",
        xl: "2"
    },
    object_action_and_container_classes: "p-0 mx-0 w-100 justify-content-center",
    object_action_icon_size: "30px",
    object_actions_container_classes: "d-flex flex-md-column flex-row px-2 py-0 justify-content-center align-items-center",
    object_container_classes: "p-4 rounded shadow bg-alt",
    object_tabs_classes: "mb-5 d-flex justify-content-center",
    // view link icon
    object_view_link_icon: (id, extra_classes) => {
        let opts = {};
        if (id) {
            opts.id = id;
        }
        return <i className={"fa-solid fa-eye fa-xl text-primary" + (extra_classes || "")} style={{ fontSize: "20px" }} {...opts}></i>;
    },
    // add related link icon
    object_add_link_icon: (id, extra_classes) => {
        let opts = {};
        if (id) {
            opts.id = id;
        }
        return <i className={"fa-solid fa-square-plus text-primary " + (extra_classes || "")} style={{ fontSize: "20px" }} {...opts}></i>;
    },
    //
    // ------------------------
    // O V E R R I D E
    // ------------------------
    //
    ...ADMIN_SITE_PREFERENCES_OVERRIDE
};

// if object actions columns are not pre-set,
// they will be calculated automatically here
if (!Object.keys(ADMIN_SITE_PREFERENCES.object_content_columns).length) {
    for (let breakpoint in ADMIN_SITE_PREFERENCES.object_content_columns) {
        ADMIN_SITE_PREFERENCES.object_action_columns[breakpoint] = 12 - ADMIN_SITE_PREFERENCES.object_content_columns[breakpoint];
    }
}
