import React from "react";
import { Box } from "@material-ui/core";
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";

import { FULL_CARD_WIDTH } from "../constants.js";

// to make custom css styles
const useStyles = makeStyles({
    transition: {
        transition: (props) => props.allTransition,
    },
});

// to have access to theme
const theme = createMuiTheme();

export const CardSizeWrapper = ({ showFull, minimizedCardWidth, children }) => {
    /* set width and margins to be minimized or full depending on the showFull
    prop and provide transitions for size changes */

    // make transition to better animate size changes
    const allTransition = theme.transitions.create("all", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    });

    // make styles with transition
    const styles = useStyles({ allTransition });

    // calculate special margins to not affect positions of other cards in
    // hand when card is full
    const fullCardXMargin = `calc((${minimizedCardWidth} - ${FULL_CARD_WIDTH}) /2)`;

    return (
        <Box
            width={showFull ? FULL_CARD_WIDTH : minimizedCardWidth}
            mx={showFull ? fullCardXMargin : ""}
            zIndex={showFull ? "2" : ""}
            classes={{ root: styles.transition }}
        >
            {children}
        </Box>
    );
};

export default CardSizeWrapper;
