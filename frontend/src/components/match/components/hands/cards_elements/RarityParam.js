import React from "react";
import { Box } from "@material-ui/core";
import StarsRoundedIcon from "@material-ui/icons/StarsRounded";
import { CARD_RARITIES_COLORS } from "../constants.js";

export const RarityParam = ({ value }) => {
    const color = CARD_RARITIES_COLORS[value];
    return (
        <Box display="flex" justifyContent="center">
            <StarsRoundedIcon style={{ color: color }} />
        </Box>
    );
};

export default RarityParam;
