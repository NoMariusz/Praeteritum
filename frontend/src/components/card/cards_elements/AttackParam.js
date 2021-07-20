import React from "react";
import { Typography } from "@material-ui/core";
import CardParam from "./CardParam";

export const AttackParam = ({ attack, isFull }) => {
    return (
        <CardParam color="error.main">
            <Typography
                variant={isFull ? "h5" : "h6"}
                align="center"
            >
                {attack}
            </Typography>
        </CardParam>
    );
};

export default AttackParam;
