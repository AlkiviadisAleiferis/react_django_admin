import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { get_field_display_name, get_random_key_num } from "../../utils";
import { JsonToTable } from "react-json-to-table";

import { build_field_input } from "./fields";

// ---------------- Field ----------------

function HelpText({ text }) {
    return text ? (
        <OverlayTrigger
            key={"right"}
            placement={"right"}
            overlay={
                <Tooltip id={`tooltip-${get_random_key_num()}`}>
                    <span dangerouslySetInnerHTML={{ __html: text }} />
                </Tooltip>
            }
        >
            <Button variant="info" className="p-0 bg-transparent border-0 m-0">
                <i className="fa-solid fa-question text-danger"></i>
            </Button>
        </OverlayTrigger>
    ) : null;
}

function Field({
    app,
    model,
    fieldname,
    readonly_fields,
    fields,
    error_data,
    prefix,
}) {
    /* ---------------- field ---------------- */
    const field = fieldname in fields ? fields[fieldname] : {};

    /* ---------------- required_jsx ---------------- */
    const required_jsx = field.required ? (
        <i
            className="ms-2 my-auto text-danger fa-solid fa-asterisk"
            style={{ fontSize: "10px" }}
        ></i>
    ) : null;

    /* ---------------- label ---------------- */
    const label =
        "label" in field ? field.label : get_field_display_name(fieldname);

    /* ---------------- field_errors ---------------- */
    const field_errors =
        error_data && fieldname in error_data ? error_data[fieldname] : [];

    /* ---------------- field_errors_jsx ---------------- */
    const field_errors_jsx = field_errors.map(function (error, i) {
        // errors have different format in formsets (prefix)
        const error_message = prefix ? error : error.message;

        return (
            <p key={fieldname + "_errors_" + i} className="text-danger px-2">
                <b>{error_message}</b>
            </p>
        );
    });

    /* ---------------- is_hidden & extra_classes ---------------- */
    const is_hidden = ["hidden", "InlineForeignKeyField"].includes(field.type)
        ? true
        : false;
    const extra_classes = is_hidden ? " d-none" : "";

    /* ---------------- prefix ---------------- */
    prefix = prefix ? prefix : "";

    /* ---------------- jsx ---------------- */
    return (
        <Row key={"field_row_" + prefix + "_" + fieldname} className="my-2">
            {/*  -------- Field name section -------- */}
            <Col
                xs="12"
                lg="4"
                className={"d-flex flex-row align-items-start" + extra_classes}
            >
                <h6 className="me-3">
                    <b>{label}</b>
                    {required_jsx}
                </h6>
                <HelpText text={fieldname in fields ? field.help_text : ""} />
            </Col>

            {/* -------- Field input / value section -------- */}
            <Col
                xs="12"
                lg="8"
                className={"d-flex flex-row align-items-start" + extra_classes}
            >
                {build_field_input(app, model, field, fieldname, prefix)}
            </Col>

            {/* -------- Field errors -------- */}
            <Col xs="12" className="d-flex flex-column align-items-start">
                {field_errors_jsx}
            </Col>
        </Row>
    );
}

