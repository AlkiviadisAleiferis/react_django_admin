import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { get_field_display_name } from "../../utils";
import { useState } from "react";
import { get_input_id, get_input_name } from "./fields";
import { Fieldset, FieldValue } from "./fieldsets";

// ---------------- Auxiliary funcs ----------------

/**
 * takes certain data structures
 * and returns the jsx of the admin inlines tabs
 * 
 * @param {inlines} array of all the inlines
 * @param {inlines_error_data} 
 * 
 * inlines_error_data = {
 * 
        inline.prefix : {

            "form_errors": {

                fieldname : [
                    {"message": str}, 
                    ...
                ],
                ... 
            },

            "inlines_errors": {

                "forms_errors" : [
                    {},
                    {"__all__" : [str], fieldname: [str] },
                    ...
                ],

                "non_forms_errors" : "html_string"
            }

        },

        ...
    }
 * 
 * @return jsx of fieldsets tabs
 * 
*/
export function build_inline_tabs(inlines, inlines_error_data) {
    // TODO: build tabular. currently only stacked inline

    if (inlines && inlines.length) {
        return inlines.map(function (inline, index1) {
            /* -------------------------------------- */
            const tab_title = inline.label;
            const tab_name = tab_title.toLowerCase().replace(" ", "_");

            const inline_error_data =
                inlines_error_data && inline.prefix in inlines_error_data
                    ? inlines_error_data[inline.prefix]
                    : null;

            let errors_in_inline = false;

            if (inline_error_data) {
                const forms_errors = inline_error_data.forms_errors;
                const non_forms_errors = inline_error_data.non_forms_errors;

                for (let errors_object of forms_errors) {
                    if (Object.keys(errors_object).length) {
                        errors_in_inline = true;
                        break;
                    }
                }
                if (non_forms_errors) {
                    errors_in_inline = true;
                }
            }

            /* -------- return single inline tab jsx -------- */

            return (
                <Tab
                    eventKey={tab_name}
                    title={
                        <b className={errors_in_inline ? "text-danger" : ""}>
                            {tab_title}
                        </b>
                    }
                    key={"inline_" + tab_name}
                >
                    <Row className="my-2">
                        <Col xs="12" className="d-flex flex-column">
                            {/* -------- StackedInline -------- */}
                            <StackedInline
                                key={`${inline.prefix}_${index1}`}
                                inline={inline}
                                inline_error_data={inline_error_data}
                            />
                        </Col>
                    </Row>
                </Tab>
            );
        });
    } else {
        return null;
    }
}

function get_inline_container_id(inline_prefix) {
    return `inline__${inline_prefix}`;
}

function get_inline_form_container_id(inline_prefix, index) {
    return `inline__${inline_prefix}__${index}`;
}

function get_delete_new_form(inline_prefix, form_index, forms, set_forms) {
    function delete_new_form() {
        // -------- remove form
        const form_container = document.getElementById(
            get_inline_form_container_id(inline_prefix, form_index)
        );
        form_container.classList.add("d-none");
    }

    return delete_new_form;
}

function get_add_form_to_inline(inline, forms, set_forms) {
    function add_form_to_inline() {
        if (!inline.extra_form) {
            return;
        }
        let new_form = { ...inline.extra_form };
        new_form.prefix = `${inline.prefix}-${forms.length}`;
        document.getElementById("id_" + inline.prefix + "-TOTAL_FORMS").value = forms.length + 1;
        set_forms([...forms, new_form]);
    }

    return add_form_to_inline;
}

// ---------------- Reusable ----------------

export function AddFormButton({ inline, forms, set_forms }) {
    const tab_name = inline.label.toLowerCase().replace(" ", "_");

    const can_add_form =
        inline.permissions.add &&
        forms.length < inline.max_forms_num &&
        inline.extra_form;

    return can_add_form ? (
        <Row className="my-2">
            <Col xs="12" className="d-flex">
                <button
                    id={`add_form__${tab_name}`}
                    className="btn btn-outline-primary border px-4 py-2 d-flex shadow-sm"
                    type="button"
                    onClick={get_add_form_to_inline(inline, forms, set_forms)}
                >
                    <h6 className="my-auto">Add another</h6>
                    <i
                        className="fa-solid fa-square-plus ms-3 my-auto"
                        style={{ fontSize: "25px" }}
                    ></i>
                </button>
            </Col>
        </Row>
    ) : null;
}

