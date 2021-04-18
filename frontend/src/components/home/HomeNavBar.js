import React from "react";
import { AppBar, Typography, Toolbar, Box } from "@material-ui/core";
import AuthBlock from "../authentication/AuthBlock";

export const HomePage = (props) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Box flexGrow={1}>
                    <Typography variant="h6">Praeteritum</Typography>
                </Box>
                <AuthBlock
                    isLogged={props.isLogged}
                    username={props.username}
                    checkIfLogged={props.checkIfLogged}
                />
            </Toolbar>
        </AppBar>
    );
};

export default HomePage;
