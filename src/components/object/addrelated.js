import Container from "react-bootstrap/Container";
import Tabs from "react-bootstrap/Tabs";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Messages from "../base/messages";
import { authAxios } from "../../api/base";
import {
    appendMessages,
    appendSuccessMessage,
    appendErrorMessage,
} from "../../api/cache";
import { MESSAGE_TYPE, API_BASE_URL } from "../../settings";
import { useState, useEffect } from "react";
import { objectAddLoader } from "../../api/objectadd";
import { build_fieldsets_tabs } from "./fieldsets";
import {
    get_related_input_id,
    set_view_action,
} from "./fields";
import { build_inline_tabs } from "./inlines";

import { autocomplete_options_selector } from "../cache";

function get_add_related_modal_form_id(field_id) {
    return field_id + "_related_add_form";
}

function get_add_related_action(
    app,
    model,
    field,
    fieldname,
    prefix,
    set_error_data,
    set_created
) {
    async function add_related_action() {
        const object_add_url =
            API_BASE_URL +
            field.app +
            "/" +
            field.model +
            "/";

        const field_id = get_related_input_id(fieldname, app, model, prefix);
        // form corresponding to related inputs modal
        const modal_form_id = get_add_related_modal_form_id(field_id);
        const form = document.getElementById(modal_form_id);
        const form_data = new FormData(form);

        /* ------------------------------------------------------------ */
        /* 
            SUCCESS CASE 
        */
        try {
            const r = await authAxios.post(object_add_url, form_data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const response_data = r.data;

            if (response_data.message) {
                appendSuccessMessage(response_data.message);
            } else if (r.status == 201) {
                appendSuccessMessage("Successfully CREATED related object.");
            }

            set_created(response_data.object);
        /* ------------------------------------------------------------ */
        /* 
            ERROR CASE 
        */
        } catch (error) {
            const response_status = error.response.status;
            const response_data = error.response.data
                ? error.response.data
                : {};
            if (response_status == 400 && response_data.error_data) {
                // 400 status - form errors
                // turn non form errors to messages
                if ("__all__" in response_data.error_data) {
                    let non_field_messages = [];
                    for (let m of response_data.error_data["__all__"]) {
                        non_field_messages.push({
                            type: MESSAGE_TYPE.error,
                            text: m["message"],
                        });
                    }
                    appendMessages(non_field_messages);
                }
                set_error_data({
                    error_data: response_data.error_data,
                    inlines_error_data: response_data.inlines_error_data,
                });
            }
        }
    }

    return add_related_action;
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
                label: created.str,
            });
        } else {
            // populate select with new value
            const related_select = document.getElementById(field_id);
            const new_option = new Option(created.str, created.pk, true, true);
            related_select.add(new_option);
        }

        set_view_action(field, field_id, created.pk);

        set_created(null);
        handle_close();
    }

    return related_modal_return;
}

// ---------------- add related object ----------------
// add related object modal
// for convient adding of related objects

export function AddRelatedModal({ app, model, field, fieldname, prefix }) {
    /* ---- `app`, `model` are parent's app name / model name ---- */

    const [show, set_show] = useState(false);
    const [add_data, set_add_data] = useState({});
    const [error_data, set_error_data] = useState(null);
    const [created, set_created] = useState(null);
    const handle_close = () => set_show(false);
    const handle_show = () => set_show(true);

    const field_id = get_related_input_id(fieldname, app, model, prefix);
    const modal_form_id = get_add_related_modal_form_id(field_id);

    /* ---- fetch the add data used to build form / inlines ---- */
    useEffect(() => {
        const params = { model_name: field.model, app_name: field.app };

        (async function () {
            try {
                const add_data = await objectAddLoader({
                    params: params,
                });
                set_add_data(add_data);
            } catch (error) {
                appendErrorMessage("An Error occured.");
                set_add_data(null);
            }
        })();
    }, []);

    /* ---- submit / return btns ---- */
    const submit_button = !created ? (
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
    ) : (
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

    /* -------- error_data -------- */
    const form_error_data = error_data ? error_data.error_data : null;

    /* -------- fieldsets_tabs_jsx -------- */
    const fieldsets_tabs_jsx = build_fieldsets_tabs(
        add_data.fieldsets,
        add_data.app,
        add_data.model,
        add_data.fields,
        add_data.readonly_fields,
        form_error_data
    );

    /* -------- inlines_tabs_jsx -------- */
    const inlines = add_data && add_data.inlines ? add_data.inlines : [];
    const inlines_error_data = error_data
        ? error_data.inlines_error_data
        : null;

    let inlines_tabs_jsx = build_inline_tabs(inlines, inlines_error_data);

    return (
        <>
            {/* ---------------- ADD RELATED BTN ---------------- */}
            <Button
                variant="primary"
                onClick={handle_show}
                className="ms-3 bg-transparent border-0 p-0"
            >
                <i
                    className="fa-solid fa-square-plus text-primary"
                    style={{ fontSize: "20px" }}
                    id={fieldname + "_action_add_icon"}
                ></i>
            </Button>
            {/* ---------------- ADD RELATED MODAL ---------------- */}
            <Modal
                show={show}
                fullscreen
                backdrop="static"
                onHide={() => set_show(false)}
                className="w-100 h-100 p-0 m-0"
            >
                {/* ---------------- MODAL HEADER ---------------- */}
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h3>
                            <b>
                                Add
                                {" " +
                                    field.model.charAt(0).toUpperCase() +
                                    field.model.slice(1)}
                            </b>
                        </h3>
                    </Modal.Title>
                </Modal.Header>
                {/* ---------------- MODAL BODY ---------------- */}
                <Modal.Body>
                    <Messages />
                    <Container fluid className="fade-in">
                        <Row className="p-0 mx-0 w-100">
                            <Col
                                xs="12"
                                sm="10"
                                lg="11"
                                id="related-object-add"
                            >
                                <form id={modal_form_id}>
                                    <Tabs
                                        transition={true}
                                        id="object_tabs_related_modal"
                                        className="mb-4 border-bottom"
                                    >
                                        {fieldsets_tabs_jsx}
                                        {inlines_tabs_jsx}
                                    </Tabs>
                                </form>
                            </Col>
                        </Row>
                        <Row className="p-0 mx-0 w-100 justify-content-start">
                            <Col xs="12" lg="4" xxl="1">
                                {submit_button}
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
}
