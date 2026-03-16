import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Link } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { authAxios } from "../../api/base";
import { useState, useEffect } from "react";
import { setCache, getCache } from "../../cache";
import { API_ENDPOINTS, API_BASE_URL, ADMIN_SITE_PREFERENCES } from "../../settings";
import { sleep } from "../../utils";

const CHOICE_FILTER_CLASS = "select-search-filter";
const INPUT_FILTER_CLASS = "input-search-filter";
const AUTOCOMPLETE_FILTER_CLASS = "autocomplete-search-filter";
const SEARCH_FILTER_ID = "search-filter-q";
const AUTOCOMPLETE_WAITING_TIME = 2000;
const AUTOCOMPLETE_VALUE_CACHE_TIME = 3600;

/* 
    variable to collect 
    all autocomplete filters' values
    to populate search query string
    when hitting search.

    The react-select values 
    cannot be found on the DOM
    so we store them here.
*/
var autocomplete_filters_values = {};

/* 
    autocomplete_filters_values : {
        "filter_id": [
            "parameter_name",
            {value: pk, label: str},
            "current_search_term",
        ],
        ...
    }
*/

function get_autocomplete_filter_cache_name() {
    /* 
    "{app}_{model}_autocomplete_filters" 
    of the list path
    */
    return window.location.pathname.slice(1).replaceAll("/", "_") + "_autocomplete_filters";
}

function get_autocomplete_filter_id(app_name, model_name) {
    return app_name + "_" + model_name + "_autocomplete";
}

function submit_filters_form(e) {
    /*
    On submitting the search form
    prevent default
    and augment the URL with all the filters names=values params,
    then assign the new page location.

    Django Admin uses the URL query params
    to filter the results
    using the corresponding filters in the backend.
    */
    e.preventDefault();

    let filter_params = [];

    // gather choice values
    document.querySelectorAll("." + CHOICE_FILTER_CLASS).forEach(function (f) {
        const selected_value = f.options[f.selectedIndex].value;
        if (selected_value) {
            filter_params.push(`${f.getAttribute("name")}=${selected_value}`);
        }
    });
    // gather input values
    document.querySelectorAll("." + INPUT_FILTER_CLASS).forEach(function (f) {
        if (f.value) {
            filter_params.push(`${f.getAttribute("name")}=${f.value}`);
        }
    });
    // gather autocomplete values
    document.querySelectorAll("." + AUTOCOMPLETE_FILTER_CLASS).forEach(function (f) {
        if (autocomplete_filters_values[f.id][1]) {
            const parameter_name = autocomplete_filters_values[f.id][0];
            const filter_value_str = String(autocomplete_filters_values[f.id][1].value);

            filter_params.push(`${parameter_name}=${filter_value_str}`);
        }
    });

    /*
    set autocomplete values inside cache
    to be able to populate filter after loading
    */
    const autocomplete_filter_cache_name = get_autocomplete_filter_cache_name();

    setCache(
        autocomplete_filter_cache_name,
        autocomplete_filters_values,
        AUTOCOMPLETE_VALUE_CACHE_TIME
    );

    /*
    empty autocomplete filters values
    will be repopulated after loading
    */
    autocomplete_filters_values = {};

    // q search
    const q_search_value = document.getElementById(SEARCH_FILTER_ID).value;

    if (q_search_value) {
        filter_params.push(`q=${q_search_value}`);
    }

    // Redirect with augmented URL query params
    e.target.setAttribute("action", "?" + filter_params.join("&"));

    window.location.assign("?" + filter_params.join("&"));
}

function FiltersSearch() {
    return (
        <FloatingLabel label="Search filters" className="mt-3">
            <Form.Control
                type="text"
                placeholder="Filter title"
                onChange={function (e) {
                    document.querySelectorAll(".filter-container").forEach(function (cont) {
                        if (!e.target.value) {
                            if (cont.classList.contains("d-none")) {
                                cont.classList.remove("d-none");
                            }
                        } else if (
                            !cont
                                .getAttribute("filter-title")
                                .toLowerCase()
                                .includes(e.target.value)
                        ) {
                            if (!cont.classList.contains("d-none")) {
                                cont.classList.add("d-none");
                            }
                        } else {
                            if (cont.classList.contains("d-none")) {
                                cont.classList.remove("d-none");
                            }
                        }
                    });
                }}
            />
        </FloatingLabel>
    );
}

