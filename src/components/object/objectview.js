import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams } from "react-router-dom";

import { ReadonlyObjectTabs } from "./tabs";
import { extra_sections } from "../extra_sections/mapping";
import ObjectActions from "./objectactions";
import { ADMIN_SITE_PREFERENCES } from "../../settings";

function ObjectView({ object, fieldsets, permissions, inlines, extra_data }) {
    /* 
        {
            "object": {
                "fieldname" : {
                    "type": "DateField",
                    "value": null,
                    "help_text": ""
                }
            }
            ------------------------------
            "fieldsets": [ 
                [ 
                    "fieldset_name", 
                    { 
                        "fields": [str, ...], 
                        "classes": [str, ...] 
                    }
                ] 
            ],
            ------------------------------
            "permissions": 
                {
                    "view": boolean,
                    "change": boolean,
                    "delete": boolean,
                    "history": boolean,
                }
            ------------------------------
            "inlines": [
                {
                    "type": "tabular" OR "stacked"
                    "label": str,
                    "model": str,
                    "app": str,
                    "objects": [object, ...]
                    "all_fieldnames": [str, ...]
                }
            ],
            ------------------------------
        }
    */
    const { app_name, model_name } = useParams();

    /* -------- extra sections -------- */
    const section_code = `${app_name}__${model_name}`;
    const BelowActions = extra_sections.object.view.below_actions[section_code];
    const BelowForm = extra_sections.object.view.below_form[section_code];

    /* ---------------- no object case ---------------- */
    if (!object) return null;

    if (!fieldsets) {
        fieldsets = ["General", { fields: Object.keys(object) }];
    }

    return (
        <Container fluid className="p-4 fade-in">
            {/* -------- OBJECT ACTIONS MOBILE -------- */}
            <Row className="d-md-none object-actions">
                <ObjectActions actions={permissions} />
            </Row>

            <Row className={ADMIN_SITE_PREFERENCES.object_action_and_container_classes}>
                {/* -------- FIELDSETS/INLINES TABS -------- */}
                <Col
                    {...ADMIN_SITE_PREFERENCES.object_content_columns}
                    className={ADMIN_SITE_PREFERENCES.object_container_classes}
                    id="object_view"
                >
                    <ReadonlyObjectTabs fieldsets={fieldsets} object={object} inlines={inlines} />
                </Col>

                {/* -------- ACTIONS -------- */}
                <Col
                    {...ADMIN_SITE_PREFERENCES.object_action_columns}
                    className="d-none d-md-block object-actions"
                >
                    {/* -------- OBJECT ACTIONS -------- */}
                    <ObjectActions actions={permissions} />
                    {/* -------- extra: BELOW ACTIONS -------- */}
                    {BelowActions && <BelowActions object={object} extra_data={extra_data} />}
                </Col>
            </Row>

            {/* -------- extra: BELOW FORM -------- */}
            {BelowForm && <BelowForm object={object} extra_data={extra_data} />}
        </Container>
    );
}

export { ObjectView };
