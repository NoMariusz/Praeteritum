import React from "react";
import { Button, ButtonGroup, Box, Typography, Grid } from "@material-ui/core";
import { getCSRF } from "../../utils";

export const AuthPanel = (props) => {
    const handleLogout = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRF(),
            },
        };
        fetch("/authentication/logout", requestOptions).then((_) => {
            props.checkIfLogged();
        });
    };

    return (
        <Box p={[0, 1, 2]}>
            {!props.isLogged ? (
                <ButtonGroup
                    variant="text"
                    color="secondary"
                    aria-label="auth button group"
                >
                    <Button href="/login">Login</Button>
                    <Button href="/register">Register</Button>
                </ButtonGroup>
            ) : (
                <Grid container spacing={2}>
                    <Grid item>
                        <Typography variant="subtitle1">
                            Welcome {props.username}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                                handleLogout();
                            }}
                        >
                            Logout
                        </Button>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default AuthPanel;
