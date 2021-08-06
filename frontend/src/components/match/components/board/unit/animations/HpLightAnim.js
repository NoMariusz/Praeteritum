import React from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { useClearState } from "src/utils";

const duration = 300;

// material-ui styles for animation
const useStyles = makeStyles({
    animated: {
        animation: `$componentAnim ${duration}ms ease-in-out`,
    },
    "@keyframes componentAnim": {
        "0%": {
            opacity: 1,
            transform: "scale(1)",
        },
        "20%": {
            opacity: 0.8,
            transform: "scale(0.85)",
        },
        "100%": {
            opacity: 1,
            transform: "scale(1)",
        },
    },
});

export const HpLightAnim = ({ show, setShow, children }) => {
    /* Wrapper handling unit animation */

    const classes = useStyles();

    // to reset animation after duration
    useClearState(show, setShow, true, false, duration);

    return (
        <Box
            width={1}
            height={1}
            className={clsx({ [classes.animated]: show })}
        >
            {children}
        </Box>
    );
};

export default HpLightAnim;
