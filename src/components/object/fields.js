import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { authAxios } from "../../api/base";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import { sleep } from "../../utils";
import { API_ENDPOINTS, API_BASE_URL } from "../../settings";

import {
    autocomplete_inputs_value,
    autocomplete_options_selector,
} from "../cache";

import { AddRelatedModal } from "./addrelated";

/* ------------ inputs names/ids ----------- */

export function get_input_name(fieldname, prefix) {
    const field_name = prefix ? `${prefix}-${fieldname}` : `${fieldname}`;
    return field_name;
}

export function get_input_id(fieldname, prefix) {
    const field_id = prefix ? `${prefix}-${fieldname}_id` : `${fieldname}_id`;
    return field_id;
}

export function get_related_input_id(fieldname, app, model, prefix) {
    let extra = "";
    if (app && model) {
        extra = `${app}_${model}_`;
    }

    const field_id = prefix
        ? `${prefix}-${extra}${fieldname}_id`
        : `${extra}${fieldname}_id`;

    return field_id;
}

/* ------------ view actions ----------- */

export function set_view_action(field, field_id, value) {
    let view_action = document.getElementById(`${field_id}_action_view`);
    let view_action_icon = document.getElementById(
        `${field_id}_action_view_icon`
    );

    let val = "";

    if (value !== null && typeof value === "object") {
        val = value.value ? value.value : "";
    } else {
        val = value;
    }

    if (val) {
        // hidden input above autocomplete
        if (view_action) {
            view_action.setAttribute(
                "href",
                `/${field.app}/${field.model}/${val}/`
            );
        }
        if (
            view_action_icon &&
            view_action_icon.classList.contains("text-secondary")
        ) {
            view_action_icon.classList.remove("text-secondary");
        }
        if (
            view_action_icon &&
            !view_action_icon.classList.contains("text-primary")
        ) {
            view_action_icon.classList.add("text-primary");
        }
    } else {
        if (view_action) {
            view_action.setAttribute("href", "javascript:void(0)");
        }
        if (
            view_action_icon &&
            view_action_icon.classList.contains("text-primary")
        ) {
            view_action_icon.classList.remove("text-primary");
        }
        if (
            view_action_icon &&
            !view_action_icon.classList.contains("text-secondary")
        ) {
            view_action_icon.classList.add("text-secondary");
        }
    }
}

function getAutocompleteLoader(app, model, fieldname, prefix) {
    const autocomplete_url =
        API_BASE_URL + API_ENDPOINTS.field_autocomplete(app,model,fieldname);

    async function autocompleteLoader(q) {
        const url = autocomplete_url + q;
        const field_id = get_related_input_id(fieldname, app, model, prefix);

        const input = String(q);
        await sleep(1000);
        const current_term = String(autocomplete_inputs_value[field_id]);

        if (input !== current_term) {
            return [{ value: "", label: "" }];
        }
        try {
            const r = await authAxios.get(url);
            return r.data;
        } catch (error) {
            return [];
        }
    }

    return autocompleteLoader;
}

function ModelChoiceField({ app, model, field, fieldname, prefix }) {
    // app, model is for parent field
    // field.app, field.model is for the related field

    const field_id = get_related_input_id(fieldname, app, model, prefix);
    const choices = field.choices ? field.choices : [];

    const choices_jsx = choices.map(function (choice, index) {
        let opts = {};
        if (
            field.initial &&
            String(choice.value) === String(field.initial.value)
        ) {
            opts["selected"] = true;
        }

        return (
            <option
                {...opts}
                value={choice.value}
                key={fieldname + "_option_" + index}
            >
                {choice.label}
            </option>
        );
    });

    return (
        <Form.Select
            name={get_input_name(fieldname, prefix)}
            id={field_id}
            onChange={function (e) {
                const value = e.target.value;
                set_view_action(field, field_id, value);
            }}
        >
            {choices_jsx}
        </Form.Select>
    );
}

function AutocompleteField({ app, model, field, fieldname, prefix }) {
    const field_id = get_related_input_id(fieldname, app, model, prefix);

    const [selectedOption, setSelectedOption] = useState(field.initial);
    const loader = getAutocompleteLoader(app, model, fieldname, prefix);
    const initial_value =
        field.initial && field.initial.value ? field.initial.value : null;

    let opts = {};
    if (initial_value) {
        opts["defaultValue"] = initial_value;
    }
    // initiate autocomplete value to simulate
    // delay to async loader request later
    autocomplete_inputs_value[field_id] = null;
    autocomplete_options_selector[field_id] = setSelectedOption;

    return (
        <>
            <input
                type="hidden"
                name={get_input_name(fieldname, prefix)}
                id={field_id}
                {...opts}
                value={selectedOption ? selectedOption.value : ""}
            />

            <AsyncSelect
                id={"autocomplete_" + field_id}
                className="autocomplete-search-filter w-100"
                loadOptions={loader}
                onInputChange={(input) =>
                    (autocomplete_inputs_value[field_id] = String(input))
                }
                onChange={function (value) {
                    setSelectedOption(value);
                    document.getElementById(field_id).value =
                        value && value.value ? value.value : "";
                    set_view_action(field, field_id, value);
                }}
                isClearable
                value={selectedOption}
            />
        </>
    );
}

