import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { below_object_actions } from "./below_object_actions";
import { below_object_form } from "./below_object_form";

/* --------
If in ObjectPreview, object will be provided
If in ObjectEdit, fields will be provided
-------- */

export function BelowFormDefaultSection({ object, fields }) {
    return (
        <Row className="p-0 mx-0 w-100 mt-4">
            <Col xs="12" className="border-top" id="below_object_form"></Col>
        </Row>
    );
}

export function BelowActionsDefaultSection({ object, fields }) {
    return (
        <div
            className="d-flex flex-md-column flex-row p-1 justify-content-center align-items-center mt-3"
            id="below_object_actions"
        ></div>
    );
}

export const object_extra_sections = {
    below_form: {
        __all__: BelowFormDefaultSection,
        ...below_object_form,
    },
    below_actions: {
        __all__: BelowActionsDefaultSection,
        ...below_object_actions,
    },
};

export function get_below_form_section(app_name, model_name) {
    const app_and_model = `${app_name}_${model_name}`;
    const below_form = object_extra_sections.below_form;
    return below_form[app_and_model]
        ? below_form[app_and_model]
        : below_form["__all__"];
}

export function get_below_actions_section(app_name, model_name) {
    const app_and_model = `${app_name}_${model_name}`;
    const below_actions = object_extra_sections.below_actions;
    return below_actions[app_and_model]
        ? below_actions[app_and_model]
        : below_actions["__all__"];
}
