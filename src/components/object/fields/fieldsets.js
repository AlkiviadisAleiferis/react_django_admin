import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { get_field_display_name } from "../../../utils";

import { ReadonlyField, EditableField, FieldLabel, FieldErrors } from "./fields";

const HIDDEN_FIELD_TYPES = ["hidden", "InlineForeignKeyField"];

// ---------------- Stacked Fieldsets ----------------

export function StackedFieldset({
    app,
    model,
    fieldnames,
    readonly_fields,
    fields,
    error_data,
    prefix
}) {
    /* 
    --------------------------------------
    StackedFieldset logic:
        for every field (not readonly) 
        build the input in the fieldset
        a row with 2 cols sectors: 
        
            A. field label <FieldLabel />
            B. field value <EditableField/>

        for every readonly field 
        also build a row with 2 cols:

            A. field label <FieldLabel />
            B. field readonly value <ReadonlyField/>

        StackedFieldset should be agnostic 
        of the parent component.
    --------------------------------------
    */
    const readonly_fields_names = Object.keys(readonly_fields);

    return fieldnames.map(function (fieldname, index) {
        /* 
            for each fieldname
            construct the corresponding
            jsx row
        */

        const is_readonly = readonly_fields_names.includes(fieldname);

        if (is_readonly) {
            /* ---------------- READONLY CASE ---------------- */
            const field = fieldname in readonly_fields ? readonly_fields[fieldname] : {};

            return (
                <Row key={"field_" + fieldname} className="my-2">
                    {/*  Field name  */}
                    <Col xs="12" lg="4" className="d-flex flex-row align-items-start">
                        <FieldLabel fieldname={fieldname} field={field} />
                    </Col>

                    {/*  Field value  */}
                    <Col xs="12" lg="8" className="d-flex flex-column align-items-start">
                        <ReadonlyField field={field} />
                    </Col>
                </Row>
            );
        } else {
            /* ---------------- EDITABLE CASE ---------------- */
            const field = fieldname in fields ? fields[fieldname] : {};

            const extra_classes = HIDDEN_FIELD_TYPES.includes(field.type) ? " d-none" : "";

            return (
                <Row
                    key={"field_row_" + prefix + "_" + fieldname}
                    className={"my-2" + extra_classes}
                >
                    {/*  -------- Field name section -------- */}
                    <Col xs="12" lg="4" className="d-flex flex-row align-items-start">
                        <FieldLabel fieldname={fieldname} field={field} />
                    </Col>

                    {/* -------- Field input / value section -------- */}
                    <Col xs="12" lg="8" className="d-flex flex-row align-items-start">
                        <EditableField
                            key={"fieldset_field_" + fieldname + "_" + index}
                            app={app}
                            model={model}
                            fieldname={fieldname}
                            fields={fields}
                            prefix={prefix ? prefix : ""}
                        />
                    </Col>

                    {/* -------- Field errors -------- */}
                    <Col xs="12" className="d-flex flex-column align-items-start">
                        <FieldErrors
                            error_data={error_data}
                            fieldname={fieldname}
                            prefix={prefix ? prefix : ""}
                        />
                    </Col>
                </Row>
            );
        }
    });
}

export function ReadonlyStackedFieldset({ object, fieldnames }) {
    const rows_jsx = fieldnames.map(function (fieldname, index) {
        return (
            <tr key={"fieldset_row_" + fieldname + index}>
                <td className="d-flex flex-row align-items-center">
                    <FieldLabel fieldname={fieldname} field={object[fieldname]} />
                </td>

                <td className="text-wrap">
                    <ReadonlyField field={object[fieldname]} />
                </td>
            </tr>
        );
    });

    return (
        <Row className="mb-4">
            <Col xs="12" lg="8" xxl="6" className="d-flex flex-column">
                <Table responsive hover borderless>
                    <tbody>{rows_jsx}</tbody>
                </Table>
            </Col>
        </Row>
    );
}

// ---------------- Tabular Fieldsets ----------------

export function TabularFieldsetHeaders({ inline }) {
    const tab_name = inline.label.toLowerCase().replace(" ", "_");

    const all_fieldnames = inline.all_fieldnames.filter(fieldname => fieldname !== "pk");

    const fields_num = all_fieldnames.length;
    const cols = fields_num > 5 ? 12 : fields_num * 2;

    return all_fieldnames.map(fieldname => (
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
}

export function ReadonlyTabularFieldset({ all_fieldnames, object }) {
    const fields_cells = all_fieldnames.map(function (fieldname) {
        if (!(fieldname in object)) {
            return <tr className="p-2"></tr>;
        }

        return (
            <td
                key={`tabular_row_${fieldname}`}
                className="text-wrap"
                style={{ minWidth: "150px" }}
            >
                <ReadonlyField field={object[fieldname]} />
            </td>
        );
    });

    return <tr>{fields_cells}</tr>;
}

// ---------------- Auxiliary funcs ----------------

/**
 * takes certain data structures
 * and returns the jsx of the fieldsets' tabs
 *
 * @param {fieldsets} django admin fieldsets structure
 * @param {app} str: the model's app
 * @param {model} str: the model's name
 * @param {fields} object with fields' data
 * @param {readonly_fields} object with readonly fields
 * @param {error_data} Error data due to action { "fieldname": [{"message": "...", "code": "..."}] }
 *
 * @return jsx of fieldsets tabs
 */
export function build_object_fieldsets_tabs(
    fieldsets,
    app,
    model,
    fields,
    readonly_fields,
    error_data
) {
    fieldsets = fieldsets ? fieldsets : [];
    const fields_with_errors = error_data ? Object.keys(error_data) : [];

    return fieldsets.map(function (fieldset, index) {
        const tab_title = fieldset[0] ? fieldset[0] : "General";
        const fieldnames = fieldset[1]["fields"];

        const errors = fieldnames.filter(fieldname =>
            fields_with_errors.includes(fieldname)
        ).length;

        const fieldset_classes = errors ? "text-danger" : "";

        return (
            <Tab
                eventKey={tab_title.toLowerCase().replace(" ", "_")}
                title={<span className={fieldset_classes}>{tab_title}</span>}
                key={`${app}_${model}_fieldset_${index}`}
            >
                <Row className="my-2">
                    <Col xs="12" className="d-flex flex-column">
                        <StackedFieldset
                            app={app}
                            model={model}
                            fieldnames={fieldnames}
                            fields={fields}
                            readonly_fields={readonly_fields}
                            error_data={error_data}
                        />
                    </Col>
                </Row>
            </Tab>
        );
    });
}
