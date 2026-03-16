import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.scss";
import Root from "./components/root";
import ErrorPage from "./error_page";
import {
    ListContent,
    ListActionContent,
    ObjectViewContent,
    ObjectEditContent,
    ObjectAddContent,
    ObjectConfirmDeleteContent,
    PasswordChangeContent,
    ObjectHistoryContent
} from "./components/content";
import { listLoader } from "./api/list";
import { actionLoader, executeAction } from "./api/action";
import { objectViewLoader } from "./api/objectview";
import { objectEditLoader, objectEditAction } from "./api/objectedit";
import { objectAddLoader, objectAddAction } from "./api/objectadd";
import { changePasswordAction } from "./api/change_password";
import { objectHistoryLoader } from "./api/history";

import { objectConfirmDeleteLoader, objectDeleteAction } from "./api/objectdelete";
import { rootLoader } from "./api/root";
import { custom_views_routes } from "./custom_views/routes";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        loader: rootLoader,
        errorElement: <ErrorPage />,
        // ------------
        children: [
            {
                path: "password_change/",
                element: <PasswordChangeContent />,
                errorElement: <ErrorPage />,
                action: changePasswordAction
            },
            {
                path: ":app_name/:model_name/",
                element: <ListContent />,
                errorElement: <ErrorPage />,
                loader: listLoader
            },
            {
                path: ":app_name/:model_name/action/:action_name/:select_across/:selected_objects/",
                element: <ListActionContent />,
                errorElement: <ErrorPage />,
                loader: actionLoader,
                action: executeAction
            },
            {
                path: ":app_name/:model_name/:object_pk/",
                element: <ObjectViewContent />,
                errorElement: <ErrorPage />,
                loader: objectViewLoader
            },
            {
                path: ":app_name/:model_name/:object_pk/edit/",
                element: <ObjectEditContent />,
                errorElement: <ErrorPage />,
                loader: objectEditLoader,
                action: objectEditAction
            },
            {
                path: ":app_name/:model_name/add/",
                element: <ObjectAddContent />,
                errorElement: <ErrorPage />,
                loader: objectAddLoader,
                action: objectAddAction
            },
            {
                path: ":app_name/:model_name/:object_pk/delete/",
                element: <ObjectConfirmDeleteContent />,
                errorElement: <ErrorPage />,
                loader: objectConfirmDeleteLoader,
                action: objectDeleteAction
            },
            {
                path: ":app_name/:model_name/:object_pk/history/",
                element: <ObjectHistoryContent />,
                errorElement: <ErrorPage />,
                loader: objectHistoryLoader
            },
            ...custom_views_routes
        ]
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    <RouterProvider router={router} />
    // </React.StrictMode>
);
