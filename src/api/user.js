import axios from "axios";
import { getUser } from "../state/user";
import { API_ENDPOINTS, API_BASE_URL } from "../settings";

export async function obtainTokenPair(username, password) {
    const data = {
        username: username,
        password: password
    };
    const api_token_obtain_url = API_BASE_URL + API_ENDPOINTS.token_obtain_pair();

    const response = await axios.post(api_token_obtain_url, data, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8"
        }
    });
    return response.data;
}

export async function refreshAccessToken() {
    const user = getUser();

    // might raise `SyntaxError`
    const api_refresh_token_url = API_BASE_URL + API_ENDPOINTS.token_refresh();
    const refresh_token = user ? user.refresh_token : "";
    const data = { refresh: refresh_token };

    const response = await axios.post(api_refresh_token_url, data, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8"
        }
    });
    return response.data.access;
}
