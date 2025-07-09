import { authAxios } from "./base";
import {
    setCache,
    getCache,
    appendErrorMessage,
} from "./cache";
import { API_ENDPOINTS, API_BASE_URL } from "../settings";

export async function listLoader({ params, request }) {
    /* ---------------- resolve paths/URLs ---------------- */
    const list_api_path = API_ENDPOINTS.admin_list_create(params.app_name, params.model_name);
    const list_api_url = API_BASE_URL + list_api_path;

    const list_info_api_path = API_ENDPOINTS.admin_list_info(params.app_name, params.model_name);
    const list_info_api_url = API_BASE_URL + list_info_api_path;

    const info_cache_name = `${params.app_name}_${params.model_name}_info`;

    // extract URL params from current URL
    const url = new URL(request.url);
    const url_params = url.searchParams.toString();
    const list_url_with_params = list_api_url + "?" + url_params;

    let list_data;
    let list_info;

    /* ------------------------------------------------------------ */
    /* 
        SUCCESS CASE 
    */
    try {
        // seperate calls are made due to filter prolonged caching

        // ---- list info (filters + actions)
        const cached_list_info = getCache(info_cache_name);

        if (!cached_list_info) {
            const r = await authAxios.get(list_info_api_url);
            setCache(info_cache_name, r.data, 10800);
            list_info = r.data;
        } else {
            list_info = cached_list_info;
        }

        // ---- list data
        const r = await authAxios.get(list_url_with_params);
        list_data = r.data;

        return {
            list_data: list_data,
            filters: list_info.filters,
            actions: list_info.actions,
            list_extra_data: list_info.list_extra_data,
        };
    /* ------------------------------------------------------------ */
    /* 
        ERROR CASE
    */
    } catch (error) {
        const response_data = error.response.data;

        if (response_data && response_data.message) {
            appendErrorMessage(response_data.message);
        }

        return {
            list_data: {
                results: null,
                page: null,
                total_pages: null,
                total_objects_num: null,
                list_max_show_all: null,
            },
            filters: null,
            actions: null,
            list_extra_data: null,
        };
    }
}
