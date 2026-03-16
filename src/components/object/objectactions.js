import { Link, useParams } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import { ADMIN_SITE_PREFERENCES, SITE_PATH } from "../../settings";

function Delete() {
    const { app_name, model_name, object_pk } = useParams();
    const delete_path = SITE_PATH.object_delete_confirm(app_name, model_name, object_pk);

    return (
        <OverlayTrigger
            key={"right"}
            placement={"right"}
            overlay={
                <Tooltip id="tooltip_delete">
                    <span>Delete</span>
                </Tooltip>
            }
        >
            <Link
                to={delete_path}
                className="px-3 py-1 my-2 w-100 text-decoration-none d-flex justify-content-center rounded bg-alt"
            >
                <i
                    style={{ fontSize: ADMIN_SITE_PREFERENCES.object_action_icon_size }}
                    className="fa-solid fa-trash-can"
                ></i>
            </Link>
        </OverlayTrigger>
    );
}

function Edit() {
    const { app_name, model_name, object_pk } = useParams();
    const edit_path = SITE_PATH.object_edit(app_name, model_name, object_pk);

    return (
        <OverlayTrigger
            key={"right"}
            placement={"right"}
            overlay={
                <Tooltip id="tooltip_edit">
                    <span>Edit</span>
                </Tooltip>
            }
        >
            <Link
                className="px-3 py-1 my-2 w-100 text-decoration-none d-flex justify-content-center rounded bg-alt"
                to={edit_path}
            >
                <i
                    style={{ fontSize: ADMIN_SITE_PREFERENCES.object_action_icon_size }}
                    className="fa-solid fa-pen-to-square"
                ></i>
            </Link>
        </OverlayTrigger>
    );
}

function Return() {
    const { app_name, model_name, object_pk } = useParams();

    const delete_path = SITE_PATH.object_delete_confirm(app_name, model_name, object_pk);
    const history_path = SITE_PATH.object_history(app_name, model_name, object_pk);
    const edit_path = SITE_PATH.object_edit(app_name, model_name, object_pk);
    const view_path = SITE_PATH.object_view(app_name, model_name, object_pk);
    const list_path = SITE_PATH.list(app_name, model_name);

    let paths_map = {};
    paths_map[delete_path] = view_path;
    paths_map[edit_path] = view_path;
    paths_map[history_path] = view_path;
    paths_map[view_path] = list_path;

    const return_path =
        window.location.pathname in paths_map ? paths_map[window.location.pathname] : list_path;

    return (
        <OverlayTrigger
            key={"right"}
            placement={"right"}
            overlay={
                <Tooltip id="tooltip_back">
                    <span>Back</span>
                </Tooltip>
            }
        >
            <Link
                to={return_path}
                className="px-3 py-1 my-2 text-decoration-none w-100 d-flex justify-content-center rounded bg-alt"
            >
                <i
                    style={{ fontSize: ADMIN_SITE_PREFERENCES.object_action_icon_size }}
                    className="fa-solid fa-arrow-left"
                ></i>
            </Link>
        </OverlayTrigger>
    );
}

function Save() {
    return (
        <OverlayTrigger
            key={"right"}
            placement={"right"}
            overlay={
                <Tooltip id="tooltip_save">
                    <span>Save</span>
                </Tooltip>
            }
        >
            <Button
                type="submit"
                className="px-3 py-1 my-2 border-0 w-100 text-decoration-none d-flex justify-content-center rounded bg-alt"
            >
                <i
                    style={{ fontSize: ADMIN_SITE_PREFERENCES.object_action_icon_size }}
                    className="fa-regular fa-floppy-disk text-primary"
                ></i>
            </Button>
        </OverlayTrigger>
    );
}

function History() {
    const { app_name, model_name, object_pk } = useParams();
    const history_path = SITE_PATH.object_history(app_name, model_name, object_pk);

    return (
        <OverlayTrigger
            key={"right"}
            placement={"right"}
            overlay={
                <Tooltip id="tooltip_history">
                    <span>History</span>
                </Tooltip>
            }
        >
            <Link
                to={history_path}
                type="submit"
                className="px-3 py-1 my-2 w-100 text-decoration-none d-flex justify-content-center rounded bg-alt"
            >
                <i
                    style={{ fontSize: ADMIN_SITE_PREFERENCES.object_action_icon_size }}
                    className="fa-regular fa-calendar"
                ></i>
            </Link>
        </OverlayTrigger>
    );
}

export default function ObjectActions({ actions }) {
    const { object_pk } = useParams();

    const perms = actions ? actions : {};
    const can_view_history = object_pk && perms.history;

    return (
        <div
            className={ADMIN_SITE_PREFERENCES.object_actions_container_classes}
            id="object_actions"
        >
            {perms.change && <Edit />}
            {perms.delete && <Delete />}
            {perms.save && <Save />}
            {can_view_history && <History />}
            <Return />
        </div>
    );
}
