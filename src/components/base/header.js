import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import { userDispatchContext, userContext } from "../../state/user";
import { useContext, useState } from "react";
import { ADMIN_SITE_PREFERENCES } from "../../settings";
import Messages from "./messages";

function Header({ profile }) {
    const userDispatch = useContext(userDispatchContext);
    const user = useContext(userContext);
    const profile_path =
        profile && profile.app_name && profile.model_name && profile.user_pk
            ? `/${profile.app_name}/${profile.model_name}/${profile.user_pk}/`
            : null;

    return (
        <Navbar expand="md" className={ADMIN_SITE_PREFERENCES.header_classes}>
            <Navbar.Brand href="/">
                <img
                    src={ADMIN_SITE_PREFERENCES.logo_svg_path}
                    alt="Site Logo"
                    className={ADMIN_SITE_PREFERENCES.logo_classes}
                    style={{
                        height: ADMIN_SITE_PREFERENCES.logo_height_px + "px",
                    }}
                />
                <b className="ms-2">{ADMIN_SITE_PREFERENCES.site_name}</b>
            </Navbar.Brand>

            <Messages />

            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="header-nav" className="ms-auto me-3">
                <Nav className="ms-auto">
                    <NavDropdown
                        title={
                            <i
                                className="fa-solid fa-user text-primary"
                                style={{ fontSize: "25px" }}
                            ></i>
                        }
                        id="basic-nav-dropdown"
                        className=""
                        align="end"
                    >
                        {/* -------- USER IDENTIFIER -------- */}
                        <NavDropdown.Header>
                            Account: {user && user.identifier}
                        </NavDropdown.Header>

                        {/* -------- PROFILE LINK -------- */}
                        {profile_path ? (
                            <NavDropdown.Item className="p-0">
                                <Link
                                    to={profile_path}
                                    className="link-underline link-underline-opacity-0 w-100 text-center py-2 d-flex"
                                >
                                    <b className="m-auto">Profile</b>
                                </Link>
                            </NavDropdown.Item>
                        ) : null}

                        {/* -------- PASSWORD CHANGE -------- */}
                        {profile && profile.password_change ? (
                            <NavDropdown.Item className="p-0">
                                <Link
                                    to="/password_change/"
                                    className="link-underline link-underline-opacity-0 w-100 text-center py-2 d-flex"
                                >
                                    <b className="m-auto">Change Password</b>
                                </Link>
                            </NavDropdown.Item>
                        ) : null}

                        <NavDropdown.Divider />

                        {/* -------- LOG OUT -------- */}
                        <NavDropdown.Item
                            href=""
                            className="p-0 d-flex"
                            onClick={(e) => {
                                userDispatch({ type: "logout" });
                                window.location.reload();
                            }}
                        >
                            <b className="m-auto">Log out</b>
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;
