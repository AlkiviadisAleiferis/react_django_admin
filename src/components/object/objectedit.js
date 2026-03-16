import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Form as RouterForm, useActionData, useNavigation, useParams } from "react-router-dom";
import ObjectActions from "./objectactions";
import { EdititableObjectTabs } from "./tabs";
import { LoadingAnimation } from "../loading";
import { extra_sections } from "../extra_sections/mapping";
import { ADMIN_SITE_PREFERENCES } from "../../settings";

export function ObjectEdit({
    app,
    model,
    fieldsets,
    readonly_fields,
    fields,
    inlines,
    extra_data
}) {
    /* 
        {
            ------------------------------
            model: string
            ------------------------------
            app: string
            ------------------------------
            "fieldsets": [ 
                [ 
                    "fieldset_name", 
                    { "fields": [form_field_data], "classes": [string] }
                ] 
            ],
            ------------------------------
            "readonly_fields": [object_view_field_data]
            ------------------------------
            "fields" : {
                "fieldname": {
                    "type": "DateField",
                    "label": "Private agreement date",
                    "required": false,
                    "initial": null,
                    "help_text": ""
                }
            }
            ------------------------------
            "inlines": [
                {
                    "type": "tabular" OR "stacked",
                    "label": "Unfinished Books",
                    "model": "unifinishedbook",
                    "app": "library",
                    #
                    "permissions": {
                        "view": true,
                        "add": true,
                        "change": true,
                        "delete": true
                    },
                    #
                    "pk_name": "id",
                    "prefix": "inline_formset_prefix",
                    "management_form": {
                        "prefix": "inline_formset_prefix",
                        "readonly_fields": [],
                        "fields": {
                            "TOTAL_FORMS": field_data,
                            "INITIAL_FORMS": field_data,
                            "MIN_NUM_FORMS": field_data,
                            "MAX_NUM_FORMS": field_data,
                        }
                    "forms": [
                        {
                            "readonly_fields": readonly_fields_data,
                            "fields": fields_data,
                            "prefix": form.prefix,
                        },
                        ...
                    ],
                    "extra_form": form_data,
                    "min_forms_num": 1,
                    "max_forms_num": 30,
                }
            ],
            ------------------------------
            "extra_data": **anything**
            ------------------------------
        }
    */

    const navigate = useNavigation();
    const action_error_data = useActionData();
    const { app_name, model_name } = useParams();

    /* -------- extra sections -------- */
    const section_code = `${app_name}__${model_name}`;
    const BelowActions = extra_sections.object.edit.below_actions[section_code];
    const BelowForm = extra_sections.object.edit.below_form[section_code];

    return (
        <Container fluid className="p-4 fade-in">
            <RouterForm method="post" id="object_form" encType={"multipart/form-data"}>
                {/* -------- MOBILE ACTIONS -------- */}
                <Row className="d-md-none object-actions">
                    <ObjectActions actions={{ save: true }} />
                </Row>

                <Row className={ADMIN_SITE_PREFERENCES.object_action_and_container_classes}>
                    {/* -------- FIELDSETS / INLINES -------- */}
                    <Col
                        {...ADMIN_SITE_PREFERENCES.object_content_columns}
                        className={ADMIN_SITE_PREFERENCES.object_container_classes}
                        id="object_edit"
                    >
                        <EdititableObjectTabs
                            fieldsets={fieldsets}
                            app={app}
                            model={model}
                            fields={fields}
                            readonly_fields={readonly_fields}
                            inlines={inlines}
                            action_error_data={action_error_data}
                        />
                    </Col>

                    {/* -------- ACTIONS -------- */}
                    <Col
                        {...ADMIN_SITE_PREFERENCES.object_action_columns}
                        className="d-none d-md-flex flex-column object-actions"
                    >
                        {/* -------- OBJECT ACTIONS -------- */}
                        <ObjectActions actions={{ save: true }} />

                        {/* -------- extra: BELOW ACTIONS -------- */}
                        {BelowActions && <BelowActions fields={fields} extra_data={extra_data} />}

                        {/* -------- LOADING ANIMATION -------- */}
                        {navigate.state === "submitting" && (
                            <div className="p-0 mx-auto mt-3 fade-in">
                                <LoadingAnimation />
                            </div>
                        )}
                    </Col>
                </Row>
            </RouterForm>

            {/* -------- extra: BELOW FORM -------- */}
            {BelowForm && <BelowForm fields={fields} extra_data={extra_data} />}
        </Container>
    );
}
