import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import { useState } from "react";
import { StackedFieldset } from "../fields/fieldsets";
import { get_input_id, get_input_name } from "../fields/field_inputs";
import { ADMIN_SITE_PREFERENCES } from "../../../settings";

// ---------------- helpers ----------------

function get_inline_form_container_id(inline_prefix, index) {
    return `inline__${inline_prefix}__${index}`;
}

// ---------------- reusable ----------------

export function AddNewFormButton({ inline, forms, setForms }) {
    /* 
    The add form button in inlines
    follows the same logic as django admin's interface.

    The total forms (initial and extra)
    must be at most `inline.max_forms_num`.
    

    Button works only when:
    - user has `permission.add`
    - `extra_form` is provided
    - the number of current **visible** forms is less than `inline.max_forms_num`
    */
    const [show, setShow] = useState(false);

    function add_form_to_inline() {
        if (!inline.extra_form) {
            return;
        }

        const non_deleted_forms_num = forms.filter(f => !f.deleted).length;

        if (non_deleted_forms_num >= inline.max_forms_num) {
            setShow(true);
            return;
        } else {
            let new_form = { ...inline.extra_form };
            new_form.prefix = `${inline.prefix}-${forms.length}`;

            document.getElementById("id_" + inline.prefix + "-TOTAL_FORMS").value =
                forms.length + 1;

            setForms([...forms, new_form]);
        }
    }

    if (show) {
        return (
            <Row className="my-2">
                <Col xs="12" lg="6" xl="3" className="d-flex">
                    <Alert
                        variant="danger"
                        className="w-100"
                        onClose={() => setShow(false)}
                        dismissible
                    >
                        <Alert.Heading>Maximum forms reached!</Alert.Heading>
                        <p>You cannot add more than {inline.max_forms_num} forms.</p>
                    </Alert>
                </Col>
            </Row>
        );
    }

    const tab_name = inline.label.toLowerCase().replace(" ", "_");

    const can_add_form = inline.permissions.add && inline.extra_form;

    return can_add_form ? (
        <Row className="my-2">
            <Col xs="12" className="d-flex">
                <button
                    id={`add_form__${tab_name}`}
                    className="btn btn-outline-primary border px-4 py-2 d-flex shadow-sm"
                    type="button"
                    onClick={add_form_to_inline}
                >
                    <h6 className="my-auto">Add another</h6>
                    {ADMIN_SITE_PREFERENCES.object_add_link_icon(null, "ms-3 my-auto")}
                </button>
            </Col>
        </Row>
    ) : null;
}

function DeleteNewFormButton({ inline, form, index }) {
    function delete_new_form() {
        const form_container = document.getElementById(
            get_inline_form_container_id(inline.prefix, index)
        );
        form_container.remove();
        form.deleted = true;
    }

    /* 
    When min_num is set on the Inline formset,
    we should not allow deleting forms below the minimum.
    Affects only the first rendered forms (those below min_forms_num).
    */
    if (index + 1 > inline.min_forms_num) {
        return (
            <>
                <label
                    htmlFor={get_input_id("DELETE", form.prefix)}
                    className="btn border-0 bg-transparent d-flex text-danger"
                >
                    <i className="fa-solid fa-trash-can ms-auto" style={{ fontSize: "30px" }}></i>
                </label>
                <input
                    className="d-none"
                    type="checkbox"
                    name={get_input_name("DELETE", form.prefix)}
                    id={get_input_id("DELETE", form.prefix)}
                    onClick={delete_new_form}
                ></input>
            </>
        );
    } else {
        return null;
    }
}

function NonFieldFormErrors({ inline, error_data }) {
    const non_field_errors = error_data && "__all__" in error_data ? error_data["__all__"] : [];

    return non_field_errors.map((non_field_error, index) => (
        <p className="text-danger" key={inline.prefix + "_non_form_error_" + index}>
            {non_field_error}
        </p>
    ));
}

/*  ---------------- Management Form ----------------

    Management form's fields:

        - `formset_prefix`-TOTAL_FORMS
        - `formset_prefix`-INITIAL_FORMS
        - `formset_prefix`-MIN_NUM_FORMS
        - `formset_prefix`-MAX_NUM_FORMS

------------------------------------------------------*/

export function ManagementForm({ management_form, forms }) {
    const fields = management_form.fields;
    const fieldnames = Object.keys(fields);

    const inputs = fieldnames.map(function (fieldname) {
        const defaultValue =
            fieldname === "TOTAL_FORMS" ? forms.length : fields[fieldname]["initial"];
        return (
            <input
                key={`${management_form.prefix}-${fieldname}`}
                type="hidden"
                name={`${management_form.prefix}-${fieldname}`}
                id={`id_${management_form.prefix}-${fieldname}`}
                defaultValue={defaultValue}
            />
        );
    });

    return (
        <div className="d-none" id={`${management_form.prefix}_management_form_container`}>
            {inputs}
        </div>
    );
}

/* ---------------- Stacked Inline Form ----------------
    Stacked Inline Form Component
    Renders a single inline form with its fieldsets and delete functionality.
    Provides the form + its container + errors + delete new form button
*/

export function StackedForm({
    inline,
    form,
    index, // form index
    error_data
}) {
    const app = inline.app;
    const model = inline.model;

    const form_fieldnames = [...Object.keys(form.readonly_fields), ...Object.keys(form.fields)];

    const inline_form_container_id = get_inline_form_container_id(inline.prefix, index);

    /*
    DELETE for new objects forms:
    in case of non-bound by object form
    we render a delete button that
    removes form.

    Bound forms have already such an
    input field (if delete permission).
    */
    let Delete = null;
    if (
        !form.fields[inline.pk_name].initial // = is not bound by object
    ) {
        if (form_fieldnames.includes("DELETE")) {
            form_fieldnames.pop("DELETE");
        }
        Delete = DeleteNewFormButton;
    }

    return (
        <Col
            xs="12"
            lg="8"
            xxl="4"
            className="p-3 d-flex flex-column"
            id={inline_form_container_id}
        >
            <Row className="d-flex flex-column p-2 rounded border shadow w-100 h-100">
                <NonFieldFormErrors error_data={error_data} inline={inline} />

                <StackedFieldset
                    app={app}
                    model={model}
                    fieldnames={form_fieldnames}
                    readonly_fields={form.readonly_fields}
                    fields={form.fields}
                    error_data={error_data}
                    prefix={form.prefix}
                />
                {Delete && <Delete inline={inline} form={form} index={index} />}
            </Row>
        </Col>
    );
}