function FieldValue({ field }) {
    if (field === null) {
        return <p className="m-0 p-0">{"-"}</p>;
    }
    //
    // -------- related --------
    //
    if (field.type == "RelatedField" && field.pk != null) {
        if (field.permissions.view) {
            return (
                <Link
                    to={"/" + field.app + "/" + field.model + "/" + field.pk}
                    target="_blank"
                    className="m-o p-0 link-underline link-underline-opacity-0"
                >
                    <p className="m-0 p-0">{field.value}</p>
                </Link>
            );
        } else {
            return <p className="m-0 p-0">{field.value}</p>;
        }
        //
        // -------- many_to_many --------
        //
    } else if (field.type == "ManyRelatedField") {
        const values = field.value
            ? field.value.map((v) => ({ pk: v.pk, value: v.value }))
            : [];
        return <JsonToTable json={values} />;
        //
        // -------- calculated --------
        //
    } else if (field.type == "MethodField") {
        return (
            <span
                style={{ overflowX: "auto" }}
                dangerouslySetInnerHTML={{ __html: field.value }}
            />
        );
        //
        // -------- json --------
        //
    } else if (field.type === "ImageField") {
        if (!field.value) {
            return <span> - </span>;
        }

        const fileurl = field.value.startsWith("/")
            ? process.env.REACT_APP_FILE_SERVER_BASE_URL + field.value.slice(1)
            : process.env.REACT_APP_FILE_SERVER_BASE_URL + field.value;

        return (
            <Link to={fileurl} target="_blank" className=" p-2">
                <img
                    className="me-2"
                    src={fileurl}
                    style={{ height: "200px" }}
                />
            </Link>
        );
    } else if (field.type === "FileField") {
        if (!field.value) {
            return <span> - </span>;
        }

        const fileurl = field.value.startsWith("/")
            ? process.env.REACT_APP_FILE_SERVER_BASE_URL + field.value.slice(1)
            : process.env.REACT_APP_FILE_SERVER_BASE_URL + field.value;

        return (
            <Link to={fileurl} target="_blank" className=" p-2">
                <span className="me-2">Open file</span>
                <i
                    className="fa-solid fa-eye text-primary"
                    style={{ fontSize: "20px" }}
                ></i>
            </Link>
        );
        //
        // -------- json --------
        //
    } else if (field.type == "JSONField") {
        // TODO: Create util function traversing structure and changing
        //          field names to friendly words (e.g. replace("_", " "))
        return <JsonToTable json={field.value} />;
        //
        // -------- array --------
        //
    } else if (field.type == "ArrayField") {
        return <JsonToTable json={field.value} />;
        //
        // -------- other --------
        //
    } else if (["ImageField", "FileField"].includes(field.type)) {
        return <span>TODO!</span>;
        //
        // -------- other --------
        //
    } else if (field.type == "BooleanField") {
        if (field.value) {
            return (
                <i
                    className="fa-solid fa-circle-check text-success"
                    style={{ fontSize: "20px" }}
                ></i>
            );
        } else if (field.value === null || field.value === undefined) {
            return <span> - </span>;
        }
        return (
            <i
                className="fa-solid fa-circle-xmark text-danger"
                style={{ fontSize: "20px" }}
            ></i>
        );
        //
        // -------- json --------
        //
    } else {
        return (
            <p
                style={{ maxWidth: "400px", overflowX: "auto" }}
                className="m-0 p-0"
            >
                {field.value}
            </p>
        );
    }
}

// ---------------- Fieldsets ----------------

function Fieldset({
    app,
    model,
    fieldnames,
    readonly_fields,
    fields,
    error_data,
    prefix,
}) {
    /* 
    ----------------------------------------------------------------------------
    -------- Fieldset logic:
        for every fieldname (not readonly) build the input in the fieldset
        a row with 2 cols sectors: 
            A. name 
            B. value.

        for every readonly field also build a row with 2 cols:
            A. fieldname
            B. readonly value

        
        Fieldset should be agnostic of the parent component.

        app = .model._meta.app_label
        model = model._meta.model_name
        fieldsets = fieldsets (model admin)
        readonly_fields = readonly_fields (Objects(edit)/Array(add) with metadata/fieldnames)
        fields = fields (objects with metadata)

        readonly_field = {
            "type": FieldClass,
            "value": object field value,
            "help_text": model field `help_text`    
        } OR str
    ----------------------------------------------------------------------------
    */

    // -------- create all field rows

    const fields_rows_jsx = fieldnames.map(function (fieldname, index) {
        /* ---------------- ---------------- ----------------
            CONVENTION: in object -> add  `readonly_fields` is `Array`
            CONVENTION: in object -> edit `readonly_fields` is `Object`
           ---------------- ---------------- ---------------- */

        const is_add = Array.isArray(readonly_fields);

        const readonly_fields_names = is_add
            ? readonly_fields
            : Object.keys(readonly_fields);

        const readonly = readonly_fields_names.includes(fieldname);

        if (readonly) {
            /* ---------------- READONLY CASE ---------------- */

            // add case (`readonly_fields` is `Array`)
            const help_text =
                !is_add && fieldname in readonly_fields
                    ? readonly_fields[fieldname].help_text
                    : "";

            const label =
                !is_add && "label" in readonly_fields[fieldname]
                    ? readonly_fields[fieldname].label
                    : get_field_display_name(fieldname);

            return (
                <Row key={"field_" + fieldname} className="my-2">
                    {/*  Field name  */}
                    <Col
                        xs="12"
                        lg="4"
                        className="d-flex flex-row align-items-start"
                    >
                        <h6 className="me-3">
                            <b>{label}</b>
                        </h6>
                        <HelpText text={help_text} />
                    </Col>

                    {/*  Field input / value  */}
                    <Col
                        xs="12"
                        lg="8"
                        className="d-flex flex-column align-items-start"
                    >
                        {is_add ? (
                            <span>-</span>
                        ) : (
                            <FieldValue field={readonly_fields[fieldname]} />
                        )}
                    </Col>
                </Row>
            );
        } else {
            /* ----------------EDITABLE IELD ---------------- */
            return (
                <Field
                    key={"fieldset_field_" + fieldname + "_" + index}
                    app={app}
                    model={model}
                    fieldname={fieldname}
                    readonly_fields={readonly_fields}
                    fields={fields}
                    error_data={error_data}
                    prefix={prefix}
                />
            );
        }
    });

    return fields_rows_jsx;
}

