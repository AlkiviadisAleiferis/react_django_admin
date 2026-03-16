import { ADMIN_SITE_PREFERENCES } from "../../settings";

export default function Footer(props) {
    return (
        <div
            class="p-3 text-center w-100 d-flex justify-content-center align-items-center bg-alt border-top fixed-bottom"
            style={{ maxHeight: "100px" }}
        >
            {ADMIN_SITE_PREFERENCES.footer_jsx}
        </div>
    );
}
