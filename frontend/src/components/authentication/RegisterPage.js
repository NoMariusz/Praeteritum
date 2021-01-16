import React, { useState } from "react";
import {
    TextField,
    Grid,
    Button,
    Typography,
    Collapse,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import FormWrapper from "./FormWrapper";
import { getCSRF } from "../../utlis";

export const RegisterPage = (props) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password1, setPassword1] = useState("");
    const [error, setError] = useState(undefined);
    const passwordNotMatch = password !== password1;

    const handleRegister = () => {
        if (passwordNotMatch) {
            setError("Password not match");
        } else {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRF(),
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                }),
            };
            fetch("/authentication/register", requestOptions)
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        showError(data.error);
                    } else {
                        props.history.push(`/`);
                    }
                });
        }
    };

    const showError = (errorObj) => {
        console.log(errorObj);
        let errorMessage = "";
        for (const [key, value] of Object.entries(errorObj)) {
            errorMessage += `${key}: ${value.join(", ")} `;
        }
        errorMessage = errorMessage || "App error";
        setError(errorMessage);
    };

    return (
        <FormWrapper>
            <Grid container spacing={3} justify="center" alignItems="center">
                <Grid item xs={12}>
                    <Typography variant="h3" align="center">
                        Create an account
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Collapse in={error}>
                        <Alert
                            severity="error"
                            onClick={() => setError(undefined)}
                        >
                            {error}
                        </Alert>
                    </Collapse>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="userName"
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
                        id="email"
                        label="Email address"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="password"
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={passwordNotMatch}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="password1"
                        label="Password confirmation"
                        variant="outlined"
                        type="password"
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                        error={passwordNotMatch}
                        helperText={passwordNotMatch && "Password not match"}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            handleRegister();
                        }}
                        fullWidth
                    >
                        Register
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="overline" display="block">
                        Or if you have an account
                        <Button color="secondary" href="/login" size="small">
                            Sign in
                        </Button>
                    </Typography>
                </Grid>
            </Grid>
        </FormWrapper>
    );
};

export default RegisterPage;
