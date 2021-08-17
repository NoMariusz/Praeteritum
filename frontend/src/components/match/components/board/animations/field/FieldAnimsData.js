import { makeStyles } from "@material-ui/core/styles";
import { ANIMS_COLORS } from "../../constants";

export const FIELD_ANIMS = Object.freeze({
    death: {
        name: "death",
        duration: 800,
    },
    went: {
        name: "went",
        duration: 100,
    },
});

const FIELD_ANIMS_CODES = {
    death: {
        animated: {
            "&::after": {
                position: "absolute",
                content: '""',
                top: "10%",
                bottom: "10%",
                left: "10%",
                right: "10%",
                borderRadius: "30%",
                opacity: 0,
                filter: "blur(0.75rem)",
                background: `${ANIMS_COLORS.heavyRed}`,
                animation: `$afterAnim ${FIELD_ANIMS.death.duration}ms ease-in-out`,
            },
        },
        "@keyframes afterAnim": {
            "0%": {
                opacity: 0,
            },
            "5%": {
                opacity: 1,
            },
            "35%": {
                opacity: 1,
            },
            "100%": {
                opacity: 0,
            },
        },
    },
    went: {
        animated: {
            "&::after": {
                position: "absolute",
                content: '""',
                top: "20%",
                bottom: "20%",
                left: "20%",
                right: "20%",
                borderRadius: "50%",
                opacity: 0,
                filter: "blur(1rem)",
                background: `${ANIMS_COLORS.debuffDark}`,
                animation: `$afterAnim ${FIELD_ANIMS.went.duration}ms ease-in-out`,
            },
        },
        "@keyframes afterAnim": {
            "0%": {
                opacity: 1,
            },
            "10%": {
                opacity: 1,
            },
            "100%": {
                opacity: 0,
            },
        },
    },
};

export const FIELD_ANIMS_STYLES = {
    death: makeStyles(FIELD_ANIMS_CODES.death),
    went: makeStyles(FIELD_ANIMS_CODES.went),
};
