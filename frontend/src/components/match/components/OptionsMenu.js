import React, { useState } from "react";
import { Box, IconButton, Menu } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";

export const OptionsMenu = ({ menuContainer }) => {
    /* Menu containing options provided by other components by using portal
    to menuContainer ref */

    const [anchorEl, setAnchorEl] = useState(null);

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Box
                position="fixed"
                right="0"
                bottom="0"
                z-index="2"
                width="10%"
                px={2}
                display="flex"
                justifyContent="center"
            >
                <IconButton
                    aria-label="Options menu"
                    color="inherit"
                    edge="end"
                    onClick={openMenu}
                >
                    <MoreVert />
                </IconButton>
            </Box>
            <Menu
                id="option-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={closeMenu}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Box ref={menuContainer} />
            </Menu>
        </>
    );
};

export default OptionsMenu;
