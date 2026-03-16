import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import { get_field_display_name, get_random_num } from "../../../utils";
import { build_field_input, build_field_value } from "./helpers";

export function HelpText({ text }) {
    return text ? (
        <OverlayTrigger
            key={"right"}
            placement={"right"}
            overlay={
                <Tooltip id={`tooltip-${get_random_num()}`}>
                    <span dangerouslySetInnerHTML={{ __html: text }} />
                </Tooltip>
            }
        >
            <Button variant="info" className="p-0 bg-transparent border-0 m-0">
                <i className="fa-solid fa-question text-danger"></i>
            </Button>
        </OverlayTrigger>
    ) : null;
}

export function EditableField({ app, model, fieldname, fields, prefix }) {
    const field = fieldname in fields ? fields[fieldname] : {};
    return build_field_input(app, model, field, fieldname, prefix);
}

export function ReadonlyField({ field }) {
    return build_field_value(field);
}

export function FieldLabel({ fieldname, field }) {
    const label_str = "label" in field ? field.label : get_field_display_name(fieldname);

    const required_jsx = field.required ? (
        <i
            className="ms-2 my-auto text-danger fa-solid fa-asterisk"
            style={{ fontSize: "10px" }}
        ></i>
    ) : null;

    return (
        <>
            <h6 className="me-3">
                <b>{label_str}</b>
                {required_jsx}
            </h6>
            <HelpText text={field.help_text || ""} />
        </>
    );
}

export function FieldErrors({ fieldname, error_data, prefix }) {
    const field_errors = error_data && fieldname in error_data ? error_data[fieldname] : [];

    return field_errors.map(function (error, i) {
        // errors have different format in formsets (prefix)
        const error_message = prefix ? error : error.message;

        return (
            <p key={fieldname + "_errors_" + i} className="text-danger px-2">
                <b>{error_message}</b>
            </p>
        );
    });
}
