import React from "react";
import { Typography } from "@material-ui/core";
import CardParam from "./CardParam";
import { CARD_ATTRIBUTES_COLORS } from "../constants";

export const HpParam = ({ hp, isFull }) => {
    return (
        <CardParam color={CARD_ATTRIBUTES_COLORS.hp}>
            <Typography variant={isFull ? "h5" : "h6"} align="center">
                {hp}
            </Typography>
        </CardParam>
    );
};

export default HpParam;
