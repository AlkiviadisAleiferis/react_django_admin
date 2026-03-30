import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

import Messages from "./messages";

import { login } from "../../state/user";
import { obtainTokenPair } from "../../api/user";
import { appendErrorMessage } from "../../state/messages";
import { get_random_num } from "../../utils";
import { LoadingAnimation } from "../loading";
import { ADMIN_SITE_PREFERENCES } from "../../settings";

function LogIn() {
    const [_, set_error_message] = useState(null);

    async function handle_login(e) {
        e.preventDefault();
        let tokens = null;
        const loading_spinner = document.getElementById("loading_spinner");

        try {
            if (loading_spinner.classList.contains("d-none")) {
                loading_spinner.classList.remove("d-none");
            }

            tokens = await obtainTokenPair(e.target.username.value, e.target.password.value);
            const decoded_token = jwtDecode(tokens.access);
            const user = {
                user_id: decoded_token.user_id,
                identifier: decoded_token.identifier,
                username: decoded_token.username,
                refresh_token: tokens.refresh,
                access_token: tokens.access
            };

            login(user);

            loading_spinner.classList.add("d-none");
            window.location.assign(ADMIN_SITE_PREFERENCES.index_path);
        } catch (e) {
            if (e.status === undefined) {
                appendErrorMessage("A connection error occured. Please check your connection.");
            } else if (e.status == 401) {
                appendErrorMessage("Incorrect username and/or password.");
            } else if (e.status == 400) {
                appendErrorMessage("Username and password must be provided.");
            } else if (e.status && e.status >= 500) {
                appendErrorMessage("A server error occured. Please try again later.");
            }

            loading_spinner.classList.add("d-none");

            // set state var to a random string
            // to make sure there will be re-rendering
            set_error_message(get_random_num());
        }
    }

    const tokenExpired = sessionStorage.getItem("tokenExpired");
    sessionStorage.setItem("tokenExpired", null);

    return (
        <>
            <Messages />

            <Row className="h-100" id="login">
                <Col
                    xs="11"
                    md="10"
                    lg="6"
                    xxl="3"
                    className="d-flex flex-column justify-content-center mx-auto bg-main"
                    style={{ height: "100vh" }}
                >
                    <Form onSubmit={handle_login}>
                        <Row className="justify-content-center p-5 rounded shadow-lg bg-alt">
                            <Col xs="12" className="mb-3 d-flex flex-column">
                                <img
                                    src={ADMIN_SITE_PREFERENCES.logo_svg_path}
                                    className="d-none d-lg-block mx-auto"
                                    style={{ height: ADMIN_SITE_PREFERENCES.login_logo_height }}
                                />
                                <img
                                    src={ADMIN_SITE_PREFERENCES.logo_svg_path}
                                    className="d-lg-none mx-auto"
                                    style={{ width: "150px" }}
                                />

                                <h6 className="mx-auto mt-2">
                                    <b>{ADMIN_SITE_PREFERENCES.login_text}</b>
                                </h6>

                                {tokenExpired !== "null" && (
                                    <span className="text-danger text-sm mx-auto fade-in">
                                        Session expired
                                    </span>
                                )}
                            </Col>

                            <Col xs="12" className="mb-3">
                                <Form.Control name="username" placeholder="Username" />
                            </Col>

                            <Col xs="12" className="mb-3">
                                <Form.Control
                                    name="password"
                                    type="password"
                                    placeholder="password"
                                />
                            </Col>
                            <Col xs="12" className="d-flex">
                                <Button variant="primary" type="submit" className="w-100">
                                    Log in
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>

            <Row className="justify-content-center p-0 m-0" style={{ overflowX: "hidden" }}>
                <LoadingAnimation extra_classes={"d-none"} />
            </Row>
        </>
    );
}
export default LogIn;