function QueryFilter({ url_params }) {
    let q = "";

    if (url_params.has("q")) {
        q = url_params.get("q");
    }

    return (
        <Form.Control
            type="text"
            id={SEARCH_FILTER_ID}
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
                <option value="" key={filter.parameter_name + "_choice_" + index}>
                    {c.d}
                </option>
            );

        if (value === c.v) {
            opts["selected"] = true;
        }

        return (
            <option value={c.v} {...opts} key={filter.parameter_name + "_choice_" + index}>
                {c.d}
            </option>
        );
    });

    const filter_title = filter.title.charAt(0).toUpperCase() + filter.title.slice(1);

    return (
        <div
            className={ADMIN_SITE_PREFERENCES.list_filters_container_classes}
            id={filter.field_name + "_container"}
            filter-title={filter_title}
        >
            <p>
                <b>{filter_title}</b>
            </p>
            <select
                className={`form-control ${CHOICE_FILTER_CLASS} mx-auto`}
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
            className={ADMIN_SITE_PREFERENCES.list_filters_container_classes}
            id={filter.field_name + "_container"}
            filter-title={filter.title}
        >
            <p>
                <b>{filter.title}</b>
            </p>
            <input
                className={`form-control ${INPUT_FILTER_CLASS} w-100`}
                {...opts}
                name={filter.parameter_name}
                id={filter.field_name + "_filter"}
            />
        </div>
    );
}

function get_autocomplete_loader(app_name, model_name) {
    const autocomplete_url =
        API_BASE_URL + API_ENDPOINTS.filter_autocomplete(app_name, model_name) + "?q=";

    async function autocompleteLoader(q) {
        const url = autocomplete_url + q;
        const filter_id = get_autocomplete_filter_id(app_name, model_name);

        autocomplete_filters_values[filter_id][2] = q;

        await sleep(AUTOCOMPLETE_WAITING_TIME);

        if (autocomplete_filters_values[filter_id][2] !== q) {
            return;
        }

        try {
            const r = await authAxios.get(url);
            return r.data;
        } catch (error) {
            window.alert("Autocomplete error.");
            return null;
        }
    }

    return autocompleteLoader;
}

function get_autocomplete_initial_value(filter, url_params) {
    /* 
    Get cached filters' values.

    Check if filter parameter name
    is in the URL query params.
    if Yes, 
    return value cache if exists, 
    else return null.

    This is done to avoid making a query
    to populate the label of the initial value
    that is a simple pk value
    */
    const filter_id = get_autocomplete_filter_id(filter.app_name, filter.model_name);
    const autocomplete_filter_cache_name = get_autocomplete_filter_cache_name();
    const cached_values = getCache(autocomplete_filter_cache_name);
    const url_param_value = url_params.get(filter.parameter_name);

    /*
        value: {value: pk, label: label}
        if filter is used before with same value
        prepopulate from cached values
    */
    if (
        url_param_value &&
        cached_values &&
        filter_id in cached_values &&
        url_param_value === String(cached_values[filter_id][1].value)
    ) {
        return cached_values[filter_id][1];
    }

    return null;
}

function AutocompleteFilter({ filter, url_params }) {
    const [selectedOption, setSelectedOption] = useState(
        get_autocomplete_initial_value(filter, url_params)
    );

    const filter_id = get_autocomplete_filter_id(filter.app_name, filter.model_name);

    /*
        kept for providing selected values
        when search button is pressed
        to create the search URL
        --> stored in cache before search
    */
    autocomplete_filters_values[filter_id] = [filter.parameter_name, selectedOption];
    // -------------------------------------------------

    useEffect(() => {
        /*
            in case filter is used,
            and value not in cache
            fetch the label of the object pk
            from the server
        */
        async function set_filter_label(app_name, model_name, url_param_value, setSelectedOption) {
            const api_filter_label_retrieve_url =
                API_BASE_URL +
                API_ENDPOINTS.filter_autocomplete_retrieve_label(
                    app_name,
                    model_name,
                    url_param_value
                );

            try {
                const r = await authAxios.get(api_filter_label_retrieve_url);
                setSelectedOption(r.data);
            } catch (error) {
                return;
            }
        }

        const url_param_value = url_params.get(filter.parameter_name);

        if (url_param_value && !selectedOption) {
            set_filter_label(
                filter.app_name,
                filter.model_name,
                url_param_value,
                setSelectedOption
            );
        }
    }, []);

    // console.log("---------------------------------");
    // console.log("DEBBUGING AUTOCOMPLETE FILTER: ", filter.title);
    // console.log("cached_values = ", cached_values);
    // console.log("URL has param name = ", url_params.has(filter.parameter_name));
    // console.log("cached_values !== null = ", cached_values !== null);
    // console.log("filter_id in cached_values = ");
    // console.log(cached_values && filter_id in cached_values);
    // console.log("value init = ", value);
    // console.log("selectedOption = ", selectedOption);
    // console.log("---------------------------------");

    return (
        <div
            className={ADMIN_SITE_PREFERENCES.list_filters_container_classes}
            id={filter.field_name + "_container"}
            filter-title={filter.title}
        >
            <p>
                <b>{filter.title}</b>
            </p>

            <AsyncSelect
                id={filter_id}
                className={`${AUTOCOMPLETE_FILTER_CLASS} w-100`}
                // defaultOptions={true}
                loadOptions={get_autocomplete_loader(filter.app_name, filter.model_name)}
                onChange={setSelectedOption}
                cacheOptions
                isClearable
                value={selectedOption}
            />
        </div>
    );
}

