import Nav from "react-bootstrap/Nav";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Accordion from 'react-bootstrap/Accordion';
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

function SidebarModelEntry({ app_name, model_name, awesome_icon, label, disable_links }) {
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
                        <b style={{ fontSize: "14px" }}>{label}</b>
                    </Col>
                </Row>
            </Link>
        </Nav.Item>
    );
}


function build_sidebar_entry(entry, disable_links, key){
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
        let inner_entries_jsx = entry.dropdown_entries.map((e, index)=>build_sidebar_entry(e, disable_links, `${key}__${index}`));
        return (
            <Accordion defaultActiveKey="0" key={key} className="border-0" flush>
                <Accordion.Item eventKey="0" className="border-0">
                    <Accordion.Header className="border-0"><b>{entry.label}</b></Accordion.Header>
                    <Accordion.Body className="border-0 p-0">
                        {inner_entries_jsx}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        );

    }

}


function Sidebar({ sidebar, disable_links, extra }) {
    /* 
    sidebar structure:
        [
            {
                "type": "dropdown" | "model" | "view", # required
                "icon": str, # NOT required
                "label": str, # required

                "view_name": str, # required --> for "view" type only

                "app_name": Model._meta.app_label, # required --> for "model" type only
                "model_name": Model._meta.model_name, # required --> for "model" type only

                "dropdown_entries": [ # --> only in case of "dropdown" type
                    {
                        "type": "model" | "view",
                        "label": str,
                        "icon": str,
                        "app_name": Model._meta.app_label,
                        "model_name": Model._meta.model_name,
                        "view_name": str,
                    }
                ]
            }, ..
        ]
    */
    let sidebar_entries = [];
    let sidebar_entries_jsx = null;

    if (sidebar) {
        const is_first = sidebar_entries.length === 0;

        sidebar_entries = sidebar.map(function (entry, index) {
            return build_sidebar_entry(entry, disable_links, `sidebar_entry_${index}`)
        });
        // sidebar_entries.unshift(<SidebarApp app_name={app_name} is_first={is_first} key={app_name} />)
        sidebar_entries_jsx = sidebar_entries.map(function (entry, index) {
            return (
                <div className="d-flex p-0 m-0 flex-column" key={index}>
                    {entry}
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
            {sidebar_entries_jsx}
        </Nav>
    );
}

export default Sidebar;
