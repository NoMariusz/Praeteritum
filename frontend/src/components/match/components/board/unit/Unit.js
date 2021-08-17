import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { CARD_IMAGES_PATH } from "../../../constants";
import SmallUnit from "./SmallUnit";
import BigUnit from "./BigUnit";

const useStyles = makeStyles({
    backgroundUnitImage: {
        backgroundImage: (props) => props.path,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    },
});

export const Unit = ({ showSmall, belongsToPlayer, ...props }) => {
    // styles to set css
    const imgPath = `url("${CARD_IMAGES_PATH + props.unitData.image}")`;
    const classes = useStyles({ path: imgPath });

    const cardColor = belongsToPlayer ? "primary.main" : "secondary.main";

    return showSmall ? (
        <SmallUnit {...props} cardColor={cardColor} classes={classes} />
    ) : (
        <BigUnit {...props} cardColor={cardColor} classes={classes} />
    );
};

const compareFunction = (prevProps, nextProps) => {
    /* return true if props are equal */

    // unitData
    if (prevProps.unitData != nextProps.unitData) {
        return false;
    }

    // highlight
    if (prevProps.highlight != nextProps.highlight) {
        return false;
    }

    // belongsToPlayer
    if (prevProps.belongsToPlayer != nextProps.belongsToPlayer) {
        return false;
    }

    // showSmall
    if (prevProps.showSmall != nextProps.showSmall) {
        return false;
    }

    return true;
};

export default React.memo(Unit, compareFunction);