function NonFieldErrors({ inline, error_data }) {
    const non_field_errors =
        error_data && "__all__" in error_data ? error_data["__all__"] : [];

    return non_field_errors.map((non_field_error, index) => (
        <p
            className="text-danger"
            key={inline.prefix + "_non_form_error_" + index}
        >
            {non_field_error}
        </p>
    ));
}

function DeleteFormButton({ inline, form, index, forms, set_forms }) {
    if (index + 1 > inline.min_forms_num) {
        return (
            <>
                <label
                    htmlFor={get_input_id("DELETE", form.prefix)}
                    className="btn border-0 bg-transparent ms-auto text-primary"
                >
                    <i
                        className="fa-solid fa-trash-can"
                        style={{ fontSize: "30px" }}
                    ></i>
                </label>
                <input
                    className="d-none"
                    type="checkbox"
                    name={get_input_name("DELETE", form.prefix)}
                    id={get_input_id("DELETE", form.prefix)}
                    onClick={get_delete_new_form(
                        inline.prefix,
                        index,
                        forms,
                        set_forms
                    )}
                ></input>
            </>
        );
    } else {
        return null;
    }
}

// ---------------- Management Form ----------------

export function ManagementForm({ management_form, forms }) {
    const prefix = management_form.prefix;
    const fields = management_form.fields;
    const fieldnames = Object.keys(fields);

    const inputs = fieldnames.map(function (fieldname) {
        const defaultValue = fieldname === "TOTAL_FORMS" ? forms.length : fields[fieldname]["initial"];
        return (
            <input
                key={`${prefix}-${fieldname}`}
                type="hidden"
                name={`${prefix}-${fieldname}`}
                id={`id_${prefix}-${fieldname}`}
                defaultValue={defaultValue}
            />
        );
    });

    return (
        <div className="d-none" id={`${prefix}_management_form_container`}>
            {inputs}
        </div>
    );
}

/* 
--------------------------------------------

    NOTE:

    Management form's fields:

        - id_`formset_prefix`-TOTAL_FORMS
        - `formset_prefix`-INITIAL_FORMS
        - `formset_prefix`-MIN_NUM_FORMS
        - `formset_prefix`-MAX_NUM_FORMS

--------------------------------------------
*/

// ---------------- Stacked Inline Form ----------------

function StackedInlineForm({
    inline,
    form,
    index, // form index
    forms,
    set_forms,
    error_data,
}) {
    const app = inline.app;
    const model = inline.model;
    const readonly_fields = form.readonly_fields;
    const fieldnames = Object.keys(form.fields);

    const readonly_fields_fieldnames = Array.isArray(readonly_fields)
        ? readonly_fields
        : Object.keys(readonly_fields);

    const all_fieldnames = [...readonly_fields_fieldnames, ...fieldnames];
    const inline_form_container_id = get_inline_form_container_id(
        inline.prefix,
        index
    );
    const form_fieldnames = [...all_fieldnames];

    // in case of non-bound by object form
    // we render another delete button that
    // removes form after deletion
    let delete_button = null;
    if (
        form_fieldnames.includes("DELETE") &&
        !form.fields[inline.pk_name].initial // = is not bound by object
    ) {
        form_fieldnames.pop("DELETE");
        delete_button =  <DeleteFormButton
            inline={inline}
            form={form}
            index={index}
            forms={forms}
            set_forms={set_forms}
        />
    }
    
    return (
        <Col
            xs="12"
            lg="8"
            xxl="4"
            className="p-2"
            id={inline_form_container_id}
        >
            <div className="d-flex flex-column p-3 rounded border shadow w-100 h-100">
                <NonFieldErrors error_data={error_data} inline={inline} />

                <Fieldset
                    app={app}
                    model={model}
                    fieldnames={form_fieldnames}
                    readonly_fields={form.readonly_fields}
                    fields={form.fields}
                    error_data={error_data}
                    prefix={form.prefix}
                />

                {delete_button}
            </div>
        </Col>
    );
}

