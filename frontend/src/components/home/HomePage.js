import React, { useState } from "react";
import { Container, Grid, Box } from "@material-ui/core";
import HomeNavBar from "./HomeNavBar";
import SearchMatchPanel from "./SearchMatchPanel";

export const HomePage = (props) => {
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

    const goToMatchCallback = (matchId) => {
        props.history.push(`/match/${matchId}`);
    }

    checkIfLogged();

    return (
        <Box>
            <HomeNavBar
                isLogged={isLogged}
                username={username}
                checkIfLogged={checkIfLogged}
            />
            <Box mt={3} />
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
                            <SearchMatchPanel goToMatchCallback={goToMatchCallback}/>
                        </Grid>
                    ) : null}
                </Grid>
            </Container>
        </Box>
    );
};

export default HomePage;
