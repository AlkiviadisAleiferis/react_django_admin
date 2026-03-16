import { authAxios } from "./base";
import { appendErrorMessage } from "../state/messages";
import { API_ENDPOINTS, API_BASE_URL } from "../settings";

export async function objectViewLoader({ params, request }) {
    const object_api_path = API_ENDPOINTS.admin_object_view(params.app_name, params.model_name, params.object_pk);
    const api_url = API_BASE_URL + object_api_path;

    try {
        const r = await authAxios.get(api_url);
        const object_data = r.data;

        return {
            object: object_data.object,
            object_repr: object_data.object_repr,
            fieldsets: object_data.fieldsets,
            permissions: object_data.permissions,
            inlines: object_data.inlines,
            extra_data: object_data.extra_data
        };
    } catch (error) {
        if (error.response.status == 404) {
            appendErrorMessage("Object not found.");
        }

        return {
            object: null,
            object_repr: null,
            fieldsets: null,
            permissions: null,
            inlines: null,
            extra_data: null
        };
    }
}
