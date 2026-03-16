import Nav from "react-bootstrap/Nav";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Accordion from "react-bootstrap/Accordion";
import { Link } from "react-router-dom";
import { ADMIN_SITE_PREFERENCES, SITE_PATH } from "../../settings";

function get_sidebar_entry_classes(path) {
    let classes = ADMIN_SITE_PREFERENCES.sidebar_link_classes;

    if (window.location.pathname.includes(path)) {
        classes += " bg-selected";
    }
    return classes;
}

export function SidebarModelEntry({ app_name, model_name, awesome_icon, label, disable_links }) {
    const path = SITE_PATH.list(app_name, model_name);
    const icon = awesome_icon || ADMIN_SITE_PREFERENCES.sidebar_default_icon;
    const icon_classes = ADMIN_SITE_PREFERENCES.sidebar_icon_classes;
    const entry_classes = get_sidebar_entry_classes(path);

    return (
        <Nav.Item className={"d-flex flex-row py-1 bg-alt"}>
            <Link to={disable_links ? "#" : `${path}`} className={entry_classes}>
                <Row className="w-100 m-0 py-1 ps-2 justify-content-center">
                    <Col xs="3" className="d-flex p-0 justify-content-center">
                        <i
                            className={icon + " " + icon_classes}
                            style={{
                                fontSize: ADMIN_SITE_PREFERENCES.sidebar_icon_height_px + "px"
                            }}
                        ></i>
                    </Col>

                    <Col
                        xs="9"
                        className="d-flex ps-1 pe-0 align-items-center justify-content-start"
                    >
                        <span style={{ fontSize: ADMIN_SITE_PREFERENCES.sidebar_font_size }}>
                            {label}
                        </span>
                    </Col>
                </Row>
            </Link>
        </Nav.Item>
    );
}

export function SidebarCustomViewEntry({ awesome_icon, label, client_view_path, disable_links }) {
    const path = client_view_path;
    const icon = awesome_icon || ADMIN_SITE_PREFERENCES.sidebar_default_icon;
    const icon_classes = ADMIN_SITE_PREFERENCES.sidebar_icon_classes;
    const entry_classes = get_sidebar_entry_classes();

    return (
        <Nav.Item className={"d-flex flex-row py-1 bg-alt"}>
            <Link to={disable_links ? "#" : `${path}`} className={entry_classes}>
                <Row className="w-100 m-0 py-1 ps-2 justify-content-center">
                    <Col xs="3" className="d-flex p-0 justify-content-center">
                        <i
                            className={icon + " " + icon_classes}
                            style={{
                                fontSize: ADMIN_SITE_PREFERENCES.sidebar_icon_height_px + "px"
                            }}
                        ></i>
                    </Col>

                    <Col
                        xs="9"
                        className="d-flex ps-1 pe-0 align-items-center justify-content-start"
                    >
                        <span style={{ fontSize: ADMIN_SITE_PREFERENCES.sidebar_font_size }}>
                            {label}
                        </span>
                    </Col>
                </Row>
            </Link>
        </Nav.Item>
    );
}

export function build_sidebar_entry(entry, disable_links, key) {
    if (entry.type == "model") {
        return (
            <SidebarModelEntry
                app_name={entry.app_name}
                model_name={entry.model_name}
                awesome_icon={entry.icon}
                label={entry.label}
                key={key}
                disable_links={disable_links}
            />
        );
    } else if (entry.type == "dropdown") {
        let inner_entries_jsx = entry.dropdown_entries.map((e, index) =>
            build_sidebar_entry(e, disable_links, `${key}__${index}`)
        );
        return (
            <Accordion defaultActiveKey="0" key={key} className="border-0 " flush>
                <Accordion.Item eventKey="0" className="border-0">
                    <Accordion.Header className="border-0 bg-alt">
                        <b>{entry.label}</b>
                    </Accordion.Header>
                    <Accordion.Body className="border-0 p-0">{inner_entries_jsx}</Accordion.Body>
                </Accordion.Item>
            </Accordion>
        );
    } else if (entry.type == "view") {
        return (
            <SidebarCustomViewEntry
                awesome_icon={entry.icon}
                client_view_path={entry.client_view_path}
                label={entry.label}
                key={key}
                disable_links={disable_links}
            />
        );
    }
}
