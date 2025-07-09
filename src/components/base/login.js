import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { jwtDecode } from "jwt-decode";

import Messages from "./messages";

import { userDispatchContext } from "../../state/user";
import { obtainTokenPair } from "../../api/user";
import { useContext, useState } from "react";
import { appendErrorMessage } from "../../api/cache";
import { get_random_key_num } from "../../utils";
import { LoadingAnimation } from "../helpers/loading";
import { ADMIN_SITE_PREFERENCES } from "../../settings";

function LogIn() {
    const [_, set_error_message] = useState(null);
    const userDispatch = useContext(userDispatchContext);

    async function handleLogIn(e) {
        e.preventDefault();
        let tokens = null;
        const loading_gif = document.getElementById("loading_gif");

        try {
            if (loading_gif.classList.contains("d-none")) {
                loading_gif.classList.remove("d-none");
            }
            tokens = await obtainTokenPair(
                e.target.username.value,
                e.target.password.value
            );
            const decoded_token = jwtDecode(tokens.access);
            userDispatch({
                type: "login",
                user_id: decoded_token.user_id,
                identifier: decoded_token.identifier,
                username: decoded_token.username,
                refresh_token: tokens.refresh,
                access_token: tokens.access,
            });

            loading_gif.classList.add("d-none");
            window.location.reload();
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

            loading_gif.classList.add("d-none");

            // set state var to a random string 
            // to make sure there will be re-rendering
            set_error_message(get_random_key_num());
        }
    }

    const tokenExpired = sessionStorage.getItem("tokenExpired");
    sessionStorage.setItem("tokenExpired", "");

    return (
        <>
        <Messages />

        <Row className="h-100">
            <Col
                xs="11"
                md="10"
                lg="6"
                xxl="3"
                className="d-flex flex-column justify-content-center mx-auto"
            >
                <Form onSubmit={handleLogIn}>
                    <Row className="justify-content-center p-5 rounded shadow-lg">
                        <Col
                            xs="12"
                            className="mb-3 d-flex flex-column"
                        >
                            <img
                                src={ADMIN_SITE_PREFERENCES.logo_svg_path}
                                className="d-none d-lg-block mx-auto"
                                style={{ width: "250px" }}
                            />
                            <img
                                src={ADMIN_SITE_PREFERENCES.logo_svg_path}
                                className="d-lg-none mx-auto"
                                style={{ width: "150px" }}
                            />

                            <h6 className="mx-auto mt-2">
                                <b>{ADMIN_SITE_PREFERENCES.login_text}</b>
                            </h6>

                            {tokenExpired && <span className="text-danger text-sm mx-auto fade-in">Session expired</span>}

                        </Col>

                        <Col xs="12" className="mb-3">
                            <Form.Control
                                name="username"
                                placeholder="Username"
                            />
                        </Col>

                        <Col xs="12" className="mb-3">
                            <Form.Control
                                name="password"
                                type="password"
                                placeholder="password"
                            />
                        </Col>
                        <Col xs="12" className="d-flex">
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100"
                            >
                                Log in
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>

        <Row className="justify-content-center p-0 m-0" style={{"overflowX": "hidden"}}>
            <LoadingAnimation extra_classes={"d-none"}/>
        </Row>
                    
        </>
    );
}
export default LogIn;
