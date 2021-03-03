import React from "react";
import { Box } from "@material-ui/core";

import { FULL_CARD_WIDTH } from "../constants.js";

export const FullCardWrapper = ({ minimizedCardWidth, children }) => {
    /* set witdh and margins that show card widely and not affect to other
    cards position in hand */

    // set special margins to not affect positions of other cards in hand
    const fullCardXMargin = `calc((${minimizedCardWidth} - ${FULL_CARD_WIDTH}) /2)`;

    return (
        <Box width={FULL_CARD_WIDTH} mx={fullCardXMargin} zIndex="2">
            {children}
        </Box>
    );
};

export default FullCardWrapper;
