import React, { useState } from "react";
import { 
    TextField, Grid, Button, Typography, Collapse
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import FormWrapper from "./FormWrapper";
import { getCSRF } from "../../utlis";


export const LoginPage = (props) => {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState(undefined);

    const handleLogin = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': getCSRF()
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }
        fetch('/authentication/login', requestOptions)
        .then(res => {
            if (res.ok){
                props.history.push(`/`);
            } else {
                setError("Username and password not match")
            }
        })
    }

    return <FormWrapper>
        <Grid container spacing={3} justify="center" alignItems="center">
            <Grid item xs={12}>
                <Typography variant="h3" align="center">
                    Sign in
                </Typography>
            </Grid>
                <Grid item xs={12}>
                    <Collapse in={error}>
                        <Alert 
                            severity='error' 
                            onClick={() => setError(undefined)}
                        >
                            {error}
                        </Alert>
                    </Collapse>
                </Grid>
            <Grid item xs={12}>
                <TextField 
                    required id="userName" 
                    label="Username"
                    variant="outlined"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    autoFocus
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <TextField 
                    required id="password" 
                    label="Password" 
                    variant="outlined"
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => {handleLogin()}} 
                    fullWidth
                >
                    Sign in
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="overline" display="block">
                    Or if you want to create an account 
                    <Button 
                        color="secondary" 
                        href="/register"
                        size="small"
                    >
                        Register
                    </Button>
                </Typography>
            </Grid>
        </Grid>
    </FormWrapper>
}


export default LoginPage;
