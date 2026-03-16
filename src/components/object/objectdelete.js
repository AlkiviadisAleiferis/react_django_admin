import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Form as RouterForm, useParams } from "react-router-dom";
import ObjectActions from "./objectactions";
import { JsonToTable } from "react-json-to-table";
import { extra_sections } from "../extra_sections/mapping";
import { ADMIN_SITE_PREFERENCES } from "../../settings";

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

function ObjectConfirmDelete({
    object_repr,
    deleted_objects,
    model_count,
    perms_needed,
    protected_,
    extra_data
}) {
    {
        /* 
        {
            ------------------------------
            "object_repr": str
            ------------------------------
            "permissions": {
                "view": bool,
                "change": bool,
                "delete": bool,
            },
            ------------------------------
            "deleted_objects": deleted_objects [str, .., [.. []]],
            ------------------------------
            "model_count": model_count {model_verbose_name: count},
            ------------------------------
            "perms_needed": perms_needed,
            ------------------------------
            "protected": protected,
            ------------------------------
            "extra_data": **anything**,
            ------------------------------
        }
    */
    }
    const { app_name, model_name } = useParams();

    /* -------- extra sections -------- */
    const section_code = `${app_name}__${model_name}`;
    const BelowActions = extra_sections.object.delete.below_actions[section_code];
    const BelowForm = extra_sections.object.delete.below_form[section_code];

    let inner_deletion_jsx = null;

    // -------- cant view case
    if (deleted_objects) {
        // -------- perms_needed case
        if (perms_needed && perms_needed.length) {
            inner_deletion_jsx = (
                <>
                    <p>
                        <b>
                            Deleting '{object_repr}' would result in deleting related objects, but
                            your account doesn't have permission to delete the following types of
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
                            Deleting '{object_repr}' would require deleting the following protected
                            related objects:
                        </b>
                    </p>
                    <NestedObjectsList nested_objects={protected_} />
                </>
            );
        } else {
            inner_deletion_jsx = (
                <>
                    <p>
                        <b>
                            Are you sure you want to delete '{object_repr}'? All of the following
                            related items will be deleted:
                        </b>
                    </p>
                    <NestedObjectsList nested_objects={deleted_objects} />

                    <Row className="justify-content-end">
                        <Col xs="12" sm="8" lg="6" xxl="4" className="d-flex flex-column">
                            <h5>
                                <b>Summary:</b>
                            </h5>
                            <JsonToTable json={model_count} />
                        </Col>
                    </Row>

                    <Row className="justify-content-start mt-4">
                        <Col xs="12" sm="6" lg="4" xxl="2" className="d-flex flex-column">
                            <input type="submit" className="btn btn-danger px-3" value={"Delete"} />
                        </Col>
                    </Row>
                </>
            );
        }
    }

    return (
        <Container fluid className="p-4 fade-in">
            <RouterForm method="post" id="object-delete-form">
                <Row className="d-md-none object-actions">
                    <ObjectActions />
                </Row>

                <Row className={ADMIN_SITE_PREFERENCES.object_action_and_container_classes}>
                    {/* -------- DELETE -------- */}
                    <Col
                        xs="12"
                        sm="10"
                        lg="11"
                        className={ADMIN_SITE_PREFERENCES.object_container_classes}
                    >
                        {inner_deletion_jsx}
                    </Col>

                    {/* -------- ACTIONS -------- */}
                    <Col xs="12" sm="2" lg="1" className="d-none d-md-block object-actions">
                        {/* -------- OBJECT ACTIONS -------- */}
                        <ObjectActions />

                        {/* -------- extra: BELOW ACTIONS -------- */}
                        {BelowActions && <BelowActions extra_data={extra_data} />}
                    </Col>
                </Row>
            </RouterForm>

            {/* -------- extra: BELOW FORM -------- */}
            {BelowForm && <BelowForm extra_data={extra_data} />}
        </Container>
    );
}

export { ObjectConfirmDelete };
