import { getCache } from "./cache";
import { ADMIN_SITE_PREFERENCES } from "./settings";

export function augment_query_string(param_name, param_value) {
    let url_params = new URLSearchParams(window.location.search);

    if (url_params.has(param_name)) {
        url_params.delete(param_name);
    }

    if (url_params.toString()) {
        return "?" + url_params.toString() + `&${param_name}=${param_value}`;
    } else {
        return `?${param_name}=${param_value}`;
    }
}

export function filter_query_string(param_name) {
    let url_params = new URLSearchParams(window.location.search);

    if (url_params.has(param_name)) {
        url_params.delete(param_name);
    }

    return "?" + url_params.toString();
}

export function get_query_param_value(param_name) {
    let url_params = new URLSearchParams(window.location.search);
    return url_params.has(param_name) ? url_params.get(param_name) : null;
}

export function get_field_display_name(fieldname) {
    return fieldname.charAt(0).toUpperCase() + fieldname.replaceAll("_", " ").slice(1);
}

export function get_random_num() {
    return Math.round(Math.random() * 10000);
}

export function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function get_model_entry(app_name, model_name) {
    const base_info = getCache("base_info");

    if (base_info && base_info.sidebar.length) {
        for (let entry of base_info.sidebar) {
            if (
                entry.type == "model" &&
                entry.model_name == model_name &&
                entry.app_name == app_name
            ) {
                return entry;
            } else if (entry.type == "dropdown") {
                for (let inner_entry of entry.dropdown_entries) {
                    if (
                        inner_entry.type == "model" &&
                        inner_entry.model_name == model_name &&
                        inner_entry.app_name == app_name
                    ) {
                        return inner_entry;
                    }
                }
            }
        }
    }
    return null;
}

function get_view_entry(view_name) {
    const base_info = getCache("base_info");

    if (base_info && base_info.sidebar.length) {
        for (let entry of base_info.sidebar) {
            if (entry.type == "view" && entry.view_name == view_name) {
                return entry;
            } else if (entry.type == "dropdown") {
                for (let inner_entry of entry.dropdown_entries) {
                    if (inner_entry.type == "view" && inner_entry.view_name == view_name) {
                        return inner_entry;
                    }
                }
            }
        }
    }
    return null;
}

export function check_model_add_permission(app_name, model_name) {
    const entry = get_model_entry(app_name, model_name);
    if (entry) {
        return Boolean(entry.permissions.add);
    }
    return false;
}

export function get_model_label(app_name, model_name) {
    if (!app_name || !model_name) {
        return null;
    }
    const entry = get_model_entry(app_name, model_name);
    if (entry) {
        return entry.label;
    }
    return null;
}

export function get_view_label(view_name) {
    if (!view_name) {
        return null;
    }
    const entry = get_view_entry(view_name);
    if (entry) {
        return entry.label;
    }
    return null;
}
