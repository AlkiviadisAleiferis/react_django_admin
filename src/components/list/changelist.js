import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { augment_query_string, get_query_param_value } from "../../utils";
import { Form as RouterForm, Link, useNavigate, useParams } from "react-router-dom";
import { get_field_display_name } from "../../utils";
import { ChangeListFilters } from "./filters";

/* 
function returning the redirector for the
list actions.
Gathers all the action inputs data
and appends them on the URL query params.
These data will build the necessary inputs in
the action page.
*/
function get_perform_action_redirect(navigate) {
    function perform_action_redirect() {
        const action_selection = document.getElementById("action_selection");
        const selected_action_name = action_selection.selectedOptions[0].value;

        let selected_objects = [];
        let select_across = document.getElementById("select_across").value;

        select_across = select_across ? select_across : 0;

        // add all checked rows pks in select_objects_pks
        document.querySelectorAll(".action-select").forEach((chechbox) => {
            if (chechbox.checked) {
                selected_objects.push(chechbox.getAttribute("object_pk"));
            }
        });

        if (selected_action_name === "" || !selected_objects.length) {
            window.alert("No action selected!");
            return;
        }

        const current_path = window.location.pathname.endsWith("/")
            ? window.location.pathname
            : window.location.pathname + "/";

        const objects_pks_str = selected_objects.join(",");

        navigate(
            current_path +
                `action/${selected_action_name}/${select_across}/${objects_pks_str}/`
        );
    }

    return perform_action_redirect;
}

export function Paginator({ total_pages, page }) {
    let initial_pages = [...Array(total_pages).keys()];
    let pages;
    let previous_page;
    let previous_page_num;
    let next_page;
    let next_page_num;
    let pages_html;

    if (total_pages > 1) {
        if (total_pages > 6) {
            if (page < 4) {
                pages = [1, 2, 3, 4, null, initial_pages.length];
            } else if (page > initial_pages.length - 2) {
                pages = [
                    1,
                    null,
                    initial_pages.length - 2,
                    initial_pages.length - 1,
                    initial_pages.length,
                ];
            } else {
                pages = [
                    1,
                    null,
                    page - 1,
                    page,
                    page + 1,
                    null,
                    initial_pages.length,
                ];
            }
        } else {
            pages = initial_pages.map((page) => page + 1);
        }

        // find existing parameters in URL
        // to include them in pagination link
        let url_params = new URLSearchParams(window.location.search);
        if (url_params.has("p")) {
            url_params.delete("p");
        }
        let existing_query_string;
        if (url_params.toString()) {
            existing_query_string = "?" + url_params.toString() + "&p=";
        } else {
            existing_query_string = "?p=";
        }

        // previous / next pages html
        if (page == 1) {
            next_page_num = page + 1;

            previous_page = null;
            next_page = (
                <>
                    <li className="page-item next">
                        <Link
                            className="page-link"
                            to={existing_query_string + next_page_num}
                        >
                            »
                        </Link>
                    </li>
                </>
            );
        } else if (page == initial_pages.length) {
            previous_page_num = page - 1;

            previous_page = (
                <>
                    <li className="page-item previous">
                        <Link
                            className="page-link"
                            to={existing_query_string + previous_page_num}
                        >
                            «
                        </Link>
                    </li>
                </>
            );
            next_page = null;
        } else {
            previous_page_num = page - 1;
            next_page_num = page + 1;

            previous_page = (
                <>
                    <li className="page-item previous">
                        <Link
                            className="page-link"
                            to={existing_query_string + previous_page_num}
                        >
                            «
                        </Link>
                    </li>
                </>
            );
            next_page = (
                <>
                    <li className="page-item next">
                        <Link
                            className="page-link"
                            to={existing_query_string + next_page_num}
                        >
                            »
                        </Link>
                    </li>
                </>
            );
        }

        // intermediate pages html
        pages_html = pages.map((item, index) =>
            item ? (
                <li className="page-item" key={"page_" + index}>
                    <Link
                        to={existing_query_string + item}
                        className={
                            item === page ? "page-link active" : "page-link"
                        }
                    >
                        {item}
                    </Link>
                </li>
            ) : (
                <li className="page-item" key={"page_" + index}>
                    <a href={"javascript:void(0);"} className={"page-link"}>
                        ...
                    </a>
                </li>
            )
        );
    }
    return (
        <div id="pagination" className="ms-auto">
            <ul className="pagination pagination-sm m-0 float-right">
                {previous_page}
                {pages_html}
                {next_page}
            </ul>
        </div>
    );
}

