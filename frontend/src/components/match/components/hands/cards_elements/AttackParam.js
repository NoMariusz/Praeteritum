import React from "react";
import { Typography } from "@material-ui/core";
import CardParam from "./CardParam.js";

export const AttackParam = ({ value, isFull }) => {
    return (
        <CardParam color="error.main">
            <Typography variant={isFull ? "h4" : "h5"} p={isFull ? "2" : "1"}>
                {value}
            </Typography>
        </CardParam>
    );
};

export default AttackParam;
