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

export function DefaultSection({ results, fields, no_data, extra_data }) {
    return (
        <Row className="p-0 mx-0 w-100 my-2" id="above_list_filters">
            <Col xs="12" className="justify-content-start flex-row"></Col>
        </Row>
    );
}

export const above_list_filters = {};
