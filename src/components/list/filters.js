import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Link } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { authAxios } from "../../api/base";
import { useState, useEffect } from "react";
import { setCache, getCache } from "../../api/cache";
import { API_ENDPOINTS } from "../../settings";
import { API_BASE_URL } from "../../settings";

// variable to collect all autocomplete filters' values
var autocomplete_filters_values = {};

/* 
    autocomplete_filters_values = {
        "filter_id": [
            parameter_name,
            {value: ..., label:...}
        ],
        ...
    }
*/

function get_autocomplete_filter_cache_name() {
    return (
        window.location.pathname.slice(1).replaceAll("/", "_") +
        "_autocomplete_filters"
    );
}

function submit_filters_form(e) {
    /*
    On submitting the search form
    prevenet default
    and augment the URL with all the filters names=values params,
    then assign the new page location.

    Django Admin uses the URL query params
    to filter the results
    using the corresponding filters in the backend.
    */
    e.preventDefault();

    let filter_params = [];

    // choice values
    document.querySelectorAll(".select-search-filter").forEach(function (f) {
        const selected_value = f.options[f.selectedIndex].value;
        if (selected_value) {
            filter_params.push(`${f.getAttribute("name")}=${selected_value}`);
        }
    });

    // input values
    document.querySelectorAll(".input-search-filter").forEach(function (f) {
        if (f.value) {
            filter_params.push(`${f.getAttribute("name")}=${f.value}`);
        }
    });

    // autocomplete values
    document
        .querySelectorAll(".autocomplete-search-filter")
        .forEach(function (f) {
            if (autocomplete_filters_values[f.id][1]) {
                filter_params.push(
                    `${autocomplete_filters_values[f.id][0]}=${String(
                        autocomplete_filters_values[f.id][1].value
                    )}`
                );
            }
        });

    // cache `autocomplete_filters_values`
    // to use after search to repopulate
    const autocomplete_filter_cache_name = get_autocomplete_filter_cache_name();

    setCache(autocomplete_filter_cache_name, autocomplete_filters_values, 3600);
    autocomplete_filters_values = {};

    // q search
    const q_search_value = document.getElementById("search-filter-q").value;
    if (q_search_value) {
        filter_params.push(`q=${q_search_value}`);
    }

    // Redirect with augmented URL query params
    e.target.setAttribute("action", "?" + filter_params.join("&"));
    window.location.assign("?" + filter_params.join("&"));
}

function QueryFilter(props) {
    const url_params = new URLSearchParams(window.location.search);
    let q = "";

    if (url_params.has("q")) {
        q = url_params.get("q");
    }

    return (
        <Form.Control
            type="text"
            id="search-filter-q"
            placeholder="search with term"
            name="q"
            {...{ defaultValue: q }}
        />
    );
}

function ChoiceFilter({ filter, url_params }) {
    let value;
    let opts;

    if (url_params.has(filter.parameter_name)) {
        value = url_params.get(filter.parameter_name);
    }

    const choices = filter.choices.map(function (c, index) {
        opts = {};

        if (c.v === null)
            return (
                <option
                    value=""
                    key={filter.parameter_name + "_choice_" + index}
                >
                    {c.d}
                </option>
            );

        if (value === c.v) {
            opts["selected"] = true;
        }

        return (
            <option
                value={c.v}
                {...opts}
                key={filter.parameter_name + "_choice_" + index}
            >
                {c.d}
            </option>
        );
    });

    const filter_title =
        filter.title.charAt(0).toUpperCase() + filter.title.slice(1);

    return (
        <div
            className="col-12 col-md-3 col-xxl-2 d-flex flex-column justify-content-center align-items-start filter-container py-2"
            id={filter.field_name + "_container"}
            filter-title={filter_title}
        >
            <p>
                <b>{filter_title}</b>
            </p>
            <select
                className="form-control select-search-filter mx-auto"
                name={filter.parameter_name}
                id={filter.field_name + "_filter"}
            >
                {choices}
            </select>
        </div>
    );
}

function InputFilter({ filter, url_params }) {
    let opts = {};
    let value;

    if (url_params.has(filter.parameter_name)) {
        value = url_params.get(filter.parameter_name);
    }

    if (value) {
        opts["defaultValue"] = value;
    }

    if (filter.step) {
        opts["step"] = filter.step;
    }

    if (filter.input_type) {
        opts["type"] = filter.input_type;
    }

    if (["int", "float", "date", "datetime"].includes(filter.type)) {
        if (filter.input_min) {
            opts["min"] = filter.input_min;
        }
        if (filter.input_max) {
            opts["max"] = filter.input_max;
        }
    } else {
        if (filter.input_min) {
            opts["minlength"] = filter.input_min;
        }
        if (filter.input_max) {
            opts["maxlength"] = filter.input_max;
        }
    }
    opts["placeholder"] = filter.placeholder;

    return (
        <div
            className="col-12 col-md-3 col-xxl-2 d-flex flex-column justify-content-center align-items-start filter-container py-2"
            id={filter.field_name + "_container"}
            filter-title={filter.title}
        >
            <p>
                <b>{filter.title}</b>
            </p>
            <input
                className="form-control input-search-filter w-100"
                {...opts}
                name={filter.parameter_name}
                id={filter.field_name + "_filter"}
            />
        </div>
    );
}

