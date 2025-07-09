import { useRouteError } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { ADMIN_SITE_PREFERENCES } from "./settings";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <Row
            className="justify-content-center align-items-center w-100 h-100 text-center"
            id="error_page"
        >
            <Col xs="12" className="d-flex w-100 justify-content-center my-1">
                <img
                    src={ADMIN_SITE_PREFERENCES.logo_svg_path}
                    alt="Site Logo"
                    className={ADMIN_SITE_PREFERENCES.logo_classes}
                    style={{
                        height: "300px",
                    }}
                />
            </Col>
            <Col xs="12" className="d-flex flex-column justify-content-center w-100 my-2">
                <p>{error.message}</p>
                <h1><b>{error.status}</b></h1>
                <h3><b>{error.statusText}</b></h3>
            </Col>
        </Row>
    );
}