// ---------------- Stacked Inline ----------------

// render all Stacked inline forms
// for every forms' fieldname build the input in the fieldset
// a row with two column sectors: A. name B. value

export function StackedInline({ inline, inline_error_data }) {
    //
    const [forms, set_forms] = useState(
        inline && inline.forms ? inline.forms : []
    );
    //
    if (!inline) {
        return null;
    }

    const inline_forms_jsx = forms.map(function (form, index) {
        //
        const form_error_data =
            inline_error_data && inline_error_data["forms_errors"]
                ? inline_error_data["forms_errors"][index]
                : null;
        //
        return (
            <StackedInlineForm
                // key={form.unique_id}
                key={get_inline_form_container_id(inline.prefix, index)}
                inline={inline}
                form={form}
                index={index}
                forms={forms}
                set_forms={set_forms}
                error_data={form_error_data}
            />
        );
    });

    const non_forms_error_html = inline_error_data
        ? inline_error_data["non_forms_errors"]
        : null;

    return (
        <>
            <Row className="mb-4" id={get_inline_container_id(inline.prefix)}>
                {/* -------- non_forms_errors -------- */}
                <div
                    className="text-danger"
                    dangerouslySetInnerHTML={{
                        __html: non_forms_error_html,
                    }}
                />

                {/* -------- management_form -------- */}
                <ManagementForm management_form={inline.management_form} forms={forms} />

                {/* -------- forms -------- */}
                {inline_forms_jsx}
            </Row>

            {/* -------- add_button -------- */}
            <Row className="mb-4">
                <AddFormButton
                    inline={inline}
                    forms={forms}
                    set_forms={set_forms}
                />
            </Row>
        </>
    );
}

// ---------------- Tabular Inline Form ----------------

//  ---- left here for the TabularInline ----
// const fields_num = all_fieldnames.length;
// const headers = all_fieldnames.map((fieldname) => (
//     <th
//         scope="col"
//         className=""
//         key={`inline_${tab_name}_headers_${fieldname}`}
//         style={{ minWidth: "150px" }}
//     >
//         <h6 className="">
//             <b>{get_field_display_name(fieldname)}</b>
//         </h6>
//     </th>
// ));

export function PreviewTabularInline({ inline }) {
    const tab_name = inline.label.toLowerCase().replace(" ", "_");

    const all_fieldnames = inline.all_fieldnames.filter(
        (fieldname) => fieldname !== "pk"
    );

    const fields_num = all_fieldnames.length;
    const cols = fields_num > 5 ? 12 : fields_num * 2;

    const headers = all_fieldnames.map((fieldname) => (
        <th
            scope="col"
            className=""
            key={`inline_${tab_name}_headers_${fieldname}`}
            style={{ minWidth: "150px" }}
        >
            <h6 className="">
                <b>{get_field_display_name(fieldname)}</b>
            </h6>
        </th>
    ));

    const rows = inline.objects.map(function (object, index) {
        const cols = all_fieldnames.map(function (fieldname) {
            if (!(fieldname in object)) {
                return null;
            }

            return (
                <td
                    className="text-wrap bg-light"
                    key={`inline_${tab_name}_row_${index}_${fieldname}`}
                    style={{ minWidth: "150px" }}
                >
                    <FieldValue field={object[fieldname]} />
                </td>
            );
        });
        return (
            <tr key={`inline_${tab_name}_row_${index}`} className="p-2">
                {cols}
            </tr>
        );
    });

    return (
        <Row className="mb-4">
            <Col xs="12" xl={cols} className="d-flex flex-column">
                <Table responsive hover>
                    <thead>
                        <tr>{headers}</tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </Col>
        </Row>
    );
}
