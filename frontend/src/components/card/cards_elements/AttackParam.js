import React from "react";
import { Typography } from "@material-ui/core";
import CardParam from "./CardParam";
import { CARD_ATTRIBUTES_COLORS } from "../constants";

export const AttackParam = ({ attack, isFull }) => {
    return (
        <CardParam color={CARD_ATTRIBUTES_COLORS.attack}>
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
