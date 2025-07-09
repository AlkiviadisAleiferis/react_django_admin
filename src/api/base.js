import axios from "axios";
import { getUserInStorage, tokenExpiresSoon } from "../state/user";
import { refreshAccessToken } from "./user";
import { appendErrorMessage } from "./cache";

// setup Axios Authentication interceptor

const authAxios = axios.create();

authAxios.interceptors.request.use(
    function (config) {
        const user_in_storage = getUserInStorage();

        // in each request check for authentication status
        if (user_in_storage) {
            if (tokenExpiresSoon(user_in_storage.refresh_token)) {
                sessionStorage.setItem("tokenExpired", true);
                window.location.assign("/");
            }

            let access_token = user_in_storage.access_token;

            if (tokenExpiresSoon(access_token, 30)) {
                try {
                    refreshAccessToken();
                } catch (error) {
                    throw error;
                }
            }
            access_token = user_in_storage.access_token;
            config.headers.Authorization = `Bearer  ${access_token}`;
        }

        return config;
    },

    function (error) {
        // THIS IS FOR OUTGOING ERRORS
        return Promise.reject(error);
    }
);

authAxios.interceptors.response.use(
    function (config) {
        return config;
    },

    function (error) {
        if (error.status == 403) {
            appendErrorMessage("Not permitted!");
        } else if (error.status >= 500) {
            appendErrorMessage("A server error occured.");
        }
        
        return Promise.reject(error);
    }
);

export { authAxios };

/*
------- Axios error format ------- 
{
    "message": "Request failed with status code 404",
    "name": "AxiosError",
    "stack": "AxiosError: Request failed with status code 404\n...""
    "config": {
        "transitional": {
            "silentJSONParsing": true,
            "forcedJSONParsing": true,
            "clarifyTimeoutError": false
        },
        "adapter": [
            "xhr",
            "http",
            "fetch"
        ],
        "transformRequest": [
            null
        ],
        "transformResponse": [
            null
        ],
        "timeout": 0,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1,
        "maxBodyLength": -1,
        "env": {},
        "headers": {
            "Accept": "application/json, text/plain",
            "Authorization": "Bearer [object Promise]"
        },
        "method": "get",
        "url": "https://localhost:8888/api/token/test/"
    },
    "code": "ERR_BAD_REQUEST",
    "status": 404
}
*/
