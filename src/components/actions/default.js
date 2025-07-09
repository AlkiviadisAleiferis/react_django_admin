import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export function DefaultPreviewAction({ action_data }) {
    return (
        <Row className="justify-content-start my-4">
            <Col xs="12" className="d-flex flex-column" id="object-preview">
                <p className="my-4">
                    <b>Description: {action_data.description}</b>
                </p>
            </Col>
            <Col
                xs="12"
                sm="6"
                lg="4"
                xxl="2"
                className="d-flex flex-column"
                id="object-preview"
            >
                <input
                    type="submit"
                    className="btn btn-outline-danger px-3 rounded-0"
                    value={"Confirm"}
                />
            </Col>
        </Row>
    );
}
