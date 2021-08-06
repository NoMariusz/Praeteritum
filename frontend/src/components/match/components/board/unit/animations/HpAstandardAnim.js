import React from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { useClearState } from "src/utils";
import { ANIMS_COLORS } from "../../constants";

const duration = 500;

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
        "10%": {
            opacity: 0.7,
            transform: "rotate(0.01turn) scale(0.85)",
        },
        "20%": {
            opacity: 0.7,
            transform: "rotate(0turn) scale(0.85)",
        },
        "30%": {
            opacity: 0.7,
            transform: "rotate(-0.01turn) scale(0.85)",
        },
        "40%": {
            opacity: 0.7,
            transform: "rotate(0turn) scale(0.85)",
        },
        "100%": {
            opacity: 1,
            transform: "rotate(0turn) scale(1)",
        },
    },
    "@keyframes afterAnim": {
        "10%": {
            opacity: 0.5,
        },
        "100%": {
            opacity: 0,
        },
    },
});

export const HpStandardAnim = ({ show, setShow, children }) => {
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

export default HpStandardAnim;
