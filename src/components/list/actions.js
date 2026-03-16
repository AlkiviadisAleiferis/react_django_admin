import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useNavigate, useParams } from "react-router-dom";
import { SITE_PATH } from "../../settings";

function ActionsChoicesSelection({ actions }) {
    let navigate = useNavigate();
    const params = useParams();

    /* 
    When the action is selected
    the selected_across and _selected_action
    inputs are gathered and appended to the URL
    */
    function perform_action_redirect() {
        const action_selection = document.getElementById("action_selection");
        const selected_action_name = action_selection.selectedOptions[0].value;

        const select_across = document.getElementById("select_across").value || 0;
        let selected_objects = [];

        // add all checked rows pks in select_objects_pks
        document.querySelectorAll(".action-select").forEach(chechbox => {
            if (chechbox.checked) {
                selected_objects.push(chechbox.getAttribute("object_pk"));
            }
        });

        if (selected_action_name === "" || !selected_objects.length) {
            window.alert("No action selected!");
            return;
        }

        const objects_pks_str = selected_objects.join(",");

        navigate(
            SITE_PATH.action_preview(
                params.app_name,
                params.model_name,
                selected_action_name,
                select_across,
                objects_pks_str
            )
        );
    }

    const actions_choices_jsx = actions
        ? actions.map((a, index) => (
              <option value={a[0]} key={a[0] + "_action_" + index}>
                  {a[1]}
              </option>
          ))
        : actions;

    return (
        <>
            <Form.Select name="action" id="action_selection" aria-label="actions">
                {actions_choices_jsx}
            </Form.Select>

            <button
                type="button"
                className="btn btn-outline-primary px-3 ms-2"
                onClick={perform_action_redirect}
            >
                Go
            </button>
        </>
    );
}

function ActionsSelectAcrossButton({ total_objects_num }) {
    return (
        <div className="form-check d-flex flex-row ms-1">
            <input
                type="hidden"
                className="btn-check"
                name="select_across"
                value="0"
                id="select_across"
                autoComplete="off"
            />
            <input
                type="checkbox"
                className="btn-check"
                id="select_across_checkbox"
                autoComplete="off"
            />
            <label
                className="btn text-nowrap px-1"
                htmlFor="select_across_checkbox"
                id="select_across_label"
                onClick={e => {
                    const select_across_checkbox =
                        document.getElementById("select_across_checkbox");
                    const select_across = document.getElementById("select_across");
                    const select_entire_list = document.getElementById("select_entire_list");

                    // will change the checked state immediately,
                    // since it was just clicked
                    if (!select_across_checkbox.checked) {
                        select_across.value = 1;
                        document
                            .querySelectorAll(".action-select")
                            .forEach(chechbox => (chechbox.checked = true));
                        select_entire_list.checked = true;

                        if (!e.target.classList.contains("bg-primary")) {
                            e.target.classList.add("bg-primary");
                        }
                        if (!e.target.classList.contains("text-white")) {
                            e.target.classList.add("text-white");
                        }
                        e.target.innerText = `Selected all ${total_objects_num}`;
                    } else {
                        select_across.value = 0;
                        document
                            .querySelectorAll(".action-select")
                            .forEach(chechbox => (chechbox.checked = false));
                        select_entire_list.checked = false;

                        if (e.target.classList.contains("bg-primary")) {
                            e.target.classList.remove("bg-primary");
                        }
                        if (e.target.classList.contains("text-white")) {
                            e.target.classList.remove("text-white");
                        }
                        e.target.innerText = `Select all ${total_objects_num}`;
                    }
                }}
            >
                Select all {total_objects_num}
            </label>
        </div>
    );
}

export function Actions({ actions, total_objects_num }) {
    return (
        <>
            <Row id="actions" className="px-5 flex-row">
                <Col
                    xs="12"
                    md="8"
                    lg="6"
                    xxl="4"
                    className="d-flex flex-row justify-content-start ps-0 ms-0 pt-4"
                >
                    <ActionsChoicesSelection actions={actions} />
                    <ActionsSelectAcrossButton total_objects_num={total_objects_num} />
                </Col>
            </Row>
        </>
    );
}

export function ActionSelectRow({ item }) {
    return (
        <td>
            <input
                type="checkbox"
                name="_selected_action"
                value={item.pk}
                object_pk={item.pk}
                className="action-select form-check-input"
            />
        </td>
    );
}

export function HeadersActionSelectAll(props) {
    return (
        <th>
            <input
                type="checkbox"
                id="select_entire_list"
                className="form-check-input"
                onClick={function (e) {
                    if (e.target.checked) {
                        document
                            .querySelectorAll(".action-select")
                            .forEach(chechbox => (chechbox.checked = true));
                    } else {
                        document
                            .querySelectorAll(".action-select")
                            .forEach(chechbox => (chechbox.checked = false));
                        const select_across_checkbox = document.getElementById("select_across");
                        const select_across_checkbox_label =
                            document.getElementById("select_across_label");
                        if (select_across_checkbox.checked) {
                            select_across_checkbox_label.click();
                        }
                    }
                }}
            />
        </th>
    );
}
