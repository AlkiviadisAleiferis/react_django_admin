import { MESSAGE_TYPE } from "../settings";
import { show_messages } from "../components/cache";

// ------- caching

function setCache(key, value, ttl) {
    const now = new Date();
    ttl = Number(ttl) * 1000 || Number(process.env.REACT_APP_DEFAULT_CACHE_TTL);

    const item = {
        value: value,
        expiry: Number(now.getTime()) + ttl,
    };
    sessionStorage.setItem(key, JSON.stringify(item));
}

function getCache(key) {
    const itemStr = sessionStorage.getItem(key);
    if (!itemStr) {
        return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
        sessionStorage.removeItem(key);
        return null;
    }
    return item.value;
}

// ------- messaging

var messages = [];

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
    setCache,
    getCache,
    getMessages,
    appendMessages,
    removeMessage,
    appendSuccessMessage,
    appendErrorMessage,
    appendWarningMessage,
    appendInfoMessage,
    appendCriticalMessage,
};
