import React from "react";
import { Box, Tooltip, Typography } from "@material-ui/core";
import { CARD_TYPES } from "components/card/constants";

export const SmallUnit = ({
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
            borderRadius={4}
            border={0.5}
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
                    height={0.98}
                    borderRadius={8}
                    m="1%"
                    classes={{ root: classes.backgroundUnitImage }}
                />
            </Tooltip>
            {/* category param */}
            <Box
                position="absolute"
                top={0}
                bottom={0}
                width={1}
                height={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Box
                    minWidth={0.3}
                    borderRadius={8}
                    bgcolor={cardColor}
                    color="background.paper"
                >
                    <Typography variant="caption" align="center" component="p">
                        {CARD_TYPES[unitData.category].letter}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default SmallUnit;
