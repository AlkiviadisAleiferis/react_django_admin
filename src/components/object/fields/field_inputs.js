import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { authAxios } from "../../../api/base";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import { sleep } from "../../../utils";
import { API_ENDPOINTS, API_BASE_URL, SITE_PATH, ADMIN_SITE_PREFERENCES } from "../../../settings";

import { autocomplete_inputs_value, autocomplete_options_selector } from "../../cache";

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
    const extra = app && model ? `${app}_${model}_` : "";

    if (prefix) {
        return `${prefix}-${extra}${fieldname}_id`;
    } else {
        return `${extra}${fieldname}_id`;
    }
}

/* ------------ view actions ----------- */

export function set_related_field_actions(field, field_id, value) {
    let view_action = document.getElementById(`${field_id}_action_view`);
    let view_action_icon = document.getElementById(`${field_id}_action_view_icon`);

    let val = "";

    if (value !== null && typeof value === "object") {
        val = value.value ? value.value : "";
    } else {
        val = value;
    }

    if (val) {
        // hidden input above autocomplete
        if (view_action) {
            view_action.setAttribute("href", SITE_PATH.object_view(field.app, field.model, val));
        }
        if (view_action_icon && view_action_icon.classList.contains("text-secondary")) {
            view_action_icon.classList.remove("text-secondary");
        }
        if (view_action_icon && !view_action_icon.classList.contains("text-primary")) {
            view_action_icon.classList.add("text-primary");
        }
    } else {
        if (view_action) {
            view_action.setAttribute("href", "javascript:void(0)");
        }
        if (view_action_icon && view_action_icon.classList.contains("text-primary")) {
            view_action_icon.classList.remove("text-primary");
        }
        if (view_action_icon && !view_action_icon.classList.contains("text-secondary")) {
            view_action_icon.classList.add("text-secondary");
        }
    }
}

/* ------------ related ----------- */

function getAutocompleteLoader(app, model, fieldname, prefix) {
    const autocomplete_url = API_BASE_URL + API_ENDPOINTS.field_autocomplete(app, model, fieldname);

    async function autocompleteLoader(q) {
        const url = autocomplete_url + q;
        // the field id is used to create/retrieve
        // cached values at ``autocomplete_inputs_value``
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
            console.log("Autocomplete error: ", error);
            return [];
        }
    }

    return autocompleteLoader;
}

export function ModelChoiceField({ app, model, field, fieldname, prefix }) {
    // app, model is for parent field
    // field.app, field.model is for the related field

    const field_id = get_related_input_id(fieldname, app, model, prefix);
    const choices = field.choices ? field.choices : [];

    const choices_jsx = choices.map(function (choice, index) {
        let opts = {};
        if (field.initial && String(choice.value) === String(field.initial.value)) {
            opts["selected"] = true;
        }

        return (
            <option {...opts} value={choice.value} key={fieldname + "_option_" + index}>
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
                set_related_field_actions(field, field_id, value);
            }}
        >
            {choices_jsx}
        </Form.Select>
    );
}

export function AutocompleteField({ app, model, field, fieldname, prefix }) {
    // the field id is used to create/retrieve
    // cached values at ``autocomplete_inputs_value``
    // AND actual input's id
    const field_id = get_related_input_id(fieldname, app, model, prefix);

    const [selectedOption, setSelectedOption] = useState(field.initial);

    const loader = getAutocompleteLoader(app, model, fieldname, prefix);

    const initial_value = field.initial && field.initial.value ? field.initial.value : null;

    const opts = initial_value ? { defaultValue: initial_value } : {};

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
                onInputChange={input => (autocomplete_inputs_value[field_id] = String(input))}
                onChange={function (value) {
                    setSelectedOption(value);
                    document.getElementById(field_id).value =
                        value && value.value ? value.value : "";
                    set_related_field_actions(field, field_id, value);
                }}
                isClearable
                value={selectedOption}
            />
        </>
    );
}

export function ModelMultipleChoiceField(opts) {
    const initial = opts.initial || [];
    const choices = opts.choices || [];

    const choices_rows = choices
        ? choices.map(function (choice, index) {
              return (
                  <tr key={opts.fieldname + "_choice_" + index}>
                      <td>{choice.label}</td>
                      <td>
                          <Form.Check
                              id={opts.fieldname + "_chechbox_" + choice.value}
                              type="checkbox"
                              onClick={function (e) {
                                  const option = document.getElementById(
                                      opts.fieldname + "_option_" + choice.value
                                  );
                                  if (e.target.checked) {
                                      option.selected = true;
                                  } else {
                                      option.selected = false;
                                  }
                              }}
                              defaultChecked={initial.includes(choice.value)}
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
                          key={opts.fieldname + "_option_" + index}
                          id={opts.fieldname + "_option_" + choice.value}
                          value={choice.value}
                          selected
                      />
                  );
              } else {
                  return (
                      <option
                          key={opts.fieldname + "_option_" + index}
                          id={opts.fieldname + "_option_" + choice.value}
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
                name={opts.fieldname}
                id={opts.fieldname + "_id"}
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
}

export function InlineForeignKeyField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            type="hidden"
        />
    );
}

/* ------------ hidden ----------- */

export function HiddenField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            type="text"
        />
    );
}

