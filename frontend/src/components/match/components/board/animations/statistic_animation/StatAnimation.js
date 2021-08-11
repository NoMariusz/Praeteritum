import React, { useState, useEffect } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { STAT_ANIM_DURATION } from "./constants";
import { CARD_ATTRIBUTES_COLORS } from "components/card/constants";

// material-ui styles for animation
const useStyles = makeStyles({
    animated: {
        animation: `$componentAnim ${STAT_ANIM_DURATION}ms ease-in-out`,
    },
    "@keyframes componentAnim": {
        "0%": {
            opacity: 0,
            transform: "translate(0, -30%)",
        },
        "30%": {
            opacity: 1,
            transform: "translate(0, 0)",
        },
        "70%": {
            opacity: 1,
            transform: "translate(0, 0)",
        },
        "100%": {
            opacity: 0,
            transform: "translate(0, 30%)",
        },
    },
});

export const StatAnimation = ({ statAnimManager }) => {
    /* Wrapper showing statistics changes */

    const [animData, setAnimData] = useState(null);

    const classes = useStyles();

    useEffect(() => {
        // subscribe only once to manager to enable him to start animations by
        // changing state
        statAnimManager.subscribeState(animData, setAnimData);
    }, []);

    const formatValue = (value) => (value > 0 ? "+" + value : value);

    return animData == null ? null : (
        <Box
            position="absolute"
            top="20%"
            bottom="20%"
            left="20%"
            right="20%"
            borderRadius="50%"
            bgcolor="#121212BB"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={CARD_ATTRIBUTES_COLORS[animData.attributeName]}
            className={classes.animated}
        >
            <Typography variant="h6" align="center" noWrap>
                {formatValue(animData.value)}
            </Typography>
        </Box>
    );
};

export default React.memo(StatAnimation);
