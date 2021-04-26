import React from "react";
import { AppBar, Typography, Toolbar, Box } from "@material-ui/core";
import AuthBlock from "../authentication/auth_block/AuthBlock";
import MenuDrawer from "./MenuDrawer";

export const MenuNavBar = () => {
    /* navigation bar for game menu page */

    return (
        <AppBar position="static">
            <Toolbar>
                <MenuDrawer />
                <Box flexGrow={1}>
                    <Typography variant="h6">Praeteritum</Typography>
                </Box>
                <AuthBlock />
            </Toolbar>
        </AppBar>
    );
};

export default MenuNavBar;
