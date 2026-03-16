import { authAxios } from "./base";
import { setCache, getCache } from "../cache";
import { appendErrorMessage } from "../state/messages";
import { API_ENDPOINTS, API_BASE_URL } from "../settings";

export async function listLoader({ params, request }) {
    /* ---------------- resolve paths/URLs ---------------- */
    const list_api_path = API_ENDPOINTS.admin_list_create(params.app_name, params.model_name);
    const list_api_url = API_BASE_URL + list_api_path;
    const list_info_api_path = API_ENDPOINTS.admin_list_info(params.app_name, params.model_name);
    const list_info_api_url = API_BASE_URL + list_info_api_path;
    const info_cache_name = `${params.app_name}_${params.model_name}_info`;

    // extract URL params from current URL
    // like actual django admin
    // ChangeList utilizes the GET parameters
    // the same way
    const url = new URL(request.url);
    const url_params = url.searchParams.toString();
    const list_url_with_params = list_api_url + "?" + url_params;

    let list_data;
    let list_info;

    /* ------------------------------------------------------------ */
    try {
        // seperate calls are made
        // due to filter prolonged caching

        // ---- list info (filters + actions)
        list_info = getCache(info_cache_name);

        if (!list_info) {
            const r = await authAxios.get(list_info_api_url);
            setCache(info_cache_name, r.data, 10800);
            list_info = r.data;
        }

        // ---- list data
        const r = await authAxios.get(list_url_with_params);
        list_data = r.data;

        return {
            list_data: list_data,
            filters: list_info.filters,
            actions: list_info.actions,
            extra_data: list_info.extra_data,
            list_max_show_all: list_info.list_max_show_all,
            sortable_by: list_info.sortable_by
        };
    } catch (error) {
        const response_data = error.response.data;

        if (response_data && response_data.messages) {
            for (let m of response_data.messages) {
                appendErrorMessage(m);
            }
        }

        return {
            list_data: {
                results: null,
                page: null,
                total_pages: null,
                total_objects_num: null
            },
            filters: null,
            actions: null,
            extra_data: null,
            list_max_show_all: null,
            sortable_by: null
        };
    }
}
