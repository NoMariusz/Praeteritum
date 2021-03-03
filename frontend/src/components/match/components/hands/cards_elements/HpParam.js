import React from "react";
import { Typography } from "@material-ui/core";
import CardParam from "./CardParam.js";

export const HpParam = ({ hp, isFull }) => {
    return (
        <CardParam color="success.main">
            <Typography
                variant={isFull ? "h5" : "h6"}
                align="center"
            >
                {hp}
            </Typography>
        </CardParam>
    );
};

export default HpParam;
