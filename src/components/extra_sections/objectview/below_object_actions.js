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

export function DefaultSection({ object, extra_data }) {
    return (
        <div
            className="d-flex flex-md-column flex-row p-1 justify-content-center align-items-center mt-3"
            id="below_object_actions"
        ></div>
    );
}

export const below_object_view_actions = {};
