import { authAxios } from "./base";
import { appendSuccessMessage, appendErrorMessage } from "../state/messages";
import { redirect } from "react-router-dom";
import { setCache, getCache } from "../cache";
import { API_ENDPOINTS, API_BASE_URL, SITE_PATH } from "../settings";

export async function objectAddLoader({ params, request }) {
    /* ---------------- resolve paths/URLs ---------------- */
    const object_add_api_path = API_ENDPOINTS.admin_object_add(params.app_name, params.model_name);
    const api_url = API_BASE_URL + object_add_api_path;

    const add_data_cache_name = `${params.app_name}_${params.model_name}_add_related_data`;
    const add_data_cache = getCache(add_data_cache_name);

    // // extract URL params from current URL
    // const url = new URL(request.url);
    // const url_params = url.searchParams.toString();
    // const api_url_with_params = api_url + "?" + url_params;

    if (add_data_cache) {
        return {
            model: add_data_cache.model,
            app: add_data_cache.app,
            fieldsets: add_data_cache.fieldsets,
            readonly_fields: add_data_cache.readonly_fields,
            fields: add_data_cache.fields,
            inlines: add_data_cache.inlines,
            extra_data: add_data_cache.extra_data
        };
    }

    try {
        const r = await authAxios.get(api_url);
        setCache(add_data_cache_name, r.data);

        return {
            model: r.data.model,
            app: r.data.app,
            fieldsets: r.data.fieldsets,
            readonly_fields: r.data.readonly_fields,
            fields: r.data.fields,
            inlines: r.data.inlines,
            extra_data: r.data.extra_data
        };
    } catch (error) {
        if (error.response.status == 404) {
            appendErrorMessage("Object not found.");
        }
        return {
            model: null,
            app: null,
            fieldsets: null,
            readonly_fields: null,
            fields: null,
            inlines: null,
            extra_data: null
        };
    }
}

export async function objectAddAction({ params, request }) {
    /* ---------------- resolve paths/URLs ---------------- */

    const object_add_path = SITE_PATH.object_add(params.app_name, params.model_name);
    const list_create_api_path = API_ENDPOINTS.admin_list_create(params.app_name, params.model_name);
    const object_add_url = API_BASE_URL + list_create_api_path;

    const formData = await request.formData();

    try {
        const r = await authAxios.post(object_add_url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        const response_data = r.data;

        if (response_data.messages) {
            for (let msg of response_data.messages) {
                appendSuccessMessage(msg);
            }
        } else if (r.status == 201) {
            appendSuccessMessage("Successfully created the object.");
        }

        const new_object_pk = response_data.object.pk;
        const object_path = SITE_PATH.object_view(params.app_name, params.model_name, new_object_pk);

        return redirect(object_path);
    } catch (error) {
        const response_data = error.response && error.response.data ? error.response.data : {};
        const response_status = error.response ? error.response.status : null;
        /* 
        -----------------------------------------------------------------
        In case of erros the following format is given in reasponse data:
        -----------------------------------------------------------------
        {
            "error_data" : {
                "__all__": [str, str, ...],
                "fieldname": [str, str, ...],
                ...
            },
            "inlines_error_data" : {
                "inline_name" : {
                    "forms_errors": {
                        "__all__": [str, str, ...], 
                        "fieldname" : [str, str, ...], 
                        ... 
                    },
                    "non_forms_errors": [str, str, ...],
                },
                "inline_name" : {...},
                ...
            }
        }
        -----------------------------------------------------------------
        */

        if (response_status == 400 && response_data) {
            // 400 status - form + inlines errors
            appendErrorMessage("Please correct the errors below.");

            // get non field errors and turn them to messages
            if ("__all__" in response_data.error_data) {
                for (let m of response_data.error_data["__all__"]) {
                    appendErrorMessage(m["message"]);
                }
            }

            return {
                error_data: response_data.error_data,
                inlines_error_data: response_data.inlines_error_data
            };
        } else {
            return redirect(object_add_path);
        }
    }
}