function get_autocomplete_loader(app_name, model_name) {
    const autocomplete_url =
        API_BASE_URL +
        API_ENDPOINTS.filter_autocomplete(app_name, model_name) +
        "?q=";

    async function autocompleteLoader(q) {
        const url = autocomplete_url + q;

        try {
            const r = await authAxios.get(url);
            return r.data;
        } catch (error) {
            window.alert("Autocomplete error. Contact admins.");
            return null;
        }
    }

    return autocompleteLoader;
}

function AutocompleteFilter({ filter, url_params }) {
    const filter_id =
        filter.app_name + "_" + filter.model_name + "_autocomplete";

    // at initialization
    // clear the `autocomplete_filters_values` value of the filter
    // and check if filter parameter name
    // is in the URL query params.
    // if Yes, then populate from cache if there, else set null

    // kept for providing selected values upon search
    // -- stored in cache before search
    autocomplete_filters_values[filter_id] = null;

    const autocomplete_filter_cache_name = get_autocomplete_filter_cache_name();

    const cached_values = getCache(autocomplete_filter_cache_name);

    // console.log("DEBBUGING AUTOCOMPLETE FILTER");
    // console.log("cached_values = ", cached_values);
    // console.log("URL has param name = ", url_params.has(filter.parameter_name));
    // console.log("cached_values !== null = ", cached_values !== null);
    // console.log(
    //     "filter_id in cached_values = ",
    //     cached_values !== null && filter_id in cached_values
    // );

    let value = null;
    let url_param_value = url_params.get(filter.parameter_name);

    // if filter is used before with same value
    // prepopulate from cached values
    if (
        url_param_value &&
        cached_values !== null &&
        filter_id in cached_values &&
        url_param_value === String(cached_values[filter_id][1].value)
    ) {
        value = cached_values[filter_id][1];
        // console.log("value in = ", value);
    }

    const [selectedOption, setSelectedOption] = useState(value);
    // console.log("value init = ", value);

    // if filter is used, but value not in cache
    // fetch the label of the object pk from the server

    useEffect(() => {
        async function filter_label_retrieve_and_set(
            app_name,
            model_name,
            url_param_value,
            value_setter
        ) {
            const api_filter_label_retrieve_url =
                API_BASE_URL +
                API_ENDPOINTS.filter_autocomplete_retrieve_label(
                    app_name,
                    model_name,
                    url_param_value
                );
            try {
                const r = await authAxios.get(api_filter_label_retrieve_url);
                // console.log("value from retrieve= ", r.data);
                value_setter(r.data);
            } catch (error) {
                return;
            }
        }
        const url_param_value = url_params.get(filter.parameter_name);
        if (url_param_value && !value) {
            filter_label_retrieve_and_set(
                filter.app_name,
                filter.model_name,
                url_param_value,
                setSelectedOption
            );
        }
    }, []);

    // kept for providing selected values upon search
    // -- stored in cache before search
    autocomplete_filters_values[filter_id] = [
        filter.parameter_name,
        selectedOption,
        setSelectedOption,
    ];
    // console.log("selectedOption = ", selectedOption);
    // console.log(
    //     "autocomplete_filters_values[filter_id] = ",
    //     autocomplete_filters_values[filter_id]
    // );
    // console.log("---------------------------------");

    return (
        <div
            className="col-12 col-md-3 col-xxl-2 d-flex flex-column justify-content-center align-items-start filter-container py-2"
            id={filter.field_name + "_container"}
            filter-title={filter.title}
        >
            <p>
                <b>{filter.title}</b>
            </p>

            <AsyncSelect
                id={filter_id}
                className="autocomplete-search-filter w-100"
                loadOptions={get_autocomplete_loader(
                    filter.app_name,
                    filter.model_name
                )}
                onChange={setSelectedOption}
                cacheOptions
                isClearable
                value={selectedOption}
            />
        </div>
    );
}