function Headers({ fields }) {
    let url_params = new URLSearchParams(window.location.search);

    let existing_ordering_param_value = "";

    if (url_params.has("o")) {
        existing_ordering_param_value = url_params.get("o");
        url_params.delete("o");
    }

    let existing_query_string = "";
    if (url_params.toString()) {
        existing_query_string = "?" + url_params.toString();
    }

    let orderings;

    orderings = existing_ordering_param_value
        ? existing_ordering_param_value.split(".")
        : [];

    // ------- headers -------
    const headers = fields.map(function (field, index) {
        let header;
        const header_index = index + 1;

        if (orderings.includes(`${header_index}`)) {
            const param_values_without_header_ordering = orderings
                .filter((o) => o !== `${header_index}`)
                .join(".");

            let reverse_ordering = [...orderings];
            reverse_ordering[
                orderings.indexOf(`${header_index}`)
            ] = `${-header_index}`;
            let reverse_ordering_url;

            if (existing_query_string) {
                reverse_ordering_url =
                    existing_query_string + "&o=" + reverse_ordering.join(".");
            } else {
                reverse_ordering_url = "?o=" + reverse_ordering.join(".");
            }

            let remove_header_ordering_url;

            if (existing_query_string) {
                remove_header_ordering_url =
                    existing_query_string +
                    "&o=" +
                    param_values_without_header_ordering;
            } else {
                remove_header_ordering_url =
                    "?o=" + param_values_without_header_ordering;
            }

            header = (
                <>
                    <Link
                        to={reverse_ordering_url}
                        className="me-2 header-ordering-link link-underline link-underline-opacity-0"
                    >
                        {get_field_display_name(field)}
                        <i className="ms-2 fa-solid fa-up-long text-danger"></i>
                    </Link>
                    <Link
                        to={remove_header_ordering_url}
                        className="header-remove-ordering-link link-underline link-underline-opacity-0"
                    >
                        <i className="fa-solid fa-xmark text-danger"></i>
                    </Link>
                </>
            );
        } else if (orderings.includes(`${-header_index}`)) {
            const param_values_without_header_ordering = orderings
                .filter((o) => o !== `${-header_index}`)
                .join(".");

            let reverse_ordering = [...orderings];
            reverse_ordering[
                orderings.indexOf(`${-header_index}`)
            ] = `${header_index}`;
            let reverse_ordering_url;

            if (existing_query_string) {
                reverse_ordering_url =
                    existing_query_string + "&o=" + reverse_ordering.join(".");
            } else {
                reverse_ordering_url = "?o=" + reverse_ordering.join(".");
            }

            let remove_header_ordering_url;

            if (existing_query_string) {
                remove_header_ordering_url =
                    existing_query_string +
                    "&o=" +
                    param_values_without_header_ordering;
            } else {
                remove_header_ordering_url =
                    "?o=" + param_values_without_header_ordering;
            }

            header = (
                <>
                    <Link
                        to={reverse_ordering_url}
                        className="me-2 header-ordering-link link-underline link-underline-opacity-0"
                    >
                        {field.charAt(0).toUpperCase() +
                            field.replaceAll("_", " ").slice(1)}
                        <i className="ms-2 fa-solid fa-down-long text-danger"></i>
                    </Link>
                    <Link
                        to={remove_header_ordering_url}
                        className="header-remove-ordering-link link-underline link-underline-opacity-0"
                    >
                        <i className="fa-solid fa-xmark text-danger"></i>
                    </Link>
                </>
            );
        } else {
            let ordering_url;

            if (existing_query_string) {
                const param_value = orderings.length
                    ? orderings.join(".") + `.${header_index}`
                    : `${header_index}`;
                ordering_url = existing_query_string + "&o=" + param_value;
            } else {
                const param_value = orderings.length
                    ? orderings.join(".") + `.${header_index}`
                    : `${header_index}`;
                ordering_url = "?o=" + param_value;
            }

            header = (
                <>
                    <Link
                        to={ordering_url}
                        className="header-remove-ordering-link link-underline link-underline-opacity-0"
                    >
                        {field.charAt(0).toUpperCase() +
                            field.replaceAll("_", " ").slice(1)}
                    </Link>
                </>
            );
        }

        return <th key={"header_" + index}>{header}</th>;
    });

    // ------- headers_action_select -------
    const headers_action_select = (
        <th>
            <input
                type="checkbox"
                id="select_entire_list"
                className="form-check-input"
                onClick={function (e) {
                    if (e.target.checked) {
                        document
                            .querySelectorAll(".action-select")
                            .forEach((chechbox) => (chechbox.checked = true));
                    } else {
                        document
                            .querySelectorAll(".action-select")
                            .forEach((chechbox) => (chechbox.checked = false));
                        const select_across_checkbox =
                            document.getElementById("select_across");
                        const select_across_checkbox_label =
                            document.getElementById("select_across_label");
                        if (select_across_checkbox.checked) {
                            select_across_checkbox_label.click();
                        }
                    }
                }}
            />
        </th>
    );

    return (
        <tr>
            {headers_action_select}
            {headers}
        </tr>
    );
}

