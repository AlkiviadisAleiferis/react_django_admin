import { VERSION } from "../../settings";

export default function Footer(props) {
    return (
        <div
            class="p-3 text-center w-100 d-flex justify-content-center align-items-center bg-alt border-top fixed-bottom"
            style={{ maxHeight: "100px" }}
        >
            <span>
                <a
                    target="_blank"
                    href="https://www.github.com/AlkiviadisAleiferis/django_admin_adapter"
                >
                    Django admin adapter ({VERSION})
                </a>{" "}
                React client 2026.
            </span>
        </div>
    );
}