function PreviewFieldset({ object, fieldnames }) {
    const rows_jsx = fieldnames.map(function (fieldname, index) {
        return (
            <tr key={"fieldset_row_" + fieldname + index}>
                <td className="d-flex flex-row align-items-center">
                    <h6 className="me-3">
                        <b>{get_field_display_name(fieldname)}</b>
                    </h6>
                    <HelpText text={object[fieldname]["help_text"]} />
                </td>

                <td className="text-wrap">
                    <FieldValue field={object[fieldname]} />
                </td>
            </tr>
        );
    });

    return (
        <Row className="mb-4">
            <Col xs="12" lg="8" xxl="6" className="d-flex flex-column">
                <Table responsive hover borderless>
                    <tbody>{rows_jsx}</tbody>
                </Table>
            </Col>
        </Row>
    );
}

// ---------------- Auxiliary funcs ----------------

/**
 * takes certain data structures
 * and returns the jsx of the fieldsets' tabs
 * 
 * @param {fieldsets} django admin fieldsets structure
 * @param {app} str: the model's app
 * @param {model} str: the model's name
 * @param {fields} object with fields' data
 * @param {readonly_fields} object with readonly fields
 * @param {error_data} Error data due to action { "fieldname": [{"message": "...", "code": "..."}] }
 * 
 * @return jsx of fieldsets tabs
*/
export function build_fieldsets_tabs(
    fieldsets,
    app,
    model,
    fields,
    readonly_fields,
    error_data
) {
    const fields_with_errors = error_data ? Object.keys(error_data) : [];

    return fieldsets
        ? fieldsets.map(function (fieldset, index) {
              const tab_title = fieldset[0] ? fieldset[0] : "General";
              const fieldnames = fieldset[1]["fields"];
              let fieldset_title_classes = "";

              const fieldset_fields_with_errors = fieldnames.filter((fieldname) =>
                  fields_with_errors.includes(fieldname)
              );
              if (fieldset_fields_with_errors.length > 0) {
                  fieldset_title_classes = "text-danger";
              }

              return (
                  <Tab
                      eventKey={tab_title.toLowerCase().replace(" ", "_")}
                      title={
                          <b className={fieldset_title_classes}>{tab_title}</b>
                      }
                      key={`${app}_${model}_fieldset_${index}`}
                  >
                      <Row className="my-2">
                          <Col
                              xs="12"
                              lg="8"
                              xxl="8"
                              className="d-flex flex-column"
                          >
                              <Fieldset
                                  app={app}
                                  model={model}
                                  fieldnames={fieldnames}
                                  fields={fields}
                                  readonly_fields={readonly_fields}
                                  error_data={error_data}
                              />
                          </Col>
                      </Row>
                  </Tab>
              );
          })
        : fieldsets;
}

export { PreviewFieldset, HelpText, FieldValue, Fieldset };
