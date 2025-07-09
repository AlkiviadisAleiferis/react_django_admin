import React from "react";

import Header from "./base/header";
import Sidebar from "./base/sidebar";
import LogIn from "./base/login";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Outlet, useNavigation, useLoaderData } from "react-router-dom";
import { useContext, useEffect } from "react";
import { LoadingAnimation } from "./helpers/loading";

import {
    userDispatchContext,
    getUserInStorage,
    tokenExpiresSoon,
} from "../state/user";
import { ADMIN_SITE_PREFERENCES, BACKGROUND_IMAGE } from "../settings";

import "../index.scss";
import "../index.css";

export default function Root(props) {
    const userDispatch = useContext(userDispatchContext);
    const navigate = useNavigation();
    const { entities, profile, apps } = useLoaderData();

    // DETERMINE AUTHENTICATION STATUS AT INIT :
    // if user exists in localStorage when reloading
    // send dispatch and update context with user
    // IF refresh token not expired

    useEffect(() => {
        const user_in_storage = getUserInStorage();
        if (user_in_storage) {
            // if previously authenticated
            // if refresh token expired, go to LogIn
            // by setting user null in Storage

            if (tokenExpiresSoon(user_in_storage.refresh_token)) {
                sessionStorage.setItem("tokenExpired", true);
                userDispatch({ type: "logout" });
                window.location.reload();
            } else {
                userDispatch({
                    type: "login",
                    user_id: user_in_storage.user_id,
                    identifier: user_in_storage.identifier,
                    username: user_in_storage.username,
                    refresh_token: user_in_storage.refresh_token,
                    access_token: user_in_storage.access_token,
                });
            }
        }
    });

    /* 
        intercept and return to log in 
        if authentication expired or non existing 
    */

    if (!getUserInStorage() || sessionStorage.getItem("tokenExpired")) {
        return <LogIn />;
    }

    /* --------------- sidebar-content columns --------------- */
    let content_cols = {};
    const sidebar_cols = {
        xs: "2",
        xl: "1",
    };
    for (let breakpoint in sidebar_cols) {
        content_cols[breakpoint] = 12 - sidebar_cols[breakpoint];
    }

    /* --------------- determine content --------------- */
    /* do not create loader in add to retain creation data */
    const path_parts = window.location.pathname.split("/");
    const in_add_location = path_parts.includes("add");
    const in_edit_location = path_parts.includes("edit");

    // in add,edit locations
    // loading is displayed below the actions

    const display_loading_only =
        navigate.state === "loading" && !in_add_location && !in_edit_location;

    const content_to_display = display_loading_only ? (
        <Row className="w-100 h-100 align-items-center justify-content-center text-center">
            <Col xs="12" lg="4" xl="2">
                <LoadingAnimation />
            </Col>
        </Row>
    ) : (
        <Outlet />
    );

    return (
        <>
            {/* ------- HEADER ------- */}
            <Header profile={profile} />
            {/* ------- MAIN BODY ------- */}
            <Row className="h-100 w-100 p-0 m-0">
                {/* ------- SIDEBAR ------- */}
                <Col
                    {...sidebar_cols}
                    className={ADMIN_SITE_PREFERENCES.sidebar_classes}
                    id="sidebar"
                    style={{
                        overflowY: "auto",
                        maxHeight: "100vh",
                        scrollbarWidth: "none",
                    }}
                >
                    <Sidebar apps={apps} entities={entities} disable_links={false} />
                </Col>

                {/* ------- CONTENT ------- */}
                <Col
                    {...content_cols}
                    id="main_content"
                    className=""
                    style={BACKGROUND_IMAGE}
                >
                    {content_to_display}
                </Col>
                {/* ------- TODO: FOOTER ------- */}
                {/* ---------------------------- */}
            </Row>
        </>
    );
}