export function build_field_input(app, model, field, fieldname, prefix) {
    // uses `form_field_data`
    
    let opts = {};

    if (field.required && !prefix) {
        opts["required"] = true;
    }

    if (field.type == "hidden") {
        return (
            <Form.Control
                {...opts}
                defaultValue={field.initial}
                type="text"
                id={get_input_id(fieldname, prefix)}
                name={get_input_name(fieldname, prefix)}
            />
        );
    } else if (field.type == "TimeField") {
        return (
            <Form.Control
                {...opts}
                defaultValue={field.initial}
                type="time"
                id={get_input_id(fieldname, prefix)}
                name={get_input_name(fieldname, prefix)}
            />
        );
    } else if (field.type == "DateField") {
        return (
            <Form.Control
                {...opts}
                defaultValue={field.initial}
                type="date"
                id={get_input_id(fieldname, prefix)}
                name={get_input_name(fieldname, prefix)}
            />
        );
    } else if (field.type == "DateTimeField") {
        return (
            <Form.Control
                {...opts}
                defaultValue={field.initial}
                type="datetime"
                id={get_input_id(fieldname, prefix)}
                name={get_input_name(fieldname, prefix)}
            />
        );
    } else if (["CharField", "SlugField"].includes(field.type)) {
        return (
            <Form.Control
                {...opts}
                defaultValue={field.initial}
                type="text"
                id={get_input_id(fieldname, prefix)}
                name={get_input_name(fieldname, prefix)}
            />
        );
    } else if (field.type == "TextField") {
        return (
            <Form.Control
                {...opts}
                defaultValue={field.initial}
                as="textarea"
                id={get_input_id(fieldname, prefix)}
                name={get_input_name(fieldname, prefix)}
                rows={field.rows}
                cols={field.cols}
            />
        );
    } else if (field.type == "JSONFormField") {
        return (
            <Form.Control
                {...opts}
                defaultValue={field.initial}
                as="textarea"
                id={get_input_id(fieldname, prefix)}
                name={get_input_name(fieldname, prefix)}
                rows={field.rows}
                cols={field.cols}
            />
        );
    } else if (["ImageField", "FileField"].includes(field.type)) {
        let file_link_jsx = null;

        if (field.initial) {
            const fileurl = field.initial.startsWith("/")
                ? process.env.REACT_APP_FILE_SERVER_BASE_URL + field.initial.slice(1)
                : process.env.REACT_APP_FILE_SERVER_BASE_URL + field.initial;

            file_link_jsx = (
                <Link to={fileurl} target="_blank" className=" p-2">
                    <span className="me-2">Open file</span>
                    <i
                        className="fa-solid fa-eye text-primary"
                        style={{ fontSize: "20px" }}
                    ></i>
                </Link>
            );
        }

        return (
            <>
                <input
                    {...opts}
                    id={get_input_id(fieldname, prefix)}
                    name={get_input_name(fieldname, prefix)}
                    type="file"
                />
                {file_link_jsx}
            </>
        );
    } else if (field.type == "URLField") {
        return (
            <Form.Control
                {...opts}
                type="url"
                defaultValue={field.initial}
                id={get_input_id(fieldname, prefix)}
                name={get_input_name(fieldname, prefix)}
            />
        );
    } else if (field.type == "EmailField") {
        return (
            <Form.Control
                {...opts}
                defaultValue={field.initial}
                type="email"
                id={get_input_id(fieldname, prefix)}
                name={get_input_name(fieldname, prefix)}
            />
        );
    } else if (field.type == "FloatField") {
        return (
            <Form.Control
                {...opts}
                defaultValue={field.initial}
                type="number"
                step="any"
                id={get_input_id(fieldname, prefix)}
                name={get_input_name(fieldname, prefix)}
            />
        );
    } else if (field.type == "ModelChoiceField") {
        const field_id = get_related_input_id(fieldname, app, model, prefix);

        let side_action_view = null;
        let side_action_add = null;

        // view side action

        if (field.permissions.view || field.permissions.change) {
            if (field.initial) {
                side_action_view = (
                    <Link
                        to={`/${field.app}/${field.model}/${field.initial.value}/`}
                        className="ms-3"
                        id={`${field_id}_action_view`}
                        target="_blank"
                    >
                        <i
                            className="fa-solid fa-eye text-primary"
                            style={{ fontSize: "20px" }}
                            id={`${field_id}_action_view_icon`}
                        ></i>
                    </Link>
                );
            } else {
                side_action_view = (
                    <Link
                        to="javascript:void(0)"
                        className="ms-3"
                        id={`${field_id}_action_view`}
                        target="_blank"
                    >
                        <i
                            className="fa-solid fa-eye text-secondary"
                            style={{ fontSize: "20px" }}
                            id={`${field_id}_action_view_icon`}
                        ></i>
                    </Link>
                );
            }
        }

        // add side action

        if (field.permissions.add) {
            side_action_add = (
                <AddRelatedModal
                    app={app}
                    model={model}
                    fieldname={fieldname}
                    field={field}
                    prefix={prefix}
                />
            );
        }

        let related_field = null;

        if (field.autocomplete) {
            related_field = (
                <AutocompleteField
                    {...opts}
                    app={app}
                    model={model}
                    field={field}
                    fieldname={fieldname}
                    prefix={prefix}
                    className="w-75"
                />
            );
        } else {
            related_field = (
                <ModelChoiceField
                    {...opts}
                    app={app}
                    model={model}
                    field={field}
                    fieldname={fieldname}
                    prefix={prefix}
                    className="w-75"
                />
            );
        }

        return (
            <>
                <div className="d-flex flex-row align-items-center w-100">
                    <div className="d-flex flex-row align-items-center w-75">
                        {related_field}
                    </div>
                    <div className="d-flex flex-row align-items-center w-25">
                        {side_action_view}
                        {side_action_add}
                    </div>
                </div>
            </>
        );
    } else if (field.type == "ModelMultipleChoiceField") {
        const initial = field.initial ? field.initial : [];
        const choices = field.choices ? field.choices : [];

        const choices_rows = choices
            ? choices.map(function (choice, index) {
                  return (
                      <tr key={fieldname + "_choice_" + index}>
                          <td>{choice.label}</td>
                          <td>
                              <Form.Check
                                  id={fieldname + "_chechbox_" + choice.value}
                                  type="checkbox"
                                  onClick={function (e) {
                                      const option = document.getElementById(
                                          fieldname + "_option_" + choice.value
                                      );
                                      if (e.target.checked) {
                                          option.selected = true;
                                      } else {
                                          option.selected = false;
                                      }
                                  }}
                                  defaultChecked={field.initial.includes(choice.value)}
                              />
                          </td>
                      </tr>
                  );
              })
            : null;

        const option_rows = choices
            ? choices.map(function (choice, index) {
                  const chosen = initial.includes(choice.value);
                  if (chosen) {
                      return (
                          <option
                              key={fieldname + "_option_" + index}
                              id={fieldname + "_option_" + choice.value}
                              value={choice.value}
                              selected
                          />
                      );
                  } else {
                      return (
                          <option
                              key={fieldname + "_option_" + index}
                              id={fieldname + "_option_" + choice.value}
                              value={choice.value}
                          />
                      );
                  }
              })
            : null;

        return (
            <>
                <Form.Select
                    className="d-none"
                    name={fieldname}
                    id={fieldname + "_id"}
                    multiple
                >
                    {option_rows}
                </Form.Select>
                <div style={{ height: "700px", overflow: "auto" }}>
                    <Table bordered style={{ overflowY: "auto" }}>
                        <tbody>{choices_rows}</tbody>
                    </Table>
                </div>
            </>
        );
    } else if (field.type == "DecimalField") {
        return (
            <Form.Control
                {...opts}
                defaultValue={field.initial}
                type="number"
                id={get_input_id(fieldname, prefix)}
                name={get_input_name(fieldname, prefix)}
            />
        );
    } else if (field.type == "IntegerField") {
        return (
            <Form.Control
                {...opts}
                defaultValue={field.initial}
                type="number"
                step="1"
                id={get_input_id(fieldname, prefix)}
                name={get_input_name(fieldname, prefix)}
            />
        );
    } else if (field.type == "BooleanField") {
        return (
            <Form.Check // prettier-ignore
                {...opts}
                defaultChecked={field.initial ? field.initial : false}
                type="switch"
                style={{ width: "4em !important",height: "4em !important" }}
                id={get_input_id(fieldname, prefix)}
                name={get_input_name(fieldname, prefix)}
            />
        );
    } else if (field.type == "NullBooleanField") {
        return (
            <Form.Check // prettier-ignore
                {...opts}
                defaultChecked={field.initial}
                type="switch"
                style={{ width: "4em !imrpotant" }}
                id={get_input_id(fieldname, prefix)}
                name={get_input_name(fieldname, prefix)}
            />
        );
    } else if (["ChoiceField", "TypedChoiceField"].includes(field.type)) {
        const choices = field.choices.map(function (c, i) {
            const opts = {};
            if (c[0] == field.initial) {
                opts["selected"] = true;
            }
            return (
                <option value={c[0]} key={fieldname + "_choice_" + i} {...opts}>
                    {c[1]}
                </option>
            );
        });
        return (
            <Form.Select
                {...opts}
                id={get_input_id(fieldname, prefix)}
                name={get_input_name(fieldname, prefix)}
            >
                {choices}
            </Form.Select>
        );
    } else if (field.type === "InlineForeignKeyField") {
        return (
            <Form.Control
                defaultValue={field.initial}
                type="hidden"
                id={get_input_id(fieldname, prefix)}
                name={get_input_name(fieldname, prefix)}
            />
        );
    }
}
