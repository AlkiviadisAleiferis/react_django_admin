import { Link } from "react-router-dom";
import { JsonToTable } from "react-json-to-table";
import { SITE_PATH, ADMIN_SITE_PREFERENCES } from "../../../settings";

export function DefaultTextField({ field }) {
    return (
        <p style={{ maxWidth: "400px", maxHeight: "400px", overflowX: "auto" }} className="m-0 p-0">
            {field.value}
        </p>
    );
}

/* ------------ related ----------- */

export function RelatedField({ field }) {
    if (field.permissions.view && field.pk != null) {
        return (
            <>
                <Link
                    to={SITE_PATH.object_view(field.app, field.model, field.pk)}
                    target="_blank"
                    className="m-o p-0 link-underline link-underline-opacity-0 d-flex flex-row align-items-center"
                >
                    <p className="me-2 my-0">{field.value}</p>
                    {ADMIN_SITE_PREFERENCES.object_view_link_icon()}
                </Link>
            </>
        );
    } else {
        return <p className="m-0 p-0">{field.value}</p>;
    }
}

export function ManyRelatedField({ field }) {
    const values = field.value ? field.value.map(v => ({ pk: v.pk, value: v.value })) : [];
    return <JsonToTable json={values} />;
}

export function MethodField({ field }) {
    return <span style={{ overflowX: "auto" }} dangerouslySetInnerHTML={{ __html: field.value }} />;
}

/* ------------ image/file ----------- */

export function ImageField({ field }) {
    if (!field.value) {
        return <span> - </span>;
    }

    const fileurl = field.value.startsWith("/")
        ? process.env.REACT_APP_FILE_SERVER_BASE_URL + field.value.slice(1)
        : process.env.REACT_APP_FILE_SERVER_BASE_URL + field.value;

    return (
        <Link to={fileurl} target="_blank" className="p-2">
            <img className="me-2" src={fileurl} style={{ height: "200px" }} />
        </Link>
    );
}

export function FileField({ field }) {
    if (!field.value) {
        return <span> - </span>;
    }

    const fileurl = field.value.startsWith("/")
        ? process.env.REACT_APP_FILE_SERVER_BASE_URL + field.value.slice(1)
        : process.env.REACT_APP_FILE_SERVER_BASE_URL + field.value;

    return (
        <Link to={fileurl} target="_blank" className=" p-2">
            <span className="me-2">Open file</span>
            {ADMIN_SITE_PREFERENCES.object_view_link_icon()}
        </Link>
    );
}

/* ------------ json/array ----------- */

export function JSONField({ field }) {
    return <JsonToTable json={field.value} />;
}

export function ArrayField({ field }) {
    return <JsonToTable json={field.value} />;
}

/* ------------ bool ----------- */

export function BooleanField({ field }) {
    if (field.value) {
        return (
            <i className="fa-solid fa-circle-check text-success" style={{ fontSize: "20px" }}></i>
        );
    } else if (field.value === null || field.value === undefined) {
        return <span> - </span>;
    }
    return <i className="fa-solid fa-circle-xmark text-danger" style={{ fontSize: "20px" }}></i>;
}

/* ------------ time ----------- */

export function TimeField({ field }) {
    return <DefaultTextField field={field} />;
}

export function DateField({ field }) {
    return <DefaultTextField field={field} />;
}

export function DateTimeField({ field }) {
    return <DefaultTextField field={field} />;
}

/* ------------ numerical ----------- */

export function IntegerField({ field }) {
    return <DefaultTextField field={field} />;
}

export function FloatField({ field }) {
    return <DefaultTextField field={field} />;
}

export function DecimalField({ field }) {
    return <DefaultTextField field={field} />;
}

/* ------------ text ----------- */

export function CharField({ field }) {
    return <DefaultTextField field={field} />;
}

export function URLField({ field }) {
    return (
        <Link
            to={field.value}
            target="_blank"
            className="m-o p-0 link-underline link-underline-opacity-0"
        >
            <p className="m-0 p-0">{field.value}</p>
        </Link>
    );
}

export function EmailField({ field }) {
    return <DefaultTextField field={field} />;
}

export function SlugField({ field }) {
    return <DefaultTextField field={field} />;
}

export function UUIDField({ field }) {
    return <DefaultTextField field={field} />;
}

export function TextField({ field }) {
    return (
        <p style={{ maxWidth: "400px", maxHeight: "400px", overflowX: "auto" }} className="m-0 p-0">
            {field.value}
        </p>
    );
}
