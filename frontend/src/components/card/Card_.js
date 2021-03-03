import React from "react";
import { Box, Typography, Collapse } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { CARD_IMAGES_PATH, HIGHLIGHT_COLOR } from "../match/constants.js";
import AttackParam from "./cards_elements/AttackParam.js";
import HpParam from "./cards_elements/HpParam.js";
import TypeParam from "./cards_elements/TypeParam.js";
import RarityParam from "./cards_elements/RarityParam.js";

// to make custom css styles
const useStyles = makeStyles({
    cardImage: {
        backgroundImage: (props) => props.path,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    },
});

export const Card_ = ({
    cardData,
    showFull,
    isSelected,
    clickCallback,
}) => {
    /* display card with given data in full or minimized informations */

    // making styles for cards elements
    const imgPath = `url("${CARD_IMAGES_PATH + cardData.image}")`;

    const styleClasses = useStyles({
        path: imgPath,
    });

    const onCardClick = () => {
        clickCallback(cardData.id);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            width={1}
            border={2}
            borderRadius={8}
            borderColor={isSelected ? HIGHLIGHT_COLOR : "primary.main"}
            overflow="hidden"
            bgcolor="white"
            onClick={onCardClick}
        >
            {/* Displaying card name */}
            <Box
                borderRadius={8}
                p={showFull ? 0.5 : 0}
                color="primary.main"
            >
                <Typography
                    variant={showFull ? "h6" : "body1"}
                    align="center"
                    noWrap
                >
                    {cardData.name}
                </Typography>
            </Box>
            {/* Block with card image */}
            <Collapse in={showFull}>
                <Box width={1} mt={0.5} display="flex" justifyContent="center">
                    <Box
                        width={0.8}
                        height="5rem"
                        borderRadius={8}
                        classes={{ root: styleClasses.cardImage }}
                    />
                </Box>
            </Collapse>
            {/* Block displaying statistics */}
            <Box
                mt={0.5}
                display="flex"
                flexDirection="row"
                justifyContent="space-evenly"
                alignItems="flex-end"
                width="1"
            >
                <AttackParam attack={cardData.attack} isFull={showFull} />
                <Box px={0.5} flex="1">
                    <TypeParam typeIndex={cardData.category} />
                    <Collapse in={showFull}>
                        <RarityParam rarityIndex={cardData.rarity} />
                    </Collapse>
                </Box>
                <HpParam hp={cardData.hp} isFull={showFull} />
            </Box>
        </Box>
    );
};

export default Card_;
