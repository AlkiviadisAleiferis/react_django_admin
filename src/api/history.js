import { authAxios } from "./base";
import { appendErrorMessage } from "./cache";
import { API_ENDPOINTS, API_BASE_URL } from "../settings";

export async function objectHistoryLoader({ params, request }) {
    /* ---------------- resolve paths/URLs ---------------- */

    const object_history_api_path = API_ENDPOINTS.admin_object_history(params.app_name, params.model_name, params.object_pk);
    const api_url = API_BASE_URL + object_history_api_path;

    // extract URL params from current URL
    const url = new URL(request.url);
    const url_params = url.searchParams.toString();
    const api_url_with_params = api_url + "?" + url_params;

    /* ------------------------------------------------------------ */
    /* 
        SUCCESS CASE 
    */
    try {
        const r = await authAxios.get(api_url_with_params);
        const history_data = r.data;

        return {
            object_repr: history_data.object_repr,
            history_data: history_data.data,
        };
    /* ------------------------------------------------------------ */
    /* 
        ERROR CASE
    */
    } catch (error) {
        if (error.response.status == 404) {
            appendErrorMessage("Object not found.");
        } else if (error.response.status == 403) {
            appendErrorMessage("Not permitted.");
        }

        return {
            object_repr: null,
            history_data: null,
        };
    }
}
