import { createContext, useReducer } from 'react';
import React from "react";
import { jwtDecode } from 'jwt-decode';

export const userContext = createContext(null);
export const userDispatchContext = createContext(null);


export function UserContextProvider({ children }) {
    const [user, dispatch] = useReducer(
        userReducer,
        null
    );

    return (
        <userContext.Provider value={user}>
            <userDispatchContext.Provider value={dispatch}>
                {children}
            </userDispatchContext.Provider>
        </userContext.Provider>
    );
}


function userReducer(user, action) {
    switch (action.type) {
        case 'login': {
            setUserInStorage({
                user_id: action.user_id,
                identifier: action.identifier,
                username: action.username,
                refresh_token: action.refresh_token,
                access_token: action.access_token,
            });
            return {
                username: action.username,
                user_id: action.user_id,
                identifier: action.identifier,
                refresh_token: action.refresh_token,
                access_token: action.access_token,
            };
        }
        case 'logout': {
            window.location.assign("/");
            setUserInStorage(null);
            return null;
        }
    }
}


export function getUserInStorage() {
    const existingUser = localStorage.getItem("user")
    if (existingUser) {
        return JSON.parse(existingUser)
    } else {
        return null
    }
}


export function setUserInStorage(user) {
    localStorage.setItem("user", user ? JSON.stringify(user) : user)
}


export function tokenExpiresSoon(token, seconds) {
    seconds = seconds ? seconds * 1000 : 30000
    const x_sec_from_now = Date.now() + seconds;
    const token_toe = jwtDecode(token).exp * 1000;
    if (token_toe < x_sec_from_now) {
        return true;
    }
    return false;
}