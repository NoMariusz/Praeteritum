import React, { useState } from "react";
import {
    Box,
    Button,
    ButtonGroup,
    Link,
    IconButton,
    Menu,
    MenuItem,
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";

export const UnauthorizedMenu = () => {
    /* mini menu displaying when user is not authenticated, enable to log in
    and register */

    // menu stuff

    const [anchorEl, setAnchorEl] = useState(null);

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Box display={{ xs: "none", sm: "block" }}>
                <ButtonGroup
                    variant="text"
                    color="inherit"
                    aria-label="auth button group"
                >
                    <Button href="/login">Login</Button>
                    <Button href="/register">Register</Button>
                </ButtonGroup>
            </Box>
            <Box display={{ xs: "block", sm: "none" }}>
                <>
                    <IconButton
                        aria-label="Auth menu"
                        color="inherit"
                        edge="end"
                        onClick={openMenu}
                    >
                        <MoreVert />
                    </IconButton>
                    <Menu
                        id="auth-menu"
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
                        <MenuItem
                            component={Link}
                            href="/login"
                            underline="none"
                        >
                            Login
                        </MenuItem>
                        <MenuItem
                            component={Link}
                            href="/login"
                            underline="none"
                        >
                            Register
                        </MenuItem>
                    </Menu>
                </>
            </Box>
        </>
    );
};

export default UnauthorizedMenu;
