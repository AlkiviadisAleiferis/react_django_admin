import { redirect } from "react-router-dom";
import { authAxios } from "./base";
import {
    appendSuccessMessage,
    appendErrorMessage,
} from "./cache";
import { API_ENDPOINTS, API_BASE_URL } from "../settings";

export async function actionLoader({ params, request }) {
    const action_path = API_ENDPOINTS.admin_list_action_preview(
        params.app_name,
        params.model_name,
        params.action_name
    );
    let data = {
        select_across: params.select_across,
        selected_objects: params.selected_objects,
    };

    const action_url = API_BASE_URL + action_path;

    /* ------------------------------------------------------------ */
    /* 
        SUCCESS CASE 
    */
    try {
        const r = await authAxios.post(action_url, data);

        const action_data = r.data;

        return action_data;
    /* ------------------------------------------------------------ */
    /* 
        ERROR CASE
    */
    } catch (error) {
        const response_data = error.response.data;
        const response_status = error.response.status;

        appendErrorMessage(
            "An error occurred while retrieving the action."
        );
        
        const messages = response_data.messages ? response_data.messages : [];

        for (let m of messages) {
            appendErrorMessage(m);
        }

        if (response_status === 404) {
            appendErrorMessage("Action was not found.");
        } else if (response_status === 403) {
            appendErrorMessage("Action not permitted.");
        } else if (response_status >= 500) {
            appendErrorMessage("A Server error occurred.");
        }

        return null;
    }
}

export async function executeAction({ params, request }) {
    const action_path = API_ENDPOINTS.admin_list_action_execute(
        params.app_name,
        params.model_name,
        params.action_name
    );
    let data = {
        select_across: params.select_across,
        selected_objects: params.selected_objects,
    };

    const action_url = API_BASE_URL + action_path;

    // ------------------------------------------------------------
    // SUCCESS CASE
    // ------------------------------------------------------------
    try {
        const r = await authAxios.post(action_url, data);

        const response_data = r.data ? r.data : {};

        if (response_data.messages) {
            for (let m of response_data.messages) {
                appendSuccessMessage(m);
            }
        }

    // ------------------------------------------------------------
    // ERROR CASE
    // ------------------------------------------------------------
    } catch (error) {
        const response_data = error.response.data ? error.response.data : {};
        const response_status = error.response.status;

        appendErrorMessage(
            "An error occurred while performing the action."
        );
        
        const messages = response_data.messages ? response_data.messages : [];
        
        for (let m of messages) {
            appendErrorMessage(m);
        }

        if (response_status === 404) {
            appendErrorMessage("Action was not found.");
        } else if (response_status === 403) {
            appendErrorMessage("Action was not permitted.");
        } else if (response_status >= 500) {
            appendErrorMessage("A Server error occurred.");
        }

    }

    return redirect(`/${params.app_name}/${params.model_name}/`);
}
