import React from "react";
import { Box, Typography, Tooltip } from "@material-ui/core";
import { CARD_TYPES, CARD_ATTRIBUTES_COLORS } from "components/card/constants";

export const BigUnit = ({
    clickCallback,
    unitData,
    highlight,
    tooltipContent,
    cardColor,
    classes,
}) => {
    return (
        <Box
            width={1}
            height={1}
            position="relative"
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
                title={tooltipContent}
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
                minHeight={0.28}
                m="1%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                {/* hp param */}
                <Box
                    width={0.3}
                    bgcolor={CARD_ATTRIBUTES_COLORS.attack}
                    color="error.contrastText"
                    borderRadius={8}
                >
                    <Typography variant="subtitle2" align="center">
                        {unitData.attack}
                    </Typography>
                </Box>
                {/* category param */}
                <Box
                    width={0.3}
                    bgcolor="text.secondary"
                    color="background.paper"
                    borderRadius={8}
                >
                    <Typography variant="subtitle2" align="center">
                        {CARD_TYPES[unitData.category].letter}
                    </Typography>
                </Box>
                {/* hp param */}
                <Box
                    width={0.3}
                    bgcolor={CARD_ATTRIBUTES_COLORS.hp}
                    color="primary.contrastText"
                    borderRadius={8}
                >
                    <Typography variant="subtitle2" align="center">
                        {unitData.hp}
                    </Typography>
                </Box>
            </Box>
            {/* energy param - show only if unit have some energy */}
            {unitData.energy > 0 && (
                <Box
                    position="absolute"
                    top={0}
                    right={0}
                    width="1rem"
                    height="1rem"
                    bgcolor={CARD_ATTRIBUTES_COLORS.energy}
                    color="primary.contrastText"
                    borderRadius="50%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography variant="subtitle2" align="center">
                        {unitData.energy}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default BigUnit;
