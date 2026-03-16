import { authAxios } from "./base";
import { redirect } from "react-router-dom";
import { API_ENDPOINTS, API_BASE_URL, SITE_PATH } from "../settings";

export async function changePasswordAction({ params, request }) {
    const api_url = API_BASE_URL + API_ENDPOINTS.password_change();

    const formData = await request.formData();

    try {
        const r = await authAxios.post(api_url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (r.status == 200) {
            sessionStorage.clear();
            localStorage.clear();
            window.location.reload();
        }

        return redirect("/");
    } catch (error) {
        const response_data = error.response.data ? error.response.data : {};
        const response_status = error.response.status;

        if (response_status == 400 && response_data) {
            return {
                error_data: response_data.error_data
            };
        } else {
            return redirect(SITE_PATH.password_change());
        }
    }
}
