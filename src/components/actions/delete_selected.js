import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { JsonToTable } from "react-json-to-table";

function NestedObjectsList({ nested_objects }) {
    return nested_objects.map(function (obj, index) {
        if (Array.isArray(obj)) {
            return (
                <ul key={crypto.randomUUID()}>
                    <NestedObjectsList nested_objects={obj} />
                </ul>
            );
        } else {
            return (
                <li key={crypto.randomUUID()}>
                    <span dangerouslySetInnerHTML={{ __html: obj }} />
                </li>
            );
        }
    });
}

export function DeleteAction({ action_data }) {
    {
        /* 
        {
            ------------------------------
            "deletable_objects": deletable_objects [str, .., [.. []]],
            ------------------------------
            "model_count": model_count {model_verbose_name: count},
            ------------------------------
            "perms_needed": perms_needed,
            ------------------------------
            "protected": protected,
            ------------------------------
        }
    */
    }

    const deletable_objects = action_data.deletable_objects;
    const model_count = action_data.model_count;
    const perms_needed = action_data.perms_needed;
    const protected_ = action_data.protected;

    let inner_deletion_jsx;

    // -------- cant view case
    if (!deletable_objects) {
        inner_deletion_jsx = null;
    } else {
        // -------- perms_needed case
        if (perms_needed && perms_needed.length) {
            inner_deletion_jsx = (
                <>
                    <p>
                        <b>
                            Deleting the selected objects would result in
                            deleting related objects, but your account doesn't
                            have permission to delete the following types of
                            objects:
                        </b>
                    </p>
                    <JsonToTable json={perms_needed} />
                </>
            );

            // -------- protected case
        } else if (protected_ && protected_.length) {
            inner_deletion_jsx = (
                <>
                    <p>
                        <b>
                            Deleting the selected objects would require deleting
                            the following protected related objects:
                        </b>
                    </p>
                    <NestedObjectsList nested_objects={protected_} />
                </>
            );
        } else {
            inner_deletion_jsx = (
                <>
                    <Row className="p-4">
                        <Col xs="12" className="d-flex flex-column">
                            <p>
                                <b>
                                    Are you sure you want to delete selected
                                    objects? All of the following related items
                                    will be deleted:
                                </b>
                            </p>
                            <NestedObjectsList
                                nested_objects={deletable_objects}
                            />
                        </Col>
                    </Row>

                    <Row className="justify-content-end p-4">
                        <Col
                            xs="12"
                            sm="8"
                            lg="6"
                            xxl="4"
                            className="d-flex flex-column"
                        >
                            <h5>
                                <b>Summary:</b>
                            </h5>
                            <JsonToTable json={model_count} />
                        </Col>
                    </Row>

                    <Row className="justify-content-end my-4 p-4">
                        <Col
                            xs="12"
                            sm="6"
                            lg="4"
                            xxl="4"
                            className="d-flex flex-column"
                        >
                            <input
                                type="submit"
                                className="btn btn-outline-danger px-3 rounded-0"
                                value={"Confirm"}
                            />
                        </Col>
                    </Row>
                </>
            );
        }
    }

    return inner_deletion_jsx;
}
