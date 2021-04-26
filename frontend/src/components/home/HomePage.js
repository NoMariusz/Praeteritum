import React from "react";
import { Container, Grid, Box, Typography, Paper } from "@material-ui/core";
import HomeNavBar from "./HomeNavBar";

export const HomePage = () => {
    /* page presenting project and enabling to login and register, some kind
    of landing page */

    return (
        <Box>
            <HomeNavBar />
            <Box my={3}>
                {/* container to store homapage content */}
                <Container maxWidth="xs">
                    <Grid
                        container
                        spacing={3}
                        justify="center"
                        alignItems="center"
                    >
                        <Paper>
                            <Box p={3} display="flex">
                                <Typography variant="h2">
                                    👋
                                </Typography>
                                <Typography variant="h5">
                                    Hello, this is home page, login to see more
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;