function ResetFiltersButton({ filters_enabled }) {
    if (!filters_enabled) {
        return null;
    }
    return (
        <Link
            to=""
            className="btn btn-outline-warning d-flex flex-row"
            onClick={function () {
                autocomplete_filters_values = {};
            }}
        >
            <span className="d-none d-md-flex me-2">Reset</span>{" "}
            <i className="fa-solid fa-rotate-left my-auto" style={{ height: "20px" }}></i>
        </Link>
    );
}

// -----------------------------------------

function check_filters_enabled(filters, url_params) {
    // check if even one filter enabled

    if (url_params.has("all") || url_params.has("q")) {
        return true;
    } else {
        for (let filter of filters) {
            if (url_params.has(filter.parameter_name)) {
                return true;
            }
        }
    }
    return false;
}

function Filter({ filter, url_params }) {
    if (filter.type == "choice") {
        return <ChoiceFilter filter={filter} url_params={url_params} />;
    } else if (filter.type == "autocomplete") {
        return <AutocompleteFilter filter={filter} url_params={url_params} />;
    } else {
        return <InputFilter filter={filter} url_params={url_params} />;
    }
}

export function ListFilters({ filters }) {
    const url_params = new URLSearchParams(window.location.search);

    filters = filters || [];

    let filters_enabled = check_filters_enabled(filters, url_params);

    autocomplete_filters_values = {};

    // ------------------------------------------------
    // create the filters' UI
    const filters_jsx = filters.map(function (filter, index) {
        return <Filter filter={filter} url_params={url_params} key={"list_filter_" + index} />;
    });

    return (
        <Row className="p-5">
            <form
                action=""
                id="changelist_search"
                className="form-inline form-row m-0 p-3 rounded shadow border bg-alt"
                method="GET"
                onSubmit={submit_filters_form}
            >
                {/* <!-- show filters --> */}
                <Accordion
                    className="mb-2 btn btn-transparent p-0 w-100"
                    defaultActiveKey={filters_enabled ? "0" : ""}
                >
                    <Accordion.Item eventKey="0" className="border-0 bg-transparent">
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
                            style={{
                                maxHeight: "500px",
                                minHeight: "300px",
                                overflowY: "auto"
                            }}
                        >
                            <Row>
                                <div className="d-flex fler-row align-items-center justify-content-center w-100 mb-2">
                                    <FiltersSearch />
                                </div>
                                {filters_jsx}
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                {/* <!-- Search Term/Buttons --> */}
                <Col
                    xs="12"
                    md="6"
                    lg="6"
                    xxl="4"
                    className="d-flex flex-row justify-content-between mb-2 mx-auto"
                >
                    {/* <!-- Search with term--> */}
                    <QueryFilter url_params={url_params} />

                    <div
                        className="d-flex flex-row justify-content-start align-items-start ms-3"
                        id="search_group"
                    >
                        {/* <!-- submit --> */}
                        <button
                            type="submit"
                            className="btn btn-outline-primary me-3 d-flex flex-row"
                        >
                            <span className="d-none d-md-flex me-2">search</span>{" "}
                            <i className="fa-solid fa-magnifying-glass my-auto"></i>
                        </button>

                        {/* <!-- reset filters --> */}
                        <ResetFiltersButton filters_enabled={filters_enabled} />
                    </div>
                </Col>
            </form>
        </Row>
    );
}
