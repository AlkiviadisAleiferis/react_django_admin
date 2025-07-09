import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import "./index.scss";
import Root from "./components/root";
import ErrorPage from "./error_page";
import {
    ListContent,
    ListActionContent,
    ObjectPreviewContent,
    ObjectEditContent,
    ObjectAddContent,
    ObjectConfirmDeleteContent,
    PasswordChangeContent,
    ObjectHistoryContent,
} from "./components/base/content";
import { UserContextProvider } from "./state/user";
import { listLoader } from "./api/changelist";
import { actionLoader, executeAction } from "./api/action";
import { objectPreviewLoader } from "./api/objectpreview";
import { objectEditLoader, objectEditAction } from "./api/objectedit";
import { objectAddLoader, objectAddAction } from "./api/objectadd";
import { changePasswordAction } from "./api/change_password";
import { objectHistoryLoader } from "./api/history";

import {
    objectConfirmDeleteLoader,
    objectDeleteAction,
} from "./api/objectdelete";
import { rootLoader } from "./api/root";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <UserContextProvider>
                <Root />
            </UserContextProvider>
        ),
        loader: rootLoader,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "password_change/",
                element: <PasswordChangeContent />,
                errorElement: <ErrorPage />,
                action: changePasswordAction,
            },
            {
                path: ":app_name/:model_name/",
                element: <ListContent />,
                errorElement: <ErrorPage />,
                loader: listLoader,
            },
            {
                path: ":app_name/:model_name/action/:action_name/:select_across/:selected_objects/",
                element: <ListActionContent />,
                errorElement: <ErrorPage />,
                loader: actionLoader,
                action: executeAction,
            },
            {
                path: ":app_name/:model_name/:object_pk/",
                element: <ObjectPreviewContent />,
                errorElement: <ErrorPage />,
                loader: objectPreviewLoader,
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
                action: objectAddAction,
            },
            {
                path: ":app_name/:model_name/:object_pk/delete/",
                element: <ObjectConfirmDeleteContent />,
                errorElement: <ErrorPage />,
                loader: objectConfirmDeleteLoader,
                action: objectDeleteAction,
            },
            {
                path: ":app_name/:model_name/:object_pk/history/",
                element: <ObjectHistoryContent />,
                errorElement: <ErrorPage />,
                loader: objectHistoryLoader,
            },
            /*
            {
                path: ":custom_view_name/",
                element: <CustomViewContent />,
                errorElement: <ErrorPage />,
                loader: customViewLoader,
                action: customViewAction,
            },
            */
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    <RouterProvider router={router} />
    // </React.StrictMode>
);
