import Spinner from "react-bootstrap/Spinner";

export function LoadingAnimation({ extra_classes }) {
    return (
        <Spinner
            animation="border"
            role="status"
            className={extra_classes}
            style={{ height: 100, width: 100 }}
            id="loading_spinner"
        >
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    );
}
