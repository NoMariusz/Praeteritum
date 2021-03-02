import React from "react";
import { Typography } from "@material-ui/core";
import CardParam from "./CardParam.js";

export const AttackParam = ({ value, isFull }) => {
    return (
        <CardParam color="error.main">
            <Typography
                variant={isFull ? "h5" : "h6"}
                align="center"
            >
                {value}
            </Typography>
        </CardParam>
    );
};

export default AttackParam;
