import React from "react";
import { AppBar, Typography, Grid, Box } from "@material-ui/core";
import AuthPanel from "./authentication/AuthPanel";


export const HomePage = () => {
    return <AppBar>
        <Grid container justify="space-between" alignItems="center" spacing={3}>
            <Grid item>
                <Box p={[0, 1, 2]}>
                    <Typography variant="h4" component="h4">
                        Praeteritum
                    </Typography>
                </Box>
            </Grid>
            <Grid item>
                <AuthPanel/>
            </Grid>
        </Grid>
    </AppBar>
}


export default HomePage;