/* ------------ image/file ----------- */

export function ImageField(opts) {
    let file_link_jsx = null;

    if (opts.initial) {
        const fileurl = opts.initial.startsWith("/")
            ? process.env.REACT_APP_FILE_SERVER_BASE_URL + opts.initial.slice(1)
            : process.env.REACT_APP_FILE_SERVER_BASE_URL + opts.initial;

        file_link_jsx = (
            <Link to={fileurl} target="_blank" className=" p-2">
                <span className="me-2">Open file</span>
                {ADMIN_SITE_PREFERENCES.object_view_link_icon()}
            </Link>
        );
    }

    return (
        <>
            <input required={opts.required} id={opts.id} name={opts.name} type="file" />
            {file_link_jsx}
        </>
    );
}

export function FileField(opts) {
    let file_link_jsx = null;

    if (opts.initial) {
        const fileurl = opts.initial.startsWith("/")
            ? process.env.REACT_APP_FILE_SERVER_BASE_URL + opts.initial.slice(1)
            : process.env.REACT_APP_FILE_SERVER_BASE_URL + opts.initial;

        file_link_jsx = (
            <Link to={fileurl} target="_blank" className=" p-2">
                <span className="me-2">Open file</span>
                {ADMIN_SITE_PREFERENCES.object_view_link_icon()}
            </Link>
        );
    }

    return (
        <>
            <input required={opts.required} id={opts.id} name={opts.name} type="file" />
            {file_link_jsx}
        </>
    );
}

/* ------------ json/array ----------- */

export function JSONFormField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            rows={opts.rows}
            cols={opts.cols}
            as="textarea"
            type="textarea"
        />
    );
}

export function JSONField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            rows={opts.rows}
            cols={opts.cols}
            as="textarea"
            type="textarea"
        />
    );
}

export function ArrayField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            rows={opts.rows}
            cols={opts.cols}
            as="textarea"
            type="textarea"
        />
    );
}

/* ------------ bool ----------- */

export function BooleanField(opts) {
    return (
        <Form.Check
            required={opts.required}
            defaultChecked={opts.initial ? opts.initial : false}
            id={opts.id}
            name={opts.name}
            type="checkbox"
        />
    );
}

export function NullBooleanField(opts) {
    return (
        <Form.Check
            required={opts.required}
            defaultChecked={opts.initial}
            id={opts.id}
            name={opts.name}
            type="checkbox"
        />
    );
}

/* ------------ time ----------- */

export function TimeField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            type="time"
        />
    );
}

export function DateField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            type="date"
        />
    );
}

export function DateTimeField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            type="datetime-local"
        />
    );
}

export function SplitDateTimeField(opts) {
    let date = null;
    let time = null;

    let initial = opts.initial ? new Date(opts.initial) : null;

    if (initial) {
        let month = initial.getMonth() + 1;
        let day = initial.getDate();
        let hours = initial.getHours();
        let minutes = initial.getMinutes();
        let seconds = initial.getSeconds();

        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + hours;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        date = `${initial.getFullYear()}-${month}-${day}`;
        time = `${hours}:${minutes}:${seconds}`;
    }

    return (
        <>
            <Form.Control
                required={opts.required}
                defaultValue={date}
                id={opts.id}
                name={opts.name + "_0"}
                type="date"
                step="any"
            />
            <Form.Control
                required={opts.required}
                defaultValue={time}
                id={opts.id}
                name={opts.name + "_1"}
                type="time"
                step="any"
                className="ms-2"
            />
        </>
    );
}

/* ------------ text ----------- */

export function CharField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            type="text"
        />
    );
}

export function URLField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            type="url"
        />
    );
}

export function EmailField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            type="email"
        />
    );
}

export function SlugField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            type="text"
        />
    );
}

export function UUIDField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            type="text"
        />
    );
}

export function TextField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            rows={opts.rows}
            cols={opts.cols}
            as="textarea"
            type="textarea"
        />
    );
}

/* ------------ choice ----------- */

export function ChoiceField(opts) {
    const choices = opts.choices || [];

    const choices_jsx = choices.map(function (c, i) {
        return (
            <option value={c[0]} key={opts.fieldname + "_choice_" + i}>
                {c[1]}
            </option>
        );
    });

    let extra_opts = {};
    if (opts.initial) {
        extra_opts.defaultValue = opts.initial;
    }

    return (
        <Form.Select required={opts.required} id={opts.id} name={opts.name} {...extra_opts}>
            {choices_jsx}
        </Form.Select>
    );
}

export function TypedChoiceField(opts) {
    return (
        <ChoiceField
            required={opts.required}
            initial={opts.initial}
            id={opts.id}
            name={opts.name}
            fieldname={opts.fieldname}
            choices={opts.choices}
        />
    );
}

/* ------------ numerical ----------- */

export function IntegerField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            type="number"
            step="1"
        />
    );
}

export function FloatField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            type="number"
            step="any"
        />
    );
}

export function DecimalField(opts) {
    return (
        <Form.Control
            required={opts.required}
            defaultValue={opts.initial}
            id={opts.id}
            name={opts.name}
            type="number"
            step="any"
        />
    );
}
