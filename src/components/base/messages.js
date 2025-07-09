import { getMessages, removeMessage } from "../../api/cache";
import { createContext, useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import { MESSAGE_TYPE } from "../../settings";
import { get_random_key_num } from "../../utils";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { show_messages } from "../cache";

let message_to_variant_class = {};
message_to_variant_class[MESSAGE_TYPE.success] = "success";
message_to_variant_class[MESSAGE_TYPE.error] = "danger";
message_to_variant_class[MESSAGE_TYPE.info] = "info";
message_to_variant_class[MESSAGE_TYPE.warning] = "warning";
message_to_variant_class[MESSAGE_TYPE.critical] = "critical";

function Message({ message }) {
    const [show, setShow] = useState(true);
    const type = message.type;
    const text = message.text;
    const seen = message.seen;

    const variant = message_to_variant_class[type];

    if (show && !seen) {
        return (
            <Alert
                variant={variant}
                onClose={function () {
                    setShow(false);
                    message["seen"] = true;
                }}
                dismissible
                className="d-flex flex-row me-2 border-0 rounded-0 px-4 py-3 w-100 my-1"
                transition={true}
            >
                <span>
                    <b>{text}</b>
                </span>
            </Alert>
        );
    } else {
        removeMessage(message);
    }
}

function Messages(props) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (show !== show_messages.show) {
            setShow(show_messages.show);
        }
    });

    const handleClose = () => {
        show_messages.show = false;
        setShow(false);
    };
    const handleShow = () => {
        show_messages.show = true;
        setShow(true);
    };

    let messages_jsx;
    const messages_dump = getMessages();

    messages_jsx = messages_dump.map((message) => (
        <Message
            type={message.type}
            message={message}
            key={"message_" + get_random_key_num()}
        />
    ));

    return (
        <>
            <Button
                onClick={handleShow}
                className="ms-auto d-flex bg-transparent text-primary nav-link"
            >
                <i
                    className="fa-solid fa-bell m-auto border p-3 rounded mx-2"
                    style={{ fontSize: "25px" }}
                ></i>
            </Button>

            <Offcanvas
                show={show}
                onHide={handleClose}
                placement={"top"}
                id="messages"
                backdrop={false}
                scroll={false}
                className="border-0 shadow"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title><b>Notifications</b></Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body className="d-flex flex-column justify-content-start align-items-center">
                    {messages_jsx}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default Messages;
