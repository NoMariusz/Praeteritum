import { makeStyles } from "@material-ui/core/styles";
import { ANIMS_COLORS } from "../../constants";

export const UNIT_ANIMS = Object.freeze({
    hpLight: {
        name: "hpLight",
        duration: 300,
    },
    hpStandard: {
        name: "hpStandard",
        duration: 500,
    },
    hpHeavy: {
        name: "hpHeavy",
        duration: 1000,
    },
    buff: {
        name: "buff",
        duration: 800,
    },
    debuff: {
        name: "debuff",
        duration: 800,
    },
});

const UNIT_ANIMS_CODES = {
    hpLight: {
        animated: {
            animation: `$componentAnim ${UNIT_ANIMS.hpLight.duration}ms ease-in-out`,
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
    },
    hpStandard: {
        animated: {
            animation: `$componentAnim ${UNIT_ANIMS.hpStandard.duration}ms ease-in-out`,
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
                animation: `$afterAnim ${UNIT_ANIMS.hpStandard.duration}ms ease-in-out`,
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
    },
    hpHeavy: {
        animated: {
            animation: `$componentAnim ${UNIT_ANIMS.hpHeavy.duration}ms ease-in-out`,
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
                animation: `$afterAnim ${UNIT_ANIMS.hpHeavy.duration}ms ease-in-out`,
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
    },
    buff: {
        animated: {
            animation: `$componentAnim ${UNIT_ANIMS.buff.duration}ms ease-in-out`,
            "&::after": {
                position: "absolute",
                content: '""',
                top: "10%",
                bottom: "10%",
                left: "10%",
                right: "10%",
                borderRadius: "50%",
                opacity: 0,
                filter: "blur(0.3rem)",
                background: `${ANIMS_COLORS.buffYellow}`,
                animation: `$afterAnim ${UNIT_ANIMS.buff.duration}ms ease-in-out`,
            },
        },
        "@keyframes componentAnim": {
            "0%": {
                filter: "contrast(100%) brightness(100%)",
                transform: "scale(1)",
            },
            "40%": {
                filter: "contrast(100%) brightness(100%)",
                transform: "scale(1.01)",
            },
            "60%": {
                filter: "contrast(200%) brightness(150%)",
                transform: "scale(1.01)",
            },
            "80%": {
                filter: "contrast(100%) brightness(100%)",
                transform: "scale(1.01)",
            },
            "100%": {
                filter: "contrast(100%) brightness(100%)",
                transform: "scale(1)",
            },
        },
        "@keyframes afterAnim": {
            "0%": {
                opacity: 0,
            },
            "40%": {
                opacity: 1,
            },
            "80%": {
                opacity: 1,
            },
            "100%": {
                opacity: 0,
            },
        },
    },
    debuff: {
        animated: {
            animation: `$componentAnim ${UNIT_ANIMS.debuff.duration}ms ease-in-out`,
            "&::after": {
                position: "absolute",
                content: '""',
                top: "10%",
                bottom: "10%",
                left: "10%",
                right: "10%",
                borderRadius: "50%",
                opacity: 0,
                filter: "blur(0.3rem)",
                background: `${ANIMS_COLORS.debuffDark}`,
                animation: `$afterAnim ${UNIT_ANIMS.debuff.duration}ms ease-in-out`,
            },
        },
        "@keyframes componentAnim": {
            "0%": {
                filter: "contrast(100%) brightness(100%)",
                transform: "scale(1)",
            },
            "40%": {
                filter: "contrast(100%) brightness(100%)",
                transform: "scale(0.99)",
            },
            "60%": {
                filter: "contrast(50%) brightness(75%)",
                transform: "scale(0.99)",
            },
            "80%": {
                filter: "contrast(100%) brightness(100%)",
                transform: "scale(0.99)",
            },
            "100%": {
                filter: "contrast(100%) brightness(100%)",
                transform: "scale(1)",
            },
        },
        "@keyframes afterAnim": {
            "0%": {
                opacity: 0,
            },
            "40%": {
                opacity: 1,
            },
            "80%": {
                opacity: 1,
            },
            "100%": {
                opacity: 0,
            },
        },
    },
};

export const UNIT_ANIMS_STYLES = {
    hpLight: makeStyles(UNIT_ANIMS_CODES.hpLight),
    hpStandard: makeStyles(UNIT_ANIMS_CODES.hpStandard),
    hpHeavy: makeStyles(UNIT_ANIMS_CODES.hpHeavy),
    buff: makeStyles(UNIT_ANIMS_CODES.buff),
    debuff: makeStyles(UNIT_ANIMS_CODES.debuff),
};
