import Nav from "react-bootstrap/Nav";
import { ADMIN_SITE_PREFERENCES } from "../../settings";
import { build_sidebar_entry } from "./sidebar_entries";

function Sidebar({ sidebar, disable_links, extra }) {
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
        <Nav
            defaultActiveKey="/home"
            className={ADMIN_SITE_PREFERENCES.sidebar_nav_classes + " w-100 p-2"}
        >
            {sidebar_entries_jsx}
        </Nav>
    );
}

export default Sidebar;
