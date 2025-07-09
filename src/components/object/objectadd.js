import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import {
    Form as RouterForm,
    useActionData,
    useNavigation,
} from "react-router-dom";
import ObjectActions from "./objectactions";
import { LoadingAnimation } from "../helpers/loading"
import { build_fieldsets_tabs } from "./fieldsets";
import { build_inline_tabs } from "./inlines";
import { CONTENT_COLUMNS, ACTIONS_COLS } from "../../settings";

export function ObjectAdd({
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
            "readonly_fields": [string]
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

    const navigate = useNavigation();
    const action_error = useActionData();

    const error_data = action_error ? action_error.error_data : null;
    const inlines_error_data = action_error
        ? action_error.inlines_error_data
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
    const content_cols = {...CONTENT_COLUMNS};
    const actions_cols = {...ACTIONS_COLS};

    /* -------------------------------------- */

    return (
        <Container fluid className="p-1 fade-in">
            <RouterForm
                method="post"
                id="object_form"
                encType={"multipart/form-data"}
            >
                {/* -------- mobile view actions -------- */}
                <Row className="d-md-none object-actions">
                    {fieldsets && <ObjectActions actions={{ save: true }} />}
                </Row>

                <Row className="p-0 mx-0 w-100">
                    {/* --------fieldsets / inlines -------- */}
                    <Col {...content_cols} className="" id="object_add">
                        <Tabs
                            transition={true}
                            id="object_tabs"
                            className="border-bottom"
                        >
                            {fieldsets_tabs_jsx}
                            {inline_tabs_jsx}
                        </Tabs>
                    </Col>

                    {/* -------- actions -------- */}
                    <Col
                        {...actions_cols}
                        className="d-none d-md-flex flex-column object-actions"
                    >
                        {/* -------- loading animation OR actions -------- */}
                        {fieldsets && (
                            <ObjectActions actions={{ save: true }} />
                        )}
                        {navigate.state === "submitting" && (
                            <div className="p-0 mx-auto mt-3 fade-in">
                                <LoadingAnimation />
                            </div>
                        )}
                    </Col>
                </Row>
            </RouterForm>
        </Container>
    );
}
