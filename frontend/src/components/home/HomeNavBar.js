import React from "react";
import { AppBar, Typography, Grid, Box } from "@material-ui/core";
import AuthPanel from "../authentication/AuthPanel";

export const HomePage = (props) => {
    return (
        <AppBar position="static">
            <Grid
                container
                justify="space-between"
                alignItems="center"
            >
                <Grid item>
                    <Box p={[0, 1, 2]}>
                        <Typography variant="h4" component="h4">
                            Praeteritum
                        </Typography>
                    </Box>
                </Grid>
                <Grid item>
                    <AuthPanel
                        isLogged={props.isLogged}
                        username={props.username}
                        checkIfLogged={props.checkIfLogged}
                    />
                </Grid>
            </Grid>
        </AppBar>
    );
};

export default HomePage;
