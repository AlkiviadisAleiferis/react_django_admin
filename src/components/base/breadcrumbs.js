import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Link, useParams } from "react-router-dom";
import { get_field_display_name, get_model_verbose_name } from "../../utils";
import { getCache } from "../../api/cache";

function BreadCrumbs({ object_repr, can_add, view_name }) {
    const { app_name, model_name } = useParams();

    const cached_base_info = getCache("base_info");
    const app_verbose_name = app_name ? get_field_display_name(app_name) : null;
    let model_verbose_name = model_name
        ? get_model_verbose_name(cached_base_info, model_name)
        : null;

    let paths = [];

    if (app_name) paths.push(app_verbose_name);
    if (model_name) paths.push(model_verbose_name);

    const add_path = `/${app_name}/${model_name}/add/`;

    const add_button = can_add ? (
        <Link
            to={add_path}
            className={
                "btn btn-outline-primary px-4 py-2 d-flex " +
                "flex-row align-items-center justify-content-center rounded-0" +
                " ms-auto"
            }
        >
            <h5 className="me-2 my-auto d-none d-md-block">Add record</h5>
            <i className="fa-solid fa-circle-plus"></i>
        </Link>
    ) : null;

    const breadcrums_jsx = view_name ? (
        <>
            <h6 className="h4 m-0 pr-3 mr-3 text-dark">
                <b>{view_name}</b>
            </h6>
        </>
    ) : (
        <>
            {/* App */}
            <h4 className="m-0 pr-3 mr-3 text-dark"><b>{paths[0]}</b></h4>
            {/* Model */}
            <h5
                className={
                    "m-0 pr-3 mr-3 text-dark" + " border-start ms-3 ps-3"
                }
            >
                <b>{paths[1]}</b>
            </h5>
            {/* Object */}
            <span className="ms-3 border-start ps-3">
                {object_repr && object_repr}
            </span>
        </>
    );

    return (
        <Container fluid className="p-4 fade-in">
            <Row className="pb-4">
                <div
                    id="breadcrumbs"
                    className="d-flex flex-row align-items-center"
                >
                    {breadcrums_jsx}
                    {add_button}
                </div>
            </Row>
        </Container>
    );
}

export default BreadCrumbs;
