import React, { useState } from "react";
import { Button, ButtonGroup, Box, Typography, Grid} from "@material-ui/core";
import { getCSRF } from "../../utlis";


export const AuthPanel = () => {
    const [isLogged, setIsLogged] = useState(false)
    const [username, setUsername] = useState("???")

    const checkIfLogged = () => {
        const requestOptions = {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        }
        fetch('/authentication/isAuthenticated', requestOptions)
        .then(res => res.json())
        .then(data => {
            setIsLogged(data.isAuthenticated)
            setUsername(data.username)
        })
    }

    const handleLogout = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': getCSRF()
            }
        }
        fetch("/authentication/logout", requestOptions)
        .then(_ => {checkIfLogged()})
    }

    checkIfLogged()

    return <Box p={[0, 1, 2]}>
        { !isLogged ? (
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
                        Welcome {username}
                    </Typography>
                </Grid>
                <Grid item>
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        onClick={() => {handleLogout()}}
                    >
                        Logout
                    </Button>
                </Grid>
            </Grid>
        )
        }
    </Box>
}


export default AuthPanel;
