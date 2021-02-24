import React from "react";
import { Box, Typography, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
    CARD_IMAGES_PATH,
    CARD_TYPES,
    SELECTABLE_ELEMENTS,
} from "../../constants.js";

const useStyles = makeStyles({
    backgroundUnitImage: {
        backgroundImage: (props) => props.path,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    },
});

export const Unit = ({ unitData, unitProps }) => {
    const imgPath = `url("${CARD_IMAGES_PATH + unitData.image}")`;
    // styles to set css
    const classes = useStyles({ path: imgPath });

    const belongsToPlayer = unitData.owner == unitProps.playerIndex;
    const cardColor = belongsToPlayer ? "primary.main" : "secondary.main";

    const isSelected =
        unitProps.selectedElement.id == unitData.id &&
        unitProps.selectedElement.type == SELECTABLE_ELEMENTS.unit;

    const handleClick = () => {
        // select unit when belongs to player 
        if (belongsToPlayer){
            unitProps.selectUnit(unitData.id);
        }
    };

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
            borderColor={isSelected ? "warning.main" : cardColor}
            overflow="hidden"
            bgcolor={cardColor}
            onClick={handleClick}
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

export default Unit;
