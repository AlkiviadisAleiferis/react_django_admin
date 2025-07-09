import { authAxios } from "./base";
import { appendErrorMessage } from "./cache";
import { redirect } from "react-router-dom";
import { appendMessages, appendSuccessMessage } from "./cache";
import { API_ENDPOINTS, API_BASE_URL } from "../settings";

/* --------------- loader ---------------- */

export async function objectConfirmDeleteLoader({ params, request }) {
    /* ---------------- resolve paths/URLs ---------------- */
    
    const api_path = API_ENDPOINTS.admin_object_delete_confirm(params.app_name, params.model_name, params.object_pk);
    const api_url = API_BASE_URL + api_path;

    let resp_data;

    /* ------------------------------------------------------------ */
    /* 
        SUCCESS CASE 
    */
    try {
        const r = await authAxios.get(api_url);
        resp_data = r.data;

        return {
            object_repr: resp_data.object_repr,
            permissions: resp_data.permissions,
            deleted_objects: resp_data.deleted_objects,
            model_count: resp_data.model_count,
            perms_needed: resp_data.perms_needed,
            protected_: resp_data.protected,
        };
        
    /* ------------------------------------------------------------ */
    /* 
        ERROR CASE
    */
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
        };
    }
}

/* --------------- action ---------------- */

export async function objectDeleteAction({ params, request }) {
    /* ---------------- resolve paths/URLs ---------------- */

    const list_path = `/${params.app_name}/${params.model_name}/`;
    const object_confirm_delete_path = `${list_path}${params.object_pk}/delete/`;
    const object_api_path = API_ENDPOINTS.admin_object(params.app_name, params.model_name, params.object_pk);
    const api_url = API_BASE_URL + object_api_path;

    /* ------------------------------------------------------------ */
    /* 
        SUCCESS CASE 
    */
        try {
        const r = await authAxios.delete(api_url);
        const resp_data = r.data;

        if (resp_data.message) {
            appendSuccessMessage(resp_data.message);
        }

        return redirect(list_path);

    /* ------------------------------------------------------------ */
    /* 
        ERROR CASE
    */
    } catch (error) {
        if (error.response.status == 404) {
            appendMessages("Object not found.");
        }
        return redirect(object_confirm_delete_path);
    }
}
