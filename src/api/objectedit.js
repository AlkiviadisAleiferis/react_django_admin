import { authAxios } from "./base";
import {
    appendSuccessMessage,
    appendErrorMessage,
} from "./cache";
import { redirect } from "react-router-dom";
import { API_ENDPOINTS, API_BASE_URL } from "../settings";

export async function objectEditLoader({ params, request }) {
    /* ---------------- resolve paths/URLs ---------------- */

    const api_path = API_ENDPOINTS.admin_object_edit(params.app_name, params.model_name, params.object_pk);
    const api_url = API_BASE_URL + api_path;

    try {
        const r = await authAxios.get(api_url);
        return {
            app: r.data.app,
            model: r.data.model,
            object_repr: r.data.object_repr,
            fieldsets: r.data.fieldsets,
            readonly_fields: r.data.readonly_fields,
            fields: r.data.fields,
            inlines: r.data.inlines,
        };
    } catch (error) {
        if (error.response.status == 400) {
            appendErrorMessage("An error occured.");
            return {
                app: null,
                model: null,
                object_repr: null,
                fieldsets: null,
                readonly_fields: null,
                fields: null,
                inlines: null,
            };
        } else if (error.response.status == 404) {
            appendErrorMessage("Object not found.");
            return {
                app: null,
                model: null,
                object_repr: null,
                fieldsets: null,
                readonly_fields: null,
                fields: null,
                inlines: null,
            };
        } else {
            return {
                app: null,
                model: null,
                object_repr: null,
                fieldsets: null,
                readonly_fields: null,
                fields: null,
                inlines: null,
            };
        }
    }
}

export async function objectEditAction({ params, request }) {
    /* ---------------- resolve paths/URLs ---------------- */
    const object_path = `/${params.app_name}/${params.model_name}/${params.object_pk}/`
    const object_edit_path = `${object_path}edit/`
    const object_api_path = API_ENDPOINTS.admin_object(params.app_name, params.model_name, params.object_pk);

    const api_url = API_BASE_URL + object_api_path;

    const formData = await request.formData();

    /* ------------------------------------------------------------ */
    /* 
        SUCCESS CASE 
    */
    try {
        const r = await authAxios.put(api_url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const response_data = r.data;

        if (response_data.message) {
            appendSuccessMessage(response_data.message);
        } else if (r.status == 200) {
            appendSuccessMessage("Successfully UPDATED the object.");
        }

        return redirect(object_path);

    /* ------------------------------------------------------------ */
    /* 
    ERROR CASE
    */
    } catch (error) {
        const response_data = error.response.data ? error.response.data : {};
        const response_status = error.response.status;

        if (response_status == 400 && response_data.error_data) {
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
            return redirect(object_edit_path);
        }
    }
}
