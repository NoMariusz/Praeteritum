import React from "react";
import { Button, ButtonGroup } from "@material-ui/core";

export const UnauthorizedMenu = () => {
    /* mini menu displaying when user is not authenticated, enable to log in
    and register */

    return (
        <ButtonGroup
            variant="text"
            color="secondary"
            aria-label="auth button group"
        >
            <Button href="/login">Login</Button>
            <Button href="/register">Register</Button>
        </ButtonGroup>
    );
};

export default UnauthorizedMenu;
