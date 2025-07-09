import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Form as RouterForm, useActionData } from "react-router-dom";

export function PasswordChange({ props }) {
    const action_error_data = useActionData();

    const old_password_errors =
        action_error_data && action_error_data.error_data.old_password
            ? action_error_data.error_data.old_password
            : [];
    const password_1_errors =
        action_error_data && action_error_data.error_data.password1
            ? action_error_data.error_data.password1
            : [];
    const password_2_errors =
        action_error_data && action_error_data.error_data.password2
            ? action_error_data.error_data.password2
            : [];
    const non_form_errors =
        action_error_data && action_error_data.error_data["__all__"]
            ? action_error_data.error_data["__all__"]
            : [];

    const old_password_errors_jsx = old_password_errors.map((err, index) => (
        <span key={"old_password_error_" + index} className="text-danger">
            {err.message}
        </span>
    ));
    const non_form_errors_jsx = non_form_errors.map((err, index) => (
        <span key={"non_form_error_" + index} className="text-danger">
            {err.message}
        </span>
    ));
    const password_1_errors_jsx = password_1_errors.map((err, index) => (
        <span key={"password1_error_" + index} className="text-danger">
            {err.message}
        </span>
    ));
    const password_2_errors_jsx = password_2_errors.map((err, index) => (
        <span key={"password2_error_" + index} className="text-danger">
            {err.message}
        </span>
    ));

    return (
        <Container fluid className="p-1 fade-in">
            <RouterForm
                method="post"
                id="change_password"
                encType="multipart/form-data"
            >
                <Row className="p-0 mx-0 w-100">
                    <div className="col-12  d-flex flex-column">
                        {non_form_errors_jsx}
                    </div>

                    <div className="col-12 col-md-8 d-flex flex-column">
                        <label className="control-label float-md-right">
                            Old password
                        </label>
                        <input
                            type="password"
                            name="old_password"
                            required=""
                            id="id_old_password"
                            className="form-control"
                        />
                        {old_password_errors_jsx}
                    </div>

                    <div className="col-12 col-md-8 mt-5 d-flex flex-column">
                        <label className="control-label float-md-right">
                            New password
                        </label>
                        <input
                            type="password"
                            name="password1"
                            required=""
                            id="id_password1"
                            className="form-control"
                        />
                        {password_1_errors_jsx}
                    </div>

                    <div className="col-12 col-md-8 d-flex flex-column">
                        <label className="control-label float-md-right">
                            New password confirmation
                        </label>
                        <input
                            type="password"
                            name="password2"
                            required=""
                            id="id_password2"
                            className="form-control"
                        />
                        {password_2_errors_jsx}
                    </div>

                    <div className="col-12 col-md-8">
                        <ul>
                            <li>
                                Your password can’t be too similar to your other
                                personal information.
                            </li>
                            <li>
                                Your password must contain at least 8
                                characters.
                            </li>
                            <li>
                                Your password can’t be a commonly used password.
                            </li>
                            <li>Your password can’t be entirely numeric.</li>
                        </ul>
                    </div>

                    <div className="col-12 d-flex flex-row mt-3">
                        <span
                            className="text-warning"
                        >
                            Successfully changing password will log out the User.
                        </span>
                    </div>

                    <div className="col-12 d-flex flex-row mt-3">
                        <button
                            type="submit"
                            className="btn btn-primary me-auto"
                        >
                            Change password
                        </button>
                    </div>
                </Row>
            </RouterForm>
        </Container>
    );
}
