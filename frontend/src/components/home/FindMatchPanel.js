import React from "react";
import { Button, Typography, Grid, Paper } from "@material-ui/core";

export const HomePage = () => {
    const findMatch = () => {
        console.log("findMatch button pressed");
    };
    return (
        <Paper elevation={1}>
            <Grid container spacing={3} justify="center" alignItems="center">
                <Grid item align="center">
                    <Typography variant="h4">Start now</Typography>
                </Grid>
                <Grid item align="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={findMatch}
                    >
                        Find match
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default HomePage;
