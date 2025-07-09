/*
placeholder file.
Define your custom Loaders/Actions in this folder.

---------------------------------------------------------------------------

import { authAxios } from "./base";


export async function customViewLoader({ params, request }) {
    const custom_view_name = params.custom_view_name
    const custom_view_api_url = API_BASE_URL + get_api_path(custom_view_name);
    try {
        const r = await authAxios.get(custom_view_api_url);
        const data = r.data;
        return data;
    } catch (error) {
        ...
    }
}

---------------------------------------------------------------------------

export async function customViewAction({ params, request }) {
    const custom_view_name = params.custom_view_name;
    const custom_view_api_url = API_BASE_URL + get_api_path(custom_view_name);

    let form_data = await request.formData();
    try {
        const r = await authAxios.post(custom_view_api_url, form_data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const response_data = r.data;
        ...
    } catch (error) {
        ...
    }
}
*/
