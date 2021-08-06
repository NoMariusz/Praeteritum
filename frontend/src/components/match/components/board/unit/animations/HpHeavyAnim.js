import React from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { useClearState } from "src/utils";
import { ANIMS_COLORS } from "../../constants";

const duration = 1000;

// material-ui styles for animation
const useStyles = makeStyles({
    animated: {
        animation: `$componentAnim ${duration}ms ease-in-out`,
        "&::after": {
            position: "absolute",
            content: '""',
            top: "10%",
            bottom: "10%",
            left: "10%",
            right: "10%",
            borderRadius: "50%",
            opacity: 0,
            filter: "blur(1rem)",
            background: `${ANIMS_COLORS.heavyRed}`,
            animation: `$afterAnim ${duration}ms ease-in-out`,
        },
    },
    "@keyframes componentAnim": {
        "0%": {
            opacity: 1,
            transform: "rotate(0turn) scale(1)",
        },
        "5%": {
            opacity: 0.7,
            transform: "rotate(0turn) scale(0.75)",
        },
        "10%": {
            opacity: 0.7,
            transform: "rotate(0.03turn) scale(0.75)",
        },
        "20%": {
            opacity: 0.7,
            transform: "rotate(0turn) scale(0.75)",
        },
        "30%": {
            opacity: 0.7,
            transform: "rotate(-0.03turn) scale(0.75)",
        },
        "40%": {
            opacity: 0.7,
            transform: "rotate(0turn) scale(0.75)",
        },
        "100%": {
            opacity: 1,
            transform: "rotate(0turn) scale(1)",
        },
    },
    "@keyframes afterAnim": {
        "5%": {
            opacity: 1,
        },
        "40%": {
            opacity: 1,
        },
        "100%": {
            opacity: 0,
        },
    },
});

export const HpHeavyAnim = ({ show, setShow, children }) => {
    /* Wrapper handling unit animation */

    const classes = useStyles();

    // to reset animation after duration
    useClearState(show, setShow, true, false, duration);

    return (
        <Box
            width={1}
            height={1}
            position="relative"
            className={clsx({ [classes.animated]: show })}
        >
            {children}
        </Box>
    );
};

export default HpHeavyAnim;
