import { Link } from "react-router-dom";
import { get_field_display_name } from "../../utils";
import { HeadersActionSelectAll } from "./actions";

function SortableHeader({ field, index, sortable_by, orderings, query_string }) {
    if (!sortable_by.includes(field)) {
        return <th>{field.charAt(0).toUpperCase() + field.replaceAll("_", " ").slice(1)}</th>;
    }

    /*
    is the index as it appears
    in the ordering param value
    e.g. o=1.3.-5
    correspondis to the 1st, 3rd and 5th fields
    of the `ModelAdmin.list_display`

    WARNING: if display_fields has
    double entry, an error will occur
    */
    const field_ind = index + 1;

    let included_field = null;

    if (orderings.includes(`${field_ind}`)) included_field = field_ind;
    else if (orderings.includes(`${-field_ind}`)) included_field = -field_ind;

    const reverse_field = included_field ? -included_field : null;

    if (included_field) {
        const removed_ordering = [...orderings].filter(o => o !== `${included_field}`);

        const reverse_ordering = [...orderings];

        reverse_ordering[orderings.indexOf(`${included_field}`)] = `${reverse_field}`;

        const reverse_ordering_query = query_string
            ? query_string + "&o=" + reverse_ordering.join(".")
            : "?o=" + reverse_ordering.join(".");

        const removed_ordering_query = query_string
            ? query_string + "&o=" + removed_ordering.join(".")
            : "?o=" + removed_ordering.join(".");

        const ordering_arrow =
            included_field > 0 ? (
                <i className="ms-2 fa-solid fa-up-long text-danger"></i>
            ) : (
                <i className="ms-2 fa-solid fa-down-long text-danger"></i>
            );

        return (
            <th>
                <Link
                    to={reverse_ordering_query}
                    className="me-2 header-ordering-link link-underline link-underline-opacity-0"
                >
                    {get_field_display_name(field)}
                    {ordering_arrow}
                </Link>
                <Link
                    to={removed_ordering_query}
                    className="header-remove-ordering-link link-underline link-underline-opacity-0"
                >
                    <i className="fa-solid fa-xmark text-danger"></i>
                </Link>
            </th>
        );
    } else {
        const new_ordering = [...orderings, `${field_ind}`];

        const ordering_query = query_string
            ? query_string + "&o=" + new_ordering.join(".")
            : "?o=" + new_ordering.join(".");

        return (
            <th>
                <Link
                    to={ordering_query}
                    className="header-remove-ordering-link link-underline link-underline-opacity-0"
                >
                    {field.charAt(0).toUpperCase() + field.replaceAll("_", " ").slice(1)}
                </Link>
            </th>
        );
    }
}

export function Headers({ fields, sortable_by }) {
    let url_params = new URLSearchParams(window.location.search);

    const orderings = url_params.has("o") ? url_params.get("o").split(".") : [];

    if (orderings.length) url_params.delete("o");

    const query_string = url_params.toString() ? "?" + url_params.toString() : "";

    const headers = fields.map(function (field, index) {
        return (
            <SortableHeader
                key={"header_" + index}
                field={field}
                index={index}
                sortable_by={sortable_by}
                orderings={orderings}
                query_string={query_string}
            />
        );
    });

    return (
        <tr>
            <HeadersActionSelectAll />
            {headers}
        </tr>
    );
}