function Actions({ actions, total_objects_num }) {
    let navigate = useNavigate();

    const actions_jsx = actions
        ? actions.map((a, index) => (
              <option value={a[0]} key={a[0] + "_action_" + index}>
                  {a[1]}
              </option>
          ))
        : actions;
    return (
        <>
            <Row id="actions" className="p-0 m-0 flex-row">
                <Col
                    xs="12"
                    md="8"
                    lg="6"
                    xxl="4"
                    className="d-flex flex-row justify-content-start ms-0 mt-4 pt-4"
                >
                    <Form.Select
                        name="action"
                        id="action_selection"
                        aria-label="actions"
                    >
                        {actions_jsx}
                    </Form.Select>
                    <input
                        type="hidden"
                        name="index"
                        value="0"
                        id="index_hidden"
                    />
                    <button
                        type="button"
                        className="btn btn-outline-primary rounded-0 px-3 ms-2"
                        onClick={get_perform_action_redirect(navigate)}
                    >
                        Go
                    </button>

                    <div className="form-check d-flex flex-row ms-1">
                        <input
                            type="hidden"
                            className="btn-check"
                            name="select_across"
                            value="0"
                            id="select_across"
                            autoComplete="off"
                        />
                        <input
                            type="checkbox"
                            className="btn-check"
                            id="select_across_checkbox"
                            autoComplete="off"
                        />
                        <label
                            className="btn rounded-0 text-nowrap px-1"
                            htmlFor="select_across_checkbox"
                            id="select_across_label"
                            onClick={(e) => {
                                const select_across_checkbox =
                                    document.getElementById(
                                        "select_across_checkbox"
                                    );
                                const select_across =
                                    document.getElementById("select_across");
                                const select_entire_list =
                                    document.getElementById(
                                        "select_entire_list"
                                    );

                                // will change the checked state immediately,
                                // since it was just clicked
                                if (!select_across_checkbox.checked) {
                                    select_across.value = 1;
                                    document
                                        .querySelectorAll(".action-select")
                                        .forEach(
                                            (chechbox) =>
                                                (chechbox.checked = true)
                                        );
                                    select_entire_list.checked = true;

                                    if (
                                        !e.target.classList.contains(
                                            "bg-primary"
                                        )
                                    ) {
                                        e.target.classList.add("bg-primary");
                                    }
                                    if (
                                        !e.target.classList.contains(
                                            "text-white"
                                        )
                                    ) {
                                        e.target.classList.add("text-white");
                                    }
                                    e.target.innerText = `Selected all ${total_objects_num}`;
                                } else {
                                    select_across.value = 0;
                                    document
                                        .querySelectorAll(".action-select")
                                        .forEach(
                                            (chechbox) =>
                                                (chechbox.checked = false)
                                        );
                                    select_entire_list.checked = false;

                                    if (
                                        e.target.classList.contains(
                                            "bg-primary"
                                        )
                                    ) {
                                        e.target.classList.remove("bg-primary");
                                    }
                                    if (
                                        e.target.classList.contains(
                                            "text-white"
                                        )
                                    ) {
                                        e.target.classList.remove("text-white");
                                    }
                                    e.target.innerText = `Select all ${total_objects_num}`;
                                }
                            }}
                        >
                            Select all {total_objects_num}
                        </label>
                    </div>
                </Col>
            </Row>
        </>
    );
}

