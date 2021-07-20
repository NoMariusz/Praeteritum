import React from "react";
import { Box, Typography, Collapse } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { CARD_IMAGES_PATH, HIGHLIGHT_COLOR } from "../match/constants";
import AttackParam from "./cards_elements/AttackParam";
import HpParam from "./cards_elements/HpParam";
import TypeParam from "./cards_elements/TypeParam";
import RarityParam from "./cards_elements/RarityParam";

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
                <Box flex="1 0 2rem">
                    <AttackParam attack={cardData.attack} isFull={showFull} />
                </Box>
                <Box px={0.5} flex="1 1 2rem">
                    <TypeParam typeIndex={cardData.category} />
                    <Collapse in={showFull}>
                        <RarityParam rarityIndex={cardData.rarity} />
                    </Collapse>
                </Box>
                <Box flex="1 0 2rem">
                    <HpParam hp={cardData.hp} isFull={showFull} />
                </Box>
            </Box>
        </Box>
    );
};
  
const compareFunction = (prevProps, nextProps) => {
    /* return true if props are equal */

    // cardData
    if (prevProps.cardData != nextProps.cardData) {
        return false;
    }

    // showFull
    if (prevProps.showFull != nextProps.showFull) {
        return false;
    }

    // isSelected
    if (prevProps.isSelected != nextProps.isSelected) {
        return false;
    }
    return true;
}

// to not render again card when nothing changed
export default React.memo(Card_, compareFunction);
