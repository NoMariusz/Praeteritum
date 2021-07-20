import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import AuthorizedMenu from "./AuthorizedMenu";
import UnauthorizedMenu from "./UnauthorizedMenu";

export const AuthBlock = () => {
    /* block responsible for changing and displaying information about login
    session with server, enable user to login, register, logout */

    const [isLogged, setIsLogged] = useState(false);
    const [username, setUsername] = useState("???");

    const checkIfLogged = async () => {
        /* load to state information about player session status */
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        const res = await fetch(
            "/authentication/isAuthenticated",
            requestOptions
        );
        const data = await res.json();

        setIsLogged(data.isAuthenticated);
        setUsername(data.username);
    };

    useEffect(() => {
        checkIfLogged();
    }, []);

    return (
        <Box p={{ xs: 0.5, sm: 1, md: 2 }}>
            {isLogged ? (
                <AuthorizedMenu username={username} />
            ) : (
                <UnauthorizedMenu />
            )}
        </Box>
    );
};

export default AuthBlock;
