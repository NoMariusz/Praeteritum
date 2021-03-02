import React from "react";
import {
    Container,
    Grid,
    Box,
    Paper,
    Typography,
    CircularProgress,
} from "@material-ui/core";

export const MatchLoading = () => {
    /* display information about connecting to the Match in backend */

    return (
        <Container>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={3}
            >
                <Paper>
                    <Box m={4}>
                        <Grid
                            container
                            spacing={2}
                            align="center"
                            direction="column"
                        >
                            <Grid item>
                                <Typography
                                    variant="h3"
                                    align="center"
                                    color="primary"
                                >
                                    Loading
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" align="center">
                                    Connecting to match, please wait ...
                                </Typography>
                            </Grid>
                            <Grid item>
                                <CircularProgress color="secondary" />
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default MatchLoading;
