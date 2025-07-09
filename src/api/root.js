import { getUserInStorage, tokenExpiresSoon } from "../state/user";
import { setCache, getCache, appendErrorMessage } from "./cache";
import { authAxios } from "./base";
import { BASE_INFO_CACHE_TIME } from "../settings";
import { API_ENDPOINTS, API_BASE_URL } from "../settings";

/* 
    Get base info from server
    entities (sidebar entities accessible by user)
    profile (profile for user)
*/

export async function rootLoader({ params }) {
    /*
    chech user in local storage
    and tokens longevity
    clear storages in proper case
    */
    const user_in_storage = getUserInStorage();
    if (
        user_in_storage &&
        (tokenExpiresSoon(user_in_storage.refresh_token) ||
            tokenExpiresSoon(user_in_storage.access_token))
    ) {
        localStorage.clear();
        sessionStorage.clear();
        sessionStorage.setItem("tokenExpired", true);
        
        return { entities: null };
    } else if (user_in_storage === null) {
        localStorage.clear();
        sessionStorage.clear();

        return { entities: null };
    }

    try {
        const cached_base_info = getCache("base_info");
        let base_info;
        const api_base_info_url = API_BASE_URL + API_ENDPOINTS.base_info();

        if (!cached_base_info) {
            const r = await authAxios.get(api_base_info_url);
            setCache("base_info", r.data, BASE_INFO_CACHE_TIME);
            base_info = r.data;
        } else {
            base_info = cached_base_info;
        }

        return { 
            apps: base_info.apps,
            entities: base_info.entities,
            profile: base_info.profile,
        };
    } catch (error) {
        sessionStorage.clear();
        appendErrorMessage("Failed to load basic info.");
        return { entities: null, profile: null };
    }
}
