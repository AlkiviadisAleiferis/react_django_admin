import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams } from "react-router-dom";

import ObjectActions from "./objectactions";
import { CONTENT_COLUMNS, ACTIONS_COLS } from "../../settings";

import { PreviewFieldset } from "./fieldsets";
import { PreviewTabularInline } from "./inlines";

import {
    get_below_actions_section,
    get_below_form_section,
} from "../extra_sections/object";

function build_preview_fieldsets_jsx(fieldsets, object) {
    return fieldsets.map(function (fieldset, index) {
        const tab_title = fieldset[0] ? fieldset[0] : "General";
        const fieldnames = fieldset[1]["fields"];

        return (
            <Tab
                eventKey={tab_title.toLowerCase().replace(" ", "_")}
                title={<b>{tab_title}</b>}
                key={"fieldset_" + index}
            >
                <PreviewFieldset fieldnames={fieldnames} object={object} />
            </Tab>
        );
    });
}

function build_preview_inline_tabs_jsx(inlines) {
    return inlines ? inlines.map(function (inline) {
            const tab_title = inline.label;
            const tab_name = tab_title.toLowerCase().replace(" ", "_");

            return (
                <Tab
                    eventKey={tab_name}
                    title={<b>{tab_title}</b>}
                    key={"fieldset_" + tab_name}
                >
                    <PreviewTabularInline inline={inline} />
                </Tab>
            );
        }) : null;
}

function PreviewObject({ object, fieldsets, permissions, inlines }) {
    /* 
        DATA STRUCTURE
        
        TODO: ---- > FIX

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
    /* -------- extra sections -------- */
    const { app_name, model_name } = useParams();
    const BelowActions = get_below_actions_section(app_name, model_name);
    const BelowForm = get_below_form_section(app_name, model_name);

    /* ---------------- no object ---------------- */
    if (object === null) return null;

    /* -------- object_content/actions columns -------- */
    const content_cols = { ...CONTENT_COLUMNS };
    const actions_cols = { ...ACTIONS_COLS };

    const fieldnames = Object.keys(object);

    if (!fieldsets) {
        fieldsets = ["General", { fields: fieldnames }];
    }

    /* ---------------- fieldsets_tabs_jsx ---------------- */
    const fieldsets_tabs_jsx = build_preview_fieldsets_jsx(fieldsets, object);

    /* ---------------- inline_tabs_jsx ---------------- */
    let inline_tabs_jsx = build_preview_inline_tabs_jsx(inlines);

    /* ---------------- actions ---------------- */
    let actions = { edit: false, delete: false };

    if (permissions) {
        actions["edit"] = permissions.change;
        actions["delete"] = permissions.delete;
    }

    return (
        <Container fluid className="p-1 fade-in">
            {/* -------- OBJECT ACTIONS MOBILE -------- */}
            <Row className="d-md-none object-actions">
                <ObjectActions actions={actions} />
                <BelowActions object={object} />
            </Row>

            <Row className="p-0 mx-0 w-100">
                {/* -------- FIELDSETS/INLINES TABS -------- */}
                <Col {...content_cols} className="" id="object_preview">
                    <Tabs
                        transition={true}
                        id="object_tabs"
                        className="mb-4 border-bottom"
                    >
                        {fieldsets_tabs_jsx}
                        {inline_tabs_jsx}
                    </Tabs>
                </Col>

                {/* -------- OBJECT ACTIONS -------- */}
                <Col
                    {...actions_cols}
                    className="d-none d-md-block object-actions"
                >
                    <ObjectActions actions={actions} />
                    <BelowActions object={object} />
                </Col>
            </Row>

            {/* -------- BELOW FORM -------- */}
            <BelowForm object={object} />
        </Container>
    );
}

export { PreviewObject };
