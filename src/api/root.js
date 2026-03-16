import { setCache, getCache } from "../cache";
import { authAxios } from "./base";
import { BASE_INFO_CACHE_TIME } from "../settings";
import { API_ENDPOINTS, API_BASE_URL } from "../settings";

export async function rootLoader({ params }) {
    try {
        let base_info = getCache("base_info");

        if (!base_info) {
            const api_base_info_url = API_BASE_URL + API_ENDPOINTS.base_info();
            const r = await authAxios.get(api_base_info_url);
            setCache("base_info", r.data, BASE_INFO_CACHE_TIME);
            base_info = r.data;
        }

        return {
            extra: base_info.extra,
            sidebar: base_info.sidebar,
            profile: base_info.profile
        };
    } catch (error) {
        return {};
    }
}
