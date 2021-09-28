import React from "react";
import { Typography, Tooltip } from "@material-ui/core";
import CardParam from "./CardParam";
import { CARD_TYPES } from "../constants";

export const TypeParam = ({ typeIndex }) => {
    // const storing card type shortname at index 0, and fullname at index 1
    const cardType = CARD_TYPES[typeIndex];
    return (
        <CardParam color="text.disabled">
            <Tooltip
                title={`Card type - ${cardType.name}`}
                disableFocusListener
                enterDelay={1500}
                leaveDelay={10}
            >
                <Typography variant="body1" align="center">
                    {cardType.letter}
                </Typography>
            </Tooltip>
        </CardParam>
    );
};

export default TypeParam;
