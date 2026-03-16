import React from "react";

import Header from "./base/header";
import Sidebar from "./base/sidebar";
import MobileSidebar from "./base/sidebar_mobile";
import LogIn from "./base/login";

import { Outlet, useNavigation, useLoaderData } from "react-router-dom";
import { useState } from "react";
import { LoaderContent } from "./content";
import Footer from "./base/footer";

import { getUser, tokenExpiresSoon } from "../state/user";
import { ADMIN_SITE_PREFERENCES } from "../settings";

import "../index.scss";
import "../index.css";

export default function Root(props) {
    const [user, setUser] = useState(getUser());
    const { sidebar, profile, extra } = useLoaderData();
    const navigate = useNavigation();
    /*
        The Authentication state
        is found only in the local storage
        not in the app's state

        The Authentication state
        is controlled in two places:
            1. here
            2. the Axios request interceptor

        In case of reloading the page
        the app's state is not preserved

        The access token is not of importance
        since the refresh token
        is used to generate a new access
        
        FOR THE CASE OF RELOADING THE PAGE: 
            if user exists in localStorage
            and refresh token is expired
            then clear auth state
            else let Axios interceptor handle it
    */
    if (user && tokenExpiresSoon(user.refresh_token)) {
        localStorage.clear();
        sessionStorage.clear();
        sessionStorage.setItem("tokenExpired", true);
        setUser(null);
    }
    /* 
        intercept and return to log in
        in case of non existing user
    */
    if (!user) {
        return <LogIn />;
    }

    /* --------------- sidebar-content columns --------------- */

    /* --------------- loader or content display --------------- */
    /* 
    do not create loader in add/edit
    to retain creation data 
    --
    in add,edit locations 
    loading is displayed below the actions 
    */
    const path_parts = window.location.pathname.split("/");
    const in_add = path_parts.includes("add");
    const in_edit = path_parts.includes("edit");
    const display_loading_only = navigate.state === "loading" && !in_add && !in_edit;

    /* -------------------------------------- */
    return (
        <>
            {/* ------- HEADER ------- */}
            <Header profile={profile} />

            {/* ------- SIDEBAR MOBILE ------- */}
            <MobileSidebar sidebar={sidebar} extra={extra} disable_links={false} />

            <div className="h-100 p-0 m-0 d-flex flex-row bg-alt">
                {/* ------- SIDEBAR ------- */}

                <div
                    className={ADMIN_SITE_PREFERENCES.sidebar_classes}
                    id="sidebar"
                    style={{
                        overflowY: "auto",
                        scrollbarWidth: "none"
                    }}
                >
                    <Sidebar sidebar={sidebar} extra={extra} disable_links={false} />
                </div>

                {/* ------- CONTENT ------- */}
                <div
                    id="main_content"
                    className="m-0 p-0 d-flex flex-column bg-main border-sidebar"
                >
                    {display_loading_only ? <LoaderContent /> : <Outlet />}
                </div>
            </div>

            {/* ------- FOOTER ------- */}
            <Footer />
        </>
    );
}
