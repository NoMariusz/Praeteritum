import React from "react";
import { AppBar, Typography, Toolbar, Box } from "@material-ui/core";
import AuthPanel from "../authentication/AuthPanel";

export const HomePage = (props) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Box flexGrow={1}>
                    <Typography variant="h6">Praeteritum</Typography>
                </Box>
                <AuthPanel
                    isLogged={props.isLogged}
                    username={props.username}
                    checkIfLogged={props.checkIfLogged}
                />
            </Toolbar>
        </AppBar>
    );
};

export default HomePage;
