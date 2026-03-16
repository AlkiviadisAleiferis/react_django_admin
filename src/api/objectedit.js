import { authAxios } from "./base";
import { appendSuccessMessage, appendErrorMessage } from "../state/messages";
import { redirect } from "react-router-dom";
import { API_ENDPOINTS, API_BASE_URL, SITE_PATH } from "../settings";

export async function objectEditLoader({ params, request }) {
    const api_path = API_ENDPOINTS.admin_object_edit(params.app_name, params.model_name, params.object_pk);
    const api_url = API_BASE_URL + api_path;

    try {
        const r = await authAxios.get(api_url);
        return {
            object_repr: r.data.object_repr,
            app: r.data.app,
            model: r.data.model,
            fieldsets: r.data.fieldsets,
            readonly_fields: r.data.readonly_fields,
            fields: r.data.fields,
            inlines: r.data.inlines
        };
    } catch (error) {
        const null_data = {
            object_repr: null,
            app: null,
            model: null,
            fieldsets: null,
            readonly_fields: null,
            fields: null,
            inlines: null
        };

        if (error.response.status == 400) {
            return null_data;
        } else if (error.response.status == 404) {
            appendErrorMessage("Object not found.");
            return null_data;
        } else {
            return null_data;
        }
    }
}

export async function objectEditAction({ params, request }) {
    const object_view_path = SITE_PATH.object_view(params.app_name, params.model_name, params.object_pk);
    const object_edit_path = SITE_PATH.object_edit(params.app_name, params.model_name, params.object_pk);
    const object_api_path = API_ENDPOINTS.admin_object(params.app_name, params.model_name, params.object_pk);
    const api_url = API_BASE_URL + object_api_path;

    const formData = await request.formData();

    try {
        const r = await authAxios.put(api_url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        const response_data = r.data;

        if (response_data.messages) {
            for (let msg of response_data.messages) {
                appendSuccessMessage(msg);
            }
        } else if (r.status == 200) {
            appendSuccessMessage("Successfully updated the object.");
        }

        return redirect(object_view_path);
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
                    "non_forms_errors": [str, str, ...],
                },
                "inline_name" : {...},
                ...
            }
        }
        -----------------------------------------------------------------
        */

        if (response_status == 400 && response_data.error_data) {
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
            return redirect(object_edit_path);
        }
    }
}
