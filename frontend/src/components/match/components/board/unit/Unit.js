import React from "react";
import { Box, Typography, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
    CARD_IMAGES_PATH,
} from "../../../constants.js";
import { CARD_TYPES } from "components/card/constants.js";

const useStyles = makeStyles({
    backgroundUnitImage: {
        backgroundImage: (props) => props.path,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    },
});

export const Unit = ({
    clickCallback,
    unitData,
    highlight,
    belongsToPlayer,
}) => {
    // styles to set css
    const imgPath = `url("${CARD_IMAGES_PATH + unitData.image}")`;
    const classes = useStyles({ path: imgPath });

    const cardColor = belongsToPlayer ? "primary.main" : "secondary.main";

    return (
        <Box
            width={1}
            height={1}
            display="flex"
            direction="column"
            flexWrap="wrap"
            justify="space-between"
            alignItems="stretch"
            borderRadius={8}
            border={2}
            borderColor={highlight != null ? highlight : cardColor}
            overflow="hidden"
            bgcolor={cardColor}
            onClick={clickCallback}
        >
            <Tooltip
                title={unitData.name}
                disableFocusListener
                enterDelay={1500}
                leaveDelay={10}
            >
                <Box
                    width={0.98}
                    height={0.68}
                    borderRadius={8}
                    m="1%"
                    classes={{ root: classes.backgroundUnitImage }}
                />
            </Tooltip>
            <Box
                width={0.98}
                height={0.28}
                m="1%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Box
                    width={0.3}
                    bgcolor="error.main"
                    color="error.contrastText"
                    borderRadius={8}
                >
                    <Typography variant="subtitle2" align="center">
                        {unitData.attack}
                    </Typography>
                </Box>
                <Box
                    width={0.3}
                    bgcolor="text.secondary"
                    color="background.paper"
                    borderRadius={8}
                >
                    <Typography variant="subtitle2" align="center">
                        {CARD_TYPES[unitData.category][0]}
                    </Typography>
                </Box>
                <Box
                    width={0.3}
                    bgcolor="success.main"
                    color="primary.contrastText"
                    borderRadius={8}
                >
                    <Typography variant="subtitle2" align="center">
                        {unitData.hp}
                    </Typography>
                </Box>
            </Box>
        </Box>
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

    return true;
};

export default React.memo(Unit, compareFunction);
