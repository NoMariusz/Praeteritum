import React from "react";
import { AppBar, Typography, Toolbar, Box } from "@material-ui/core";
import AuthBlock from "../authentication/auth_block/AuthBlock";

export const HomePage = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Box flexGrow={1}>
                    <Typography variant="h6">Praeteritum</Typography>
                </Box>
                <AuthBlock />
            </Toolbar>
        </AppBar>
    );
};

export default HomePage;
