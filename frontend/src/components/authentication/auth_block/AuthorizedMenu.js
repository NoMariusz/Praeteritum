import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Grid, Typography } from "@material-ui/core";
import { getCSRF } from "../../../utils.js";

export const AuthorizedMenu = ({ username }) => {
    /* mini menu displaying when user is authenticated, enable to log out and
    display information and actions specified for only authorized users */

    const history = useHistory();

    const handleLogout = async () => {
        /* logout user from his session and redirect to home page */
        const reqOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRF(),
            },
        };
        await fetch("/authentication/logout", reqOptions);
        // force redirect to home page
        history.go(0);
    };

    return (
        <Grid container spacing={2}>
            <Grid item>
                <Typography variant="subtitle1">Welcome {username}</Typography>
            </Grid>
            <Grid item>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Grid>
        </Grid>
    );
};

export default AuthorizedMenu;
