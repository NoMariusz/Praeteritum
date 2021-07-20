import React from "react";
import { Box } from "@material-ui/core";
import StarsRoundedIcon from "@material-ui/icons/StarsRounded";
import { CARD_RARITIES_COLORS } from "../constants";

export const RarityParam = ({ rarityIndex }) => {
    const color = CARD_RARITIES_COLORS[rarityIndex ];
    return (
        <Box display="flex" justifyContent="center">
            <StarsRoundedIcon style={{ color: color }} />
        </Box>
    );
};

export default RarityParam;
