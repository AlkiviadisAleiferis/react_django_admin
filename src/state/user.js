import { jwtDecode } from "jwt-decode";
import { TOKEN_EXP_OVERHEAD } from "../settings";

export function login(user) {
    setUser({
        username: user.username,
        user_id: user.user_id,
        identifier: user.identifier,
        refresh_token: user.refresh_token,
        access_token: user.access_token
    });
}

export function logout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.assign("/");
    // window.location.reload();
}

export function getUser() {
    const user = localStorage.getItem("user");
    if (user) {
        return JSON.parse(atob(user));
    } else {
        return null;
    }
}

export function setUser(user) {
    localStorage.setItem("user", user ? btoa(JSON.stringify(user)) : null);
}

export function tokenExpiresSoon(token, seconds) {
    seconds = seconds ? seconds * 1000 : TOKEN_EXP_OVERHEAD;

    const x_sec_from_now = Date.now() + seconds;
    const token_toe = jwtDecode(token).exp * 1000;

    if (token_toe < x_sec_from_now) {
        return true;
    }

    return false;
}
