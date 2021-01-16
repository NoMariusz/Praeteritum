import React, { useState } from "react";
import { Container, Grid, Box } from "@material-ui/core";
import HomeNavBar from "./HomeNavBar";
import FindMatchPanel from "./FindMatchPanel";

export const HomePage = () => {
    const [isLogged, setIsLogged] = useState(false);
    const [username, setUsername] = useState("???");

    const checkIfLogged = () => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/authentication/isAuthenticated", requestOptions)
            .then((res) => res.json())
            .then((data) => {
                setIsLogged(data.isAuthenticated);
                setUsername(data.username);
            });
    };

    checkIfLogged();

    return (
        <Box>
            <HomeNavBar
                isLogged={isLogged}
                username={username}
                checkIfLogged={checkIfLogged}
            />
            <Box mt={3} />            {/* To make margin */}
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
                            <FindMatchPanel />
                        </Grid>
                    ) : null}
                </Grid>
            </Container>
        </Box>
    );
};

export default HomePage;
