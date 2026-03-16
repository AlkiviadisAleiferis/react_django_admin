import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import { getUser, logout } from "../../state/user";
import { ADMIN_SITE_PREFERENCES, SITE_PATH } from "../../settings";
import Messages from "./messages";

function Header({ profile }) {
    const user = getUser();

    const profile_path =
        profile && profile.app_name && profile.model_name && profile.user_pk
            ? SITE_PATH.object_edit(profile.app_name, profile.model_name, profile.user_pk)
            : null;

    const theme = localStorage.getItem("theme") || ADMIN_SITE_PREFERENCES.default_theme;

    return (
        <Navbar className={ADMIN_SITE_PREFERENCES.header_classes}>
            <Navbar.Brand href={ADMIN_SITE_PREFERENCES.index_path}>
                <img
                    src={ADMIN_SITE_PREFERENCES.logo_svg_path}
                    className={ADMIN_SITE_PREFERENCES.logo_classes}
                    style={{
                        height: ADMIN_SITE_PREFERENCES.logo_height_px + "px"
                    }}
                />
                <span className="ms-3">{ADMIN_SITE_PREFERENCES.site_name}</span>
            </Navbar.Brand>

            <div className="p-0 ms-auto d-flex flex-row">
                {/* -------- THEME -------- */}
                <Button
                    variant="info"
                    type="button"
                    className="d-flex bg-transparent border-0 w-100 d-flex justify-content-center align-items-center"
                    onClick={() => {
                        const theme = localStorage.getItem("theme");

                        if (theme == "light") {
                            localStorage.setItem("theme", "dark");
                            window.location.reload();
                        } else {
                            localStorage.setItem("theme", "light");
                            window.location.reload();
                        }
                    }}
                >
                    {theme == "dark" && (
                        <i
                            className="fa-regular fa-sun text-primary fa-xl"
                            id="light_theme_icon"
                        ></i>
                    )}
                    {theme == "light" && (
                        <i
                            className="fa-regular fa-moon text-primary fa-xl"
                            id="dark_theme_icon"
                        ></i>
                    )}
                </Button>
                <Messages />
                <Navbar.Collapse id="header-nav" className="me-4">
                    <Nav className="ms-auto">
                        <NavDropdown
                            title={ADMIN_SITE_PREFERENCES.user_icon}
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
                                onClick={e => {
                                    logout();
                                }}
                            >
                                <b className="m-auto">Log out</b>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

export default Header;
