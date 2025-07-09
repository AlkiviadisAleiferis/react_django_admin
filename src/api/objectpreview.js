import { authAxios } from "./base";
import { appendErrorMessage } from "./cache";
import { API_ENDPOINTS, API_BASE_URL } from "../settings";

export async function objectPreviewLoader({ params, request }) {
    /* ---------------- resolve paths/URLs ---------------- */

    const object_api_path = API_ENDPOINTS.admin_object(params.app_name, params.model_name, params.object_pk);
    const api_url = API_BASE_URL + object_api_path;

    /* ------------------------------------------------------------ */
    /* 
        SUCCESS CASE 
    */
    try {
        const r = await authAxios.get(api_url);
        const object_data = r.data;

        return {
            object: object_data.object,
            object_repr: object_data.object_repr,
            fieldsets: object_data.fieldsets,
            permissions: object_data.permissions,
            inlines: object_data.inlines,
        };
    /* ------------------------------------------------------------ */
    /* 
        ERROR CASE
    */
    } catch (error) {
        if (error.response.status == 404) {
            appendErrorMessage("Object not found.");
        } else if (error.response.status == 400) {
            appendErrorMessage("Not found.");
        }

        return {
            object: null,
            object_repr: null,
            fieldsets: null,
            permissions: null,
            inlines: null,
        };
    }
}
