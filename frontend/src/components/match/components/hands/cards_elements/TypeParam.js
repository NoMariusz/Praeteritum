import React from "react";
import { Typography, Tooltip } from "@material-ui/core";
import CardParam from "./CardParam.js";
import { CARD_TYPES } from "../../../../constants.js";

export const TypeParam = ({ value }) => {
    // const storing card type shortname at index 0, adn fullname at index 1
    const cardTypeList = CARD_TYPES[value];
    return (
        <CardParam color="text.secondary">
            <Tooltip title={`Card rarity - ${cardTypeList[1]}`}>
                <Typography variant="body1" align="center">{cardTypeList[0]}</Typography>
            </Tooltip>
        </CardParam>
    );
};

export default TypeParam;
