import React from "react";
import { Typography, Tooltip } from "@material-ui/core";
import CardParam from "./CardParam.js";
import { CARD_TYPES } from "../constants.js";

export const TypeParam = ({ typeIndex }) => {
    // const storing card type shortname at index 0, and fullname at index 1
    const cardTypeList = CARD_TYPES[typeIndex];
    return (
        <CardParam color="text.secondary">
            <Tooltip
                title={`Card type - ${cardTypeList[1]}`}
                disableFocusListener
                enterDelay={1500}
                leaveDelay={10}
            >
                <Typography variant="body1" align="center">
                    {cardTypeList[0]}
                </Typography>
            </Tooltip>
        </CardParam>
    );
};

export default TypeParam;
