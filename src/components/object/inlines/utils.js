import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { StackedInline } from "./inlines";

export function build_inline_tabs(inlines, inlines_error_data) {
    // TODO: build tabular. currently only stacked inline
    inlines = inlines || [];

    return inlines.map(function (inline, index1) {
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
            if (non_forms_errors.length > 0) {
                errors_in_inline = true;
            }
        }

        return (
            <Tab
                eventKey={tab_name}
                title={<span className={errors_in_inline ? "text-danger" : ""}>{tab_title}</span>}
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
}
