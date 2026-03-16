import Nav from "react-bootstrap/Nav";
import { ADMIN_SITE_PREFERENCES } from "../../settings";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useState } from "react";
import { build_sidebar_entry } from "./sidebar_entries";

function MobileSidebar({ sidebar, disable_links, extra }) {
    /* 
    sidebar structure:
        [
            {
                "type": "dropdown" | "model" | "view", # required
                "label": str, # required
                "icon": str, # NOT required

                "view_name": str, # required --> for "view" type only
                "client_view_path": str, # required --> for "view" type only

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
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    };

    const handleShow = () => {
        setShow(true);
    };

    const sidebar_entries_jsx = sidebar
        ? sidebar.map(function (entry, index) {
              return (
                  <div className="d-flex p-0 m-0 flex-column bg-alt" key={index}>
                      {build_sidebar_entry(entry, disable_links, `sidebar_entry_${index}`)}
                  </div>
              );
          })
        : null;

    return (
        <>
            <Button
                onClick={handleShow}
                className="me-auto d-block d-xxl-none bg-main text-primary border-0"
            >
                <i
                    className="fa-solid fa-bars m-auto border-0 p-2 mx-2"
                    style={{ fontSize: "35px" }}
                ></i>
            </Button>

            <Offcanvas
                show={show}
                onHide={handleClose}
                placement={"start"}
                id="sidebar_mobile"
                scroll={true}
                className="border-0 shadow bg-alt"
            >
                <Offcanvas.Header closeButton></Offcanvas.Header>
                <Nav
                    defaultActiveKey="/home"
                    className={ADMIN_SITE_PREFERENCES.sidebar_nav_classes}
                >
                    {sidebar_entries_jsx}
                </Nav>
            </Offcanvas>
        </>
    );
}

export default MobileSidebar;
