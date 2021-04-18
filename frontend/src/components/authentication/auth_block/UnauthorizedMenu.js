import React from "react";
import { Button, ButtonGroup } from "@material-ui/core";

export const UnauthorizedMenu = () => {
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