function ListTable({
    results,
    fields,
    list_max_show_all,
    total_objects_num,
    total_pages,
    page,
}) {
    const { app_name, model_name } = useParams();
    const list_path = `/${app_name}/${model_name}/`;

    // ------- filter out pk -------
    fields = fields ? fields.filter((f) => f != "pk") : fields;
    fields.push(" ");

    // ------- table -------
    let rows_jsx = null;

    if (results && results.length) {
        rows_jsx = results.map((item) => (
            <tr key={"object_list_item_" + item.pk}>
                {/* This is the checkbox for the list actions */}
                <td className="">
                    <input
                        type="checkbox"
                        name="_selected_action"
                        value={item.pk}
                        object_pk={item.pk}
                        className="action-select form-check-input"
                    />
                </td>

                {/* Actual data */}
                {fields.map(function (fieldname, index) {
                    if (fieldname === " ") {
                        const object_url = list_path + item.pk + "/";

                        return (
                            <td key={`${item.pk}_${fieldname}`}>
                                <Link
                                    to={object_url}
                                    className="link-underline link-underline-opacity-0"
                                >
                                    <i className="fa-solid fa-eye fa-xl"></i>
                                </Link>
                            </td>
                        );
                    }
                    return (
                        <td key={`${fieldname}_${item.pk}`}>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: item[fieldname],
                                }}
                            />
                        </td>
                    );
                })}
            </tr>
        ));
    }

    let show_all = null;

    if (
        !(
            list_max_show_all === null ||
            list_max_show_all === undefined ||
            total_objects_num === null ||
            total_objects_num === undefined
        )
    ) {
        show_all =
            list_max_show_all >= total_objects_num &&
            get_query_param_value("all") === null;
    }

    const show_paginator = total_pages && page;

    return rows_jsx ? (
        <Row className="py-4 px-2">
            <Col xs="12" className="mb-3 p-0">
                <Table responsive hover id="change_list_table">
                    <thead>
                        <Headers fields={fields} />
                    </thead>
                    <tbody>{rows_jsx}</tbody>
                </Table>
            </Col>

            <Col className="mb-3 d-flex flex-row">
                <div className="p-0 me-auto d-flex flex-row">
                    <p className="my-auto">
                        Total objects: {total_objects_num}
                    </p>
                    {show_all && (
                        <Link
                            to={augment_query_string("all", "")}
                            className="btn btn-outline-primary my-auto mx-3 rounded-0"
                        >
                            Show all
                        </Link>
                    )}
                </div>
                {show_paginator && (
                    <Paginator total_pages={total_pages} page={page} />
                )}
            </Col>
        </Row>
    ) : (
        <Row className="p-4 w-100 text-center">No data found</Row>
    );
}

function ChangeListTable({
    results,
    fields,
    actions,
    list_max_show_all,
    total_objects_num,
    total_pages,
    page,
}) {
    // ------- props data structure -------
    // {
    //     "results": serializer.data,
    //     "page": cl.page_num,
    //     "total_pages": cl.paginator.num_pages,
    //     "total_objects_num": cl.paginator.count,
    // }

    return (
        <RouterForm
            id="actions_form"
            method="post"
            fluid="true"
            className="p-0 m-0 fade-in"
            encType={"multipart/form-data"}
        >
            <Actions actions={actions} total_objects_num={total_objects_num} />

            <ListTable
                results={results}
                fields={fields}
                list_max_show_all={list_max_show_all}
                total_objects_num={total_objects_num}
                total_pages={total_pages}
                page={page}
            />
        </RouterForm>
    );
}

export { ChangeListTable, ChangeListFilters };
