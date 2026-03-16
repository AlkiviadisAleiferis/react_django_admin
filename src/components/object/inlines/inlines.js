import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import { TabularFieldsetHeaders, ReadonlyTabularFieldset } from "../fields/fieldsets";
import { ManagementForm, StackedForm, AddNewFormButton } from "./forms";

// ---------------- helpers ----------------

function get_inline_container_id(inline_prefix) {
    return `inline__${inline_prefix}`;
}

// ---------------- Stacked Inlines ----------------

export function StackedInline({ inline, inline_error_data }) {
    const [forms, setForms] = useState(inline && inline.forms ? inline.forms : []);

    if (!inline) {
        return null;
    }

    const inline_forms_jsx = forms.map(function (form, index) {
        const form_error_data =
            inline_error_data && inline_error_data.forms_errors
                ? inline_error_data.forms_errors[index]
                : null;

        return (
            <StackedForm
                // key={form.unique_id}
                key={inline.prefix + "__" + index}
                inline={inline}
                form={form}
                index={index}
                error_data={form_error_data}
            />
        );
    });

    const non_forms_errors = inline_error_data ? inline_error_data.non_forms_errors : [];

    const non_forms_error_jsx = non_forms_errors.map((non_form_error, index) => (
        <p className="text-danger" key={inline.prefix + "_non_form_error_" + index}>
            {non_form_error.message}
        </p>
    ));

    return (
        <>
            <Row className="mb-4" id={get_inline_container_id(inline.prefix)}>
                {/* -------- NON FORMS ERRORS -------- */}
                {non_forms_error_jsx}

                {/* -------- MANAGEMENT FORM -------- */}
                <ManagementForm management_form={inline.management_form} forms={forms} />

                {/* -------- FORMS -------- */}
                {inline_forms_jsx}
            </Row>

            {/* -------- ADD NEW FORM -------- */}
            <Row className="mb-4">
                <AddNewFormButton inline={inline} forms={forms} setForms={setForms} />
            </Row>
        </>
    );
}

// ---------------- Tabular Inlines ----------------

export function ReadonlyTabularInline({ inline }) {
    const all_fieldnames = inline.all_fieldnames;

    const cols = all_fieldnames.length > 5 ? 12 : all_fieldnames.length * 2;

    return (
        <Row className="mb-4">
            <Col xs="12" xl={cols} className="d-flex flex-column">
                <Table responsive hover>
                    <thead>
                        <tr>
                            <TabularFieldsetHeaders inline={inline} />
                        </tr>
                    </thead>
                    <tbody>
                        {inline.objects.map(function (object, index) {
                            return (
                                <ReadonlyTabularFieldset
                                    all_fieldnames={all_fieldnames}
                                    object={object}
                                    key={`tabular_row_${index}`}
                                />
                            );
                        })}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
}
