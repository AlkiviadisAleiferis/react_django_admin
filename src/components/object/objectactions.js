import { Link, useParams } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import { OBJECT_ACTION_ICON_SIZE } from "../../settings";

import { get_random_key_num } from "../../utils";

function Delete() {
    const { app_name, model_name, object_pk } = useParams();
    const delete_path = `/${app_name}/${model_name}/${object_pk}/delete/`;

    return (
        <OverlayTrigger
            key={"right"}
            placement={"right"}
            overlay={
                <Tooltip id={`tooltip-${get_random_key_num()}`}>
                    <span>Delete</span>
                </Tooltip>
            }
        >
            <Link to={delete_path} className="px-3 py-1 my-2">
                <i
                    style={{ fontSize: OBJECT_ACTION_ICON_SIZE }}
                    className="fa-solid fa-trash-can text-primary"
                ></i>
            </Link>
        </OverlayTrigger>
    );
}

function Edit() {
    const { app_name, model_name, object_pk } = useParams();
    const edit_path = `/${app_name}/${model_name}/${object_pk}/edit/`;

    return (
        <OverlayTrigger
            key={"right"}
            placement={"right"}
            overlay={
                <Tooltip id={`tooltip-${get_random_key_num()}`}>
                    <span>Edit</span>
                </Tooltip>
            }
        >
            <Link className="px-3 py-1 my-2" to={edit_path}>
                <i
                    style={{ fontSize: OBJECT_ACTION_ICON_SIZE }}
                    className="fa-solid fa-pen-to-square text-primary"
                ></i>
            </Link>
        </OverlayTrigger>
    );
}

function Return() {
    const url_parts = window.location.pathname
        .split("/")
        .filter((part) => part.length > 0);

    const previous = "/" + url_parts.slice(0, -1).join("/") + "/";

    return (
        <OverlayTrigger
            key={"right"}
            placement={"right"}
            overlay={
                <Tooltip id={`tooltip-${get_random_key_num()}`}>
                    <span>Back</span>
                </Tooltip>
            }
        >
            <Link to={previous} className="px-3 py-1 my-2">
                <i
                    style={{ fontSize: OBJECT_ACTION_ICON_SIZE }}
                    className="fa-solid fa-arrow-left text-primary"
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
                <Tooltip id={`tooltip-save-${get_random_key_num()}`}>
                    <span>Save</span>
                </Tooltip>
            }
        >
            <Button type="submit" className="my-2 bg-transparent border-0">
                <i
                    style={{ fontSize: OBJECT_ACTION_ICON_SIZE }}
                    className="fa-regular fa-floppy-disk text-primary"
                ></i>
            </Button>
        </OverlayTrigger>
    );
}

function History() {
    const { app_name, model_name, object_pk } = useParams();
    const history_path = `/${app_name}/${model_name}/${object_pk}/history/`;
    return (
        <OverlayTrigger
            key={"right"}
            placement={"right"}
            overlay={
                <Tooltip id={`tooltip-save-${get_random_key_num()}`}>
                    <span>History</span>
                </Tooltip>
            }
        >
            <Link to={history_path} type="submit" className="my-2 bg-transparent border-0">
                <i
                    style={{ fontSize: OBJECT_ACTION_ICON_SIZE }}
                    className="fa-regular fa-calendar text-primary"
                ></i>
            </Link>
        </OverlayTrigger>
    );
}

export default function ObjectActions({ actions }) {
    const { object_pk } = useParams();
    let can_view_history = false;
    if (object_pk) { can_view_history = true };

    const actions_div_classes =
        "d-flex flex-md-column flex-row p-1 justify-content-center align-items-center shadow-sm border";
    let perms = actions ? actions : {};

    const can_change = perms.edit;
    const can_delete = perms.delete;
    const can_save = perms.save;

    return (
        <div className={actions_div_classes} id="object_actions">
            {can_change && <Edit />}
            {can_delete && <Delete />}
            {can_save && <Save />}
            {can_view_history && <History />}
            <Return />
        </div>
    );
}
