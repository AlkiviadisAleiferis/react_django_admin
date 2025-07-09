import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { above_list_filters } from "./above_list_filters";

export function DefaultAboveListSection({ results, fields, no_data, can_add, list_extra_data }) {
    return (
        <Row className="p-0 mx-0 w-100 my-2">
            <Col
                xs="12"
                className="justify-content-start flex-row"
                id="above_list_filters"
            ></Col>
        </Row>
    );
}

export const list_extra_sections = {
    above_list: {
        __all__: DefaultAboveListSection,
        ...above_list_filters,
    },
};

export function get_above_list_filters_section(app_name, model_name) {
    const app_and_model = `${app_name}_${model_name}`;
    const above_list = list_extra_sections.above_list;
    return above_list[app_and_model]
        ? above_list[app_and_model]
        : above_list["__all__"];
}
