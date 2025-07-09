import { authAxios } from "./base";
import {
    appendMessages,
    appendSuccessMessage,
    appendErrorMessage,
} from "./cache";
import { redirect } from "react-router-dom";
import { setCache, getCache } from "./cache";
import { API_ENDPOINTS, API_BASE_URL } from "../settings";

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
            app: add_data_cache.app,
            model: add_data_cache.model,
            fieldsets: add_data_cache.fieldsets,
            readonly_fields: add_data_cache.readonly_fields,
            fields: add_data_cache.fields,
            inlines: add_data_cache.inlines,
        }
    }

    try {
        const r = await authAxios.get(api_url);
        setCache(add_data_cache_name, r.data, 20);
        return {
            app: r.data.app,
            model: r.data.model,
            fieldsets: r.data.fieldsets,
            readonly_fields: r.data.readonly_fields,
            fields: r.data.fields,
            inlines: r.data.inlines,
        };
    } catch (error) {
        if (error.response.status == 400) {
            appendErrorMessage("An error occured.");
        } else if (error.response.status == 404) {
            appendErrorMessage("Object not found.");
        }
        return {
            app: null,
            model: null,
            fieldsets: null,
            readonly_fields: null,
            fields: null,
            inlines: null,
        };
    }
}

export async function objectAddAction({ params, request }) {
    /* ---------------- resolve paths/URLs ---------------- */

    const object_add_path = `/${params.app_name}/${params.model_name}/add/`;
    const list_create_api_path = API_ENDPOINTS.admin_list_create(params.app_name, params.model_name);

    const object_add_url = API_BASE_URL + list_create_api_path;

    const formData = await request.formData();

    // ------------------------------------------------------------
    // SUCCESS CASE
    try {
        const r = await authAxios.post(object_add_url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const response_data = r.data;

        if (response_data.message) {
            appendSuccessMessage(response_data.message);
        } else if (r.status == 201) {
            appendSuccessMessage("Successfully CREATED the object.");
        }
        
        const new_object_pk = response_data.object.pk;
        const object_path = `/${params.app_name}/${params.model_name}/${new_object_pk}/`;

        return redirect(object_path);
    // ------------------------------------------------------------
    // ERROR CASE
    } catch (error) {
        const response_data = error.response.data ? error.response.data : {};
        const response_status = error.response.status;

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
                    "non_forms_errors": html_string,
                },
                "inline_name" : {...},
                ...
            }
        }
        -----------------------------------------------------------------
        */

        if (response_status == 400 && response_data) {
            // 400 status - form / inlines errors

            appendErrorMessage("Please correct the errors below.");

            // get non field errors and turn them to messages
            if ("__all__" in response_data.error_data) {
                for (let m of response_data.error_data["__all__"]) {
                    appendErrorMessage(m["message"]);
                }
            }

            return {
                error_data: response_data.error_data,
                inlines_error_data: response_data.inlines_error_data,
            };
        } else {
            return redirect(object_add_path);
        }
    }
}