export function ChangeListFilters({ filters }) {
    const url_params = new URLSearchParams(window.location.search);
    let filters_enabled = false;
    let reset_filters_button = null;

    if (!filters) {
        filters = [];
    }

    // check if even one filter enabled
    if (url_params.has("all") || url_params.has("q")) {
        filters_enabled = true;
    } else {
        for (let filter of filters) {
            if (url_params.has(filter.parameter_name)) {
                filters_enabled = true;
                break;
            }
        }
    }

    // calculate reset filters button jsx
    if (filters_enabled) {
        reset_filters_button = (
            <>
                <Link
                    to=""
                    className="btn btn-outline-warning rounded-0 d-flex flex-row"
                    onClick={function () {
                        for (let filter_id in autocomplete_filters_values) {
                            autocomplete_filters_values[filter_id][2](null);
                        }
                    }}
                >
                    <span className="d-none d-md-flex me-2">Reset</span>{" "}
                    <i
                        className="fa-solid fa-rotate-left my-auto"
                        style={{ height: "20px" }}
                    ></i>
                </Link>
            </>
        );
    }

    // ------------------------------------------------
    // create the filters' UI
    filters = filters.map(function (filter, index) {
        if (filter.type == "choice") {
            return (
                <ChoiceFilter
                    filter={filter}
                    url_params={url_params}
                    key={"filter_" + index}
                />
            );
        } else if (filter.type == "autocomplete") {
            return (
                <AutocompleteFilter
                    filter={filter}
                    url_params={url_params}
                    key={"filter_" + index}
                />
            );
        } else {
            return (
                <InputFilter
                    filter={filter}
                    url_params={url_params}
                    key={"filter_" + index}
                />
            );
        }
    });

    return (
        <Row className="my-0">
            <form
                action=""
                id="changelist-search"
                className="form-inline form-row px-2 m-0"
                method="GET"
                onSubmit={submit_filters_form}
            >
                {/* <!-- show filters --> */}
                <Accordion
                    className="mb-2 btn btn-transparent p-0 rounded-0"
                    defaultActiveKey={filters_enabled ? "0" : ""}
                >
                    <Accordion.Item eventKey="0" className="border-0">
                        <Accordion.Header className="border-0">
                            <h5 className="me-3 my-0">
                                <b>Filters</b>
                            </h5>
                            <i
                                className="fa-solid fa-filter me-3 my-0"
                                style={{ fontSize: "23px" }}
                            ></i>
                        </Accordion.Header>

                        <Accordion.Body
                            className="border-0"
                            style={{ maxHeight: "500px", overflowY: "auto" }}
                        >
                            <Row>
                                <div className="d-flex fler-row align-items-center justify-content-center w-100 mb-2">
                                    <FloatingLabel
                                        label="Search filters"
                                        className="mt-3"
                                    >
                                        <Form.Control
                                            type="text"
                                            placeholder="Filter title"
                                            onChange={function (e) {
                                                document
                                                    .querySelectorAll(
                                                        ".filter-container"
                                                    )
                                                    .forEach(function (cont) {
                                                        if (!e.target.value) {
                                                            if (
                                                                cont.classList.contains(
                                                                    "d-none"
                                                                )
                                                            ) {
                                                                cont.classList.remove(
                                                                    "d-none"
                                                                );
                                                            }
                                                        } else if (
                                                            !cont
                                                                .getAttribute(
                                                                    "filter-title"
                                                                )
                                                                .toLowerCase()
                                                                .includes(
                                                                    e.target
                                                                        .value
                                                                )
                                                        ) {
                                                            if (
                                                                !cont.classList.contains(
                                                                    "d-none"
                                                                )
                                                            ) {
                                                                cont.classList.add(
                                                                    "d-none"
                                                                );
                                                            }
                                                        } else {
                                                            if (
                                                                cont.classList.contains(
                                                                    "d-none"
                                                                )
                                                            ) {
                                                                cont.classList.remove(
                                                                    "d-none"
                                                                );
                                                            }
                                                        }
                                                    });
                                            }}
                                        />
                                    </FloatingLabel>
                                </div>
                                {filters}
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Col
                    xs="12"
                    md="6"
                    lg="4"
                    xxl="3"
                    className="d-flex flex-row justify-content-between me-auto mb-4 p-3"
                >
                    <QueryFilter />

                    <div
                        className="d-flex flex-row justify-content-start align-items-start ms-3"
                        id="search_group"
                    >
                        {/* <!-- submit --> */}
                        <button
                            type="submit"
                            className="btn btn-outline-primary  me-3 d-flex flex-row rounded-0"
                        >
                            <span className="d-none d-md-flex me-2">
                                search
                            </span>{" "}
                            <i className="fa-solid fa-magnifying-glass my-auto"></i>
                        </button>
                        {/* <!-- reset filters --> */}
                        {reset_filters_button}
                    </div>
                </Col>
            </form>
        </Row>
    );
}
