import axios from "axios";
import { setUser, getUser, tokenExpiresSoon } from "../state/user";
import { refreshAccessToken } from "./user";
import { appendErrorMessage } from "../state/messages";

// setup Axios Authentication interceptor

const authAxios = axios.create();

authAxios.interceptors.request.use(
    async function (config) {
        // in each request
        // check for authentication status
        const user = getUser();

        if (!user) {
            return config;
        }

        let access_token = user.access_token;
        let refresh_token = user.refresh_token;

        if (tokenExpiresSoon(refresh_token)) {
            localStorage.clear();
            sessionStorage.clear();
            sessionStorage.setItem("tokenExpired", true);
            window.location.assign("/");
            return config;
        }

        // try to refresh access token
        if (tokenExpiresSoon(access_token)) {
            try {
                access_token = await refreshAccessToken();
                setUser({
                    ...user,
                    access_token: access_token
                });
            } catch (error) {
                localStorage.clear();
                sessionStorage.clear();
                throw error;
            }
        }
        config.headers.Authorization = `Bearer  ${access_token}`;
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
        if (error.status == 401) {
            appendErrorMessage("Authentication missing or expired");
        } else if (error.status == 403) {
            appendErrorMessage("Not permitted");
        } else if (error.status == 429) {
            appendErrorMessage("Too many requests");
        } else if (error.status >= 500) {
            appendErrorMessage("A server error occured");
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
