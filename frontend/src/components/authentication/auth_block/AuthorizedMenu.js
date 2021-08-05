import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { AccountCircle as AccountCircleIcon } from "@material-ui/icons";
import { getCSRF } from "../../../utils";

export const AuthorizedMenu = ({ username }) => {
    /* mini menu displaying when user is authenticated, enable to log out and
    display information and actions specified for only authorized users */

    const history = useHistory();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = async () => {
        /* logout user from his session and redirect to home page */
        const reqOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRF(),
            },
        };
        await fetch("/authentication/logout", reqOptions);
        // force redirect to home page
        history.push("/");
        // to load page correctly after redirect
        history.go(0);
    };

    // menu stuff

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                aria-label="Account menu"
                color="inherit"
                edge="end"
                onClick={openMenu}
            >
                <AccountCircleIcon />
            </IconButton>
            <Menu
                id="account-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={closeMenu}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <MenuItem disabled>Logged as {username}</MenuItem>
                <MenuItem component={Link} to="/menu" underline="none">
                    Game menu
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default AuthorizedMenu;
