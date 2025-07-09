import Nav from "react-bootstrap/Nav";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { ADMIN_SITE_PREFERENCES } from "../../settings";
import { get_field_display_name } from "../../utils";

function SidebarApp({ app_name, is_first }) {
    const classes = "d-flex flex-row text-center py-3";
    
    return (
        <Nav.Item className={is_first ? classes : classes + " border-top mt-4"}>
            <h6 className="m-auto"><b>{get_field_display_name(app_name)}</b></h6>
        </Nav.Item>
    );
}

function SidebarEntry({ app_name, model_name, awesome_icon, entry_name, disable_links }) {
    let link_classes =
        "sidebar-item nav-link p-1 d-flex flex-row" +
        " align-items-center justify-content-center " +
        " w-100"; // text-white

    const entity_list_url = `/${app_name}/${model_name}/`;
    const icon = awesome_icon === null ? "fa-solid fa-server" : awesome_icon;

    if (
        window.location.pathname.includes(entity_list_url)
    ) {
        link_classes += " bg-selected";
    }

    return (
        <Nav.Item className="d-flex flex-row">
            <Link to={disable_links ? "#" : `${entity_list_url}`} className={link_classes}>
                <Row className="w-100 m-0 py-1 ps-2 justify-content-center">
                    <Col
                        xs="12"
                        md="3"
                        className="d-flex p-0 justify-content-center"
                    >
                        <i
                            className={icon}
                            style={{
                                fontSize:
                                    ADMIN_SITE_PREFERENCES.sidebar_icon_height_px +
                                    "px",
                            }}
                        ></i>
                    </Col>

                    <Col
                        xs="0"
                        md="9"
                        className="d-none d-md-flex ps-1 pe-0 align-items-center justify-content-center text-center"
                    >
                        <b style={{ fontSize: "14px" }}>{entry_name}</b>
                    </Col>
                </Row>
            </Link>
        </Nav.Item>
    );
}

function Sidebar({ entities, disable_links, apps }) {
    /* 
    entities structure:
    {
        "app_name": [
            {
                "model_name": model_name,
                "name": model_meta.verbose_name_plural,
                "icon": getattr(model_admin, "sidebar_icon", None),
                "permissions": {
                    "view": True,
                    "add": model_admin.has_add_permission(request),
                    "delete": model_admin.has_delete_permission(request, None),
                },
            }
        ],
        .
        .
        .
    }
    */
    let apps_entries = [];
    let apps_entries_jsx = null;

    if (entities) {
        for (let app_name of apps) {
            const is_first = apps_entries.length === 0;
            const app_models = entities[app_name];
            if (!app_models) {continue;}

            let app_entries = app_models.map(function (model_data, index) {
                return (
                    <SidebarEntry
                        app_name={app_name}
                        model_name={model_data["model_name"]}
                        awesome_icon={model_data["icon"]}
                        entry_name={model_data["name"]}
                        key={`${app_name}_model_${index}`}
                        disable_links={disable_links}
                    />
                );
            });
            app_entries.unshift(<SidebarApp app_name={app_name} is_first={is_first} key={app_name} />)

            apps_entries.push(app_entries);
        }

        apps_entries_jsx = apps_entries.map(function (app_entries, index) {
                return (
                    <div className="d-flex p-0 m-0 flex-column" key={index}>
                        {app_entries}
                    </div>
                );
            });
    }

    return (
        <Nav
            expand="md"
            defaultActiveKey="/home"
            className="d-flex flex-column"
        >
            {apps_entries_jsx}
        </Nav>
    );
}

export default Sidebar;
