import { DEFAULT_CACHE_TTL } from "./settings";

function setCache(key, value, ttl) {
    const now = new Date();

    ttl = Number(ttl) * 1000 || DEFAULT_CACHE_TTL;

    const item = {
        value: value,
        expiry: Number(now.getTime()) + ttl
    };
    // sessionStorage.setItem(key, btoa(JSON.stringify(item)));
    sessionStorage.setItem(key, JSON.stringify(item));
}

function getCache(key) {
    const itemStr = sessionStorage.getItem(key);

    if (!itemStr) {
        return null;
    }

    // const item = JSON.parse(atob(itemStr));
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
        sessionStorage.removeItem(key);
        return null;
    }
    return item.value;
}

export { setCache, getCache };
