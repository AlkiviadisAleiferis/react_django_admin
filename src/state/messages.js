import { MESSAGE_TYPE } from "../settings";

/* 
messages format:

    [
        {
            type: "S" | "E" | "W" | "I" | "C",
            text: string
        }
    ]

*/
var messages = [];
var show_messages = { show: false };

function getMessages() {
    const messages_dump = [...messages];
    return messages_dump;
}

function appendMessages(messages_list) {
    show_messages.show = true;
    messages = [...messages, ...messages_list];
}

function removeMessage(message) {
    const msg_indx = messages.indexOf(message);
    messages.pop(msg_indx);
}

// ------- append particular type message

function appendSuccessMessage(text) {
    show_messages.show = true;
    appendMessages([{ type: MESSAGE_TYPE.success, text: text }]);
}

function appendErrorMessage(text) {
    show_messages.show = true;
    appendMessages([{ type: MESSAGE_TYPE.error, text: text }]);
}

function appendWarningMessage(text) {
    show_messages.show = true;
    appendMessages([{ type: MESSAGE_TYPE.warning, text: text }]);
}

function appendInfoMessage(text) {
    show_messages.show = true;
    appendMessages([{ type: MESSAGE_TYPE.info, text: text }]);
}

function appendCriticalMessage(text) {
    show_messages.show = true;
    appendMessages([{ type: MESSAGE_TYPE.critical, text: text }]);
}

export {
    show_messages,
    getMessages,
    appendMessages,
    removeMessage,
    appendSuccessMessage,
    appendErrorMessage,
    appendWarningMessage,
    appendInfoMessage,
    appendCriticalMessage
};
