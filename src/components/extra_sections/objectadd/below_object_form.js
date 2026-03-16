import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/* --------------------------------

Create your components and map them in
the mapping below, with the convention:

    `${app_name}__${model_name}`: Component

See `DefaultSection` Component for example.

This file will be avoided to change
in order to provide easier merge-ability
and preservation to custom changes.

-------------------------------- */

export function DefaultSection({ extra_data }) {
    return (
        <Row className="p-0 mx-0 w-100 mt-4">
            <Col xs="12" className="border-top" id="below_object_form"></Col>
        </Row>
    );
}

export const below_object_add_form = {};
