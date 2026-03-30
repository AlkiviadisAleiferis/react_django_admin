import { getMessages, removeMessage } from "../../state/messages";
import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import { MESSAGE_TYPE } from "../../settings";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { show_messages } from "../../state/messages";

let message_to_variant = {
    [MESSAGE_TYPE.success]: "success",
    [MESSAGE_TYPE.error]: "danger",
    [MESSAGE_TYPE.info]: "info",
    [MESSAGE_TYPE.warning]: "warning",
    [MESSAGE_TYPE.critical]: "dark"
};

function Message({ message }) {
    const [show, setShow] = useState(true);

    if (show && !message.seen) {
        return (
            <Alert
                variant={message_to_variant[message.type]}
                onClose={function () {
                    message["seen"] = true;
                    setShow(false);
                }}
                dismissible
                className="d-flex flex-row align-items-center rounded-0 border-0 shadow-sm px-4 py-2 w-100 my-1"
                transition={true}
            >
                <span>{message.text}</span>
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

    messages_jsx = messages_dump.map((message, index) => (
        <Message type={message.type} message={message} key={"message_" + index} />
    ));

    return (
        <>
            <Button
                onClick={handleShow}
                className="ms-auto d-flex bg-transparent text-primary border-0"
            >
                <i
                    className="fa-regular fa-bell m-auto border-0 p-2 mx-2"
                    style={{ fontSize: "22px" }}
                ></i>
            </Button>

            <Offcanvas
                show={show}
                onHide={handleClose}
                placement={"start"}
                id="messages"
                scroll={true}
                className="border-0 shadow bg-alt"
            >
                <Offcanvas.Body
                    className="d-flex flex-column justify-content-start align-items-center"
                    style={{ maxWidth: "70%" }}
                >
                    {messages_jsx}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default Messages;
