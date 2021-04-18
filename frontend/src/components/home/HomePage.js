import React, { useState } from "react";
import { Container, Grid, Box } from "@material-ui/core";
import HomeNavBar from "./HomeNavBar";
import SearchMatchBlock from "./SearchMatchBlock";
import RunningMatchesNotifer from "./matches_notifer/RunningMatchesNotifer";

export const HomePage = () => {
    const [isLogged, setIsLogged] = useState(false);

    const checkIfLogged = () => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/authentication/isAuthenticated", requestOptions)
            .then((res) => res.json())
            .then((data) => {
                setIsLogged(data.isAuthenticated);
            });
    };

    checkIfLogged();

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
                        {isLogged ? (
                            <Grid item xs={12}>
                                <SearchMatchBlock />
                            </Grid>
                        ) : null}
                    </Grid>
                </Container>
            </Box>
            {isLogged ? <RunningMatchesNotifer /> : null}
        </Box>
    );
};

export default HomePage;
