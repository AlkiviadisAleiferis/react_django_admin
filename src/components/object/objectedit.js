import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {
    Form as RouterForm,
    useActionData,
    useNavigation,
    useParams,
} from "react-router-dom";
import ObjectActions from "./objectactions";
import { LoadingAnimation } from "../helpers/loading";
import { build_fieldsets_tabs } from "./fieldsets";
import { build_inline_tabs } from "./inlines";
import { CONTENT_COLUMNS, ACTIONS_COLS } from "../../settings";

import { get_below_actions_section, get_below_form_section } from "../extra_sections/object";

export function ObjectEdit({
    app,
    model,
    fieldsets,
    readonly_fields,
    fields,
    inlines,
}) {
    /* 
        DATA STRUCTURE

        {
            ------------------------------
            app: string
            ------------------------------
            model: string
            ------------------------------
            "fieldsets": [ 
                [ 
                    "fieldset_name", 
                    { "fields": [form_field_data], "classes": [string] }
                ] 
            ],
            ------------------------------
            "readonly_fields": [preview_field_data]
            ------------------------------
            "fields" : {
                "type": "DateField",
                "label": "Private agreement date",
                "required": false,
                "initial": null,
                "help_text": ""
            }
            ------------------------------
            "inlines": [
                {
                    "type": "tabular",
                    "pk_name": "id",
                    "label": "Unfinished Books",
                    "app": "library",
                    "model": "unifinishedbook",
                    "prefix": "inline_formset_prefix",
                    "min_forms_num": 1,
                    "max_forms_num": 30,
                    "management_form": {
                        "prefix": "inline_formset_prefix",
                        "readonly_fields": [],
                        "fields": ...,
                    "permissions": {
                        "view": true,
                        "add": true,
                        "change": true,
                        "dalete": true
                    },
                    "forms": [inline_form_data],
                    "extra_form": inline_form_data
                }
            ],
            ------------------------------
        }
    */

    /* -------- extra sections -------- */
    const { app_name, model_name } = useParams();
    const BelowActions = get_below_actions_section(app_name, model_name);
    const BelowForm = get_below_form_section(app_name, model_name);

    /* -------- -------- -------- -------- -------- */
    const navigate = useNavigation();
    const action_error_data = useActionData();

    const error_data = action_error_data ? action_error_data.error_data : null;
    const inlines_error_data = action_error_data
        ? action_error_data.inlines_error_data
        : null;

    const fieldsets_tabs_jsx = build_fieldsets_tabs(
        fieldsets,
        app,
        model,
        fields,
        readonly_fields,
        error_data
    );

    const inline_tabs_jsx = build_inline_tabs(inlines, inlines_error_data);

    /* -------- object_content/actions columns -------- */
    const content_cols = { ...CONTENT_COLUMNS };
    const actions_cols = { ...ACTIONS_COLS };

    return (
        <Container fluid className="p-1 fade-in">
            <RouterForm
                method="post"
                id="object_form"
                encType={"multipart/form-data"}
            >
                {/* -------- MOBILE ACTIONS -------- */}
                <Row className="d-md-none object-actions">
                    {fieldsets && <ObjectActions actions={{ save: true }} />}
                    <BelowActions fields={fields}/>
                </Row>

                <Row className="p-0 mx-0 w-100">
                    {/* --------FIELDSETS / INLINES -------- */}
                    <Col {...content_cols} className="" id="object_edit">
                        <Tabs
                            transition={true}
                            id="object_tabs"
                            className="mb-4 border-bottom"
                        >
                            {fieldsets_tabs_jsx}
                            {inline_tabs_jsx}
                        </Tabs>
                    </Col>

                    {/* -------- ACTIONS -------- */}
                    <Col
                        {...actions_cols}
                        className="d-none d-md-flex flex-column object-actions"
                    >
                        {/* -------- ACTIONS -------- */}
                        {fieldsets && (
                            <ObjectActions actions={{ save: true }} />
                        )}
                        {/* -------- BELOW ACTIONS -------- */}
                        <BelowActions fields={fields}/>
                        {/* -------- LOADING ANIMATION -------- */}
                        {navigate.state === "submitting" && (
                            <div className="p-0 mx-auto mt-3 fade-in">
                                <LoadingAnimation />
                            </div>
                        )}
                    </Col>
                </Row>
            </RouterForm>

            {/* -------- BELOW FORM -------- */}
            <BelowForm fields={fields}/>
        </Container>
    );
}
