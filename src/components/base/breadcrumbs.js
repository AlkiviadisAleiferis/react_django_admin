import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Link, useParams } from "react-router-dom";
import { ADMIN_SITE_PREFERENCES, SITE_PATH } from "../../settings";
import { get_model_label, get_view_label, check_model_add_permission } from "../../utils";

function BreadCrumbAddButton({ app_name, model_name }) {
    return (
        <Link
            to={SITE_PATH.object_add(app_name, model_name)}
            className={ADMIN_SITE_PREFERENCES.breadcrumbs_add_button_classes}
        >
            <span className="me-2 my-auto d-none d-md-block">Add Record</span>
            <i className="fa-solid fa-circle-plus"></i>
        </Link>
    );
}

function BreadCrumbs({ object_repr, view_name }) {
    const { app_name, model_name } = useParams();
    const can_add = check_model_add_permission(app_name, model_name);

    return (
        <Container fluid className="fade-in">
            <Row className="p-4">
                <div id="breadcrumbs" className="d-flex flex-row align-items-center">
                    {/* Model/View name */}
                    <h4 className="m-0 pr-3 mr-3">
                        <b>
                            {app_name && model_name
                                ? get_model_label(app_name, model_name)
                                : get_view_label(view_name)}
                        </b>
                    </h4>

                    {/* Object */}
                    <span className="ms-3 border-start ps-3">{object_repr && object_repr}</span>

                    {can_add && <BreadCrumbAddButton app_name={app_name} model_name={model_name} />}
                </div>
            </Row>
        </Container>
    );
}

export default BreadCrumbs;
