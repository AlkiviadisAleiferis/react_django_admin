import { authAxios } from "./base";
import { appendErrorMessage } from "../state/messages";
import { redirect } from "react-router-dom";
import { appendSuccessMessage } from "../state/messages";
import { API_ENDPOINTS, API_BASE_URL, SITE_PATH } from "../settings";

export async function objectConfirmDeleteLoader({ params, request }) {
    const api_path = API_ENDPOINTS.admin_object_delete_confirm(params.app_name, params.model_name, params.object_pk);
    const api_url = API_BASE_URL + api_path;

    try {
        const r = await authAxios.get(api_url);
        const response_data = r.data;

        return {
            object_repr: response_data.object_repr,
            permissions: response_data.permissions,
            deleted_objects: response_data.deleted_objects,
            model_count: response_data.model_count,
            perms_needed: response_data.perms_needed,
            protected_: response_data.protected,
            extra_data: response_data.extra_data
        };
    } catch (error) {
        if (error.response.status == 404) {
            appendErrorMessage("Object not found.");
        }

        return {
            object_repr: null,
            permissions: null,
            deleted_objects: null,
            model_count: null,
            perms_needed: null,
            protected_: null,
            extra_data: null
        };
    }
}

export async function objectDeleteAction({ params, request }) {
    const list_path = SITE_PATH.list(params.app_name, params.model_name);
    const object_delete_confirm_path = SITE_PATH.object_delete_confirm(params.app_name, params.model_name, params.object_pk);
    const api_path = API_ENDPOINTS.admin_object(params.app_name, params.model_name, params.object_pk);
    const api_url = API_BASE_URL + api_path;

    try {
        const r = await authAxios.delete(api_url);
        const response_data = r.data;

        if (response_data.messages) {
            for (let msg of response_data.messages) {
                appendSuccessMessage(msg);
            }
        }

        return redirect(list_path);
    } catch (error) {
        if (error.response.status == 404) {
            appendErrorMessage("Object not found.");
            return redirect(list_path);
        }

        return redirect(object_delete_confirm_path);
    }
}
