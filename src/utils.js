export function augment_query_string(param_name, param_value) {
    let url_params = new URLSearchParams(window.location.search);

    if (url_params.has(param_name)) {
        url_params.delete(param_name);
    }

    let new_query_string;

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
    return (
        fieldname.charAt(0).toUpperCase() +
        fieldname.replaceAll("_", " ").slice(1)
    );
}

export function get_random_key_num() {
    return Math.round(Math.random() * 10000000000000);
}

export function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export function check_model_add_permission(base_info, model_name) {
    let can_add = false;

    if (base_info) {
        for (let app_name in base_info.entities) {
            const models = base_info.entities[app_name];

            for (let model_info of models) {
                if (
                    model_info.model_name === model_name &&
                    model_info.permissions.add
                ) {
                    can_add = true;
                    break;
                }
            }

            if (can_add) {
                break;
            }
        }
    }

    return can_add;
}

export function get_model_verbose_name(base_info, model_name) {
    if (base_info) {
        for (let app_name in base_info.entities) {
            const models = base_info.entities[app_name];

            for (let model_info of models) {
                if (model_info.model_name === model_name) {
                    return model_info.name;
                }
            }
        }
    }

    return null;
}
