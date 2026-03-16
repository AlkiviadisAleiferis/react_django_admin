import Container from "react-bootstrap/Container";
import Tabs from "react-bootstrap/Tabs";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { authAxios } from "../../api/base";
import { appendMessages, appendSuccessMessage, appendErrorMessage } from "../../state/messages";
import { MESSAGE_TYPE, API_BASE_URL, API_ENDPOINTS, ADMIN_SITE_PREFERENCES } from "../../settings";
import { useState, useEffect } from "react";
import { objectAddLoader } from "../../api/objectadd";
import { build_object_fieldsets_tabs } from "./fields/fieldsets";
import { get_related_input_id, set_related_field_actions } from "./fields/field_inputs";
import { build_inline_tabs } from "./inlines/utils";

import { autocomplete_options_selector } from "../cache";

function get_modal_form_id(field_id) {
    return field_id + "_related_add_form";
}

function get_add_related_action(app, model, field, fieldname, prefix, set_error_data, set_created) {
    async function addRelatedAction() {
        /* 
        What this function does is
        it replicates the Add Object Action
        when submiting with save
        */
        const object_add_api_url =
            API_BASE_URL + API_ENDPOINTS.admin_list_create(field.app, field.model);

        const field_id = get_related_input_id(fieldname, app, model, prefix);

        // form corresponding to related inputs modal
        const modal_form_id = get_modal_form_id(field_id);
        const form = document.getElementById(modal_form_id);
        const form_data = new FormData(form);

        try {
            const r = await authAxios.post(object_add_api_url, form_data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            const response_data = r.data;

            if (response_data.messages) {
                for (let msg of response_data.messages) {
                    appendSuccessMessage(msg);
                }
            } else if (r.status == 201) {
                appendSuccessMessage("Successfully CREATED related object.");
            }

            set_created(response_data.object);
        } catch (error) {
            const response_status = error.response ? error.response.status : null;
            const response_data = response_status && error.response.data ? error.response.data : {};

            if (response_status == 400 && response_data.error_data) {
                /* 
                400 status - form errors
                turn non form errors to messages
                */
                if ("__all__" in response_data.error_data) {
                    let non_field_messages = [];
                    for (let m of response_data.error_data["__all__"]) {
                        non_field_messages.push({
                            type: MESSAGE_TYPE.error,
                            text: m["message"]
                        });
                    }
                    appendMessages(non_field_messages);
                }
                set_error_data({
                    error_data: response_data.error_data,
                    inlines_error_data: response_data.inlines_error_data
                });
            } else {
                appendErrorMessage("An error occurred.");
            }
        }
    }

    return addRelatedAction;
}

function get_related_modal_return(
    app,
    model,
    field,
    fieldname,
    prefix,
    set_created,
    created,
    handle_close
) {
    function related_modal_return() {
        const field_id = get_related_input_id(fieldname, app, model, prefix);

        if (field.autocomplete) {
            // populate autocomplete with new value
            autocomplete_options_selector[field_id]({
                value: created.pk,
                label: created.str
            });
        } else {
            // populate select with new value
            const related_select = document.getElementById(field_id);
            const new_option = new Option(created.str, created.pk, true, true);
            related_select.add(new_option);
        }

        set_related_field_actions(field, field_id, created.pk);
        set_created(null);
        handle_close();
    }

    return related_modal_return;
}

function ActionButton({
    created,
    app,
    model,
    field,
    fieldname,
    prefix,
    set_error_data,
    set_created,
    handle_close
}) {
    if (!created) {
        return (
            <Button
                variant="primary"
                className="w-100"
                onClick={get_add_related_action(
                    app,
                    model,
                    field,
                    fieldname,
                    prefix,
                    set_error_data,
                    set_created
                )}
            >
                Save
            </Button>
        );
    } else {
        return (
            <Button
                variant="success"
                className="w-100"
                onClick={get_related_modal_return(
                    app,
                    model,
                    field,
                    fieldname,
                    prefix,
                    set_created,
                    created,
                    handle_close
                )}
            >
                Return
            </Button>
        );
    }
}
// ---------------- add related object ----------------
// add related object modal
// for convient adding of related objects

export function AddRelatedModal({ app, model, field, fieldname, prefix }) {
    /*
    WARNING:
        `app`, `model` are parent's
        app name / model name
    */

    const [show, set_show] = useState(false);
    const [add_data, set_add_data] = useState({});
    const [error_data, set_error_data] = useState(null);
    const [created, set_created] = useState(null);

    const handle_close = () => set_show(false);
    const handle_show = () => set_show(true);

    /*
    this is the id 
    of the parent object field
    */
    const field_id = get_related_input_id(fieldname, app, model, prefix);

    const modal_form_id = get_modal_form_id(field_id);

    /*
    fetch the add data 
    used to build form / inlines 
    */
    useEffect(() => {
        const params = { model_name: field.model, app_name: field.app };

        (async function () {
            try {
                const add_data = await objectAddLoader({
                    params: params
                });
                set_add_data(add_data);
            } catch (error) {
                appendErrorMessage("An Error occured.");
                set_add_data(null);
            }
        })();
    }, []);

    /* -------- data -------- */
    const data = add_data || {};
    const form_error_data = error_data ? error_data.error_data : null;

    /* -------- fieldsets_tabs_jsx -------- */
    const fieldsets_tabs_jsx = build_object_fieldsets_tabs(
        data.fieldsets,
        data.app,
        data.model,
        data.fields,
        data.readonly_fields,
        form_error_data
    );

    /* -------- inlines_tabs_jsx -------- */
    const inlines = add_data && add_data.inlines ? add_data.inlines : [];
    const inlines_error_data = error_data ? error_data.inlines_error_data : null;
    const inlines_tabs_jsx = build_inline_tabs(inlines, inlines_error_data);

    return (
        <>
            {/* ---------------- ADD RELATED BTN ---------------- */}
            <Button
                variant="primary"
                onClick={handle_show}
                className="ms-3 bg-transparent border-0 p-0"
            >
                {ADMIN_SITE_PREFERENCES.object_add_link_icon(modal_form_id + "_action_add_icon")}
            </Button>
            {/* ---------------- MODAL ---------------- */}
            <Modal show={show} fullscreen backdrop="static" onHide={() => set_show(false)}>
                {/* ---------------- MODAL HEADER ---------------- */}
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h3>
                            <b>
                                Add
                                {" " + field.model.charAt(0).toUpperCase() + field.model.slice(1)}
                            </b>
                        </h3>
                    </Modal.Title>
                </Modal.Header>

                {/* ---------------- MODAL BODY ---------------- */}
                <Modal.Body>
                    {/* ---------------- FORM ---------------- */}
                    <Container fluid className="fade-in">
                        <Row className="p-0 mx-0 w-100">
                            <Col xs="12" sm="10" lg="11" id="related-object-add">
                                {created && (
                                    <h5 claaName="text-success">
                                        <b>'{created.str}' successfuly created!</b>
                                    </h5>
                                )}
                                <form id={modal_form_id}>
                                    <Tabs
                                        transition={true}
                                        id="object_tabs_related_modal"
                                        className="mb-4 border-bottom"
                                    >
                                        {!created && fieldsets_tabs_jsx}
                                        {!created && inlines_tabs_jsx}
                                    </Tabs>
                                </form>
                            </Col>
                        </Row>
                        <Row className="p-0 mx-0 w-100 justify-content-start">
                            <Col xs="12" lg="4" xxl="1">
                                <ActionButton
                                    app={app}
                                    model={model}
                                    field={field}
                                    fieldname={fieldname}
                                    prefix={prefix}
                                    created={created}
                                    set_error_data={set_error_data}
                                    set_created={set_created}
                                    handle_close={handle_close}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
}
