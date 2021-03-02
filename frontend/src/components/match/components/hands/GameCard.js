import React, { useContext, useState } from "react";
import { Box, Typography, Collapse, Slide } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { CARD_MARGIN_X } from "./constants.js";
import {
    SELECTABLE_ELEMENTS,
    CARD_IMAGES_PATH,
    SELECTED_ELEMENT_TEMPLATE,
    HIGHLIGHT_COLOR,
} from "../../constants.js";
import { SelectedElementContext } from "../../matchContexts.js";
import AttackParam from "./cards_elements/AttackParam.js";
import HpParam from "./cards_elements/HpParam.js";
import TypeParam from "./cards_elements/TypeParam.js";
import RarityParam from "./cards_elements/RarityParam.js";

// to make own css styles
const useStyles = makeStyles({
    cardImage: {
        backgroundImage: (props) => props.path,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    }
});

export const GameCard = ({ cardData, maxCardWidth }) => {
    const { selectedElement, setSelectedElement } = useContext(
        SelectedElementContext
    );
    const [showFull, setShowFull] = useState(false);

    // making styles for cards elements
    const imgPath = `url("${CARD_IMAGES_PATH + cardData.image}")`;
    const styleClasses = useStyles({ path: imgPath });

    const isSelected =
        selectedElement.id == cardData.id &&
        selectedElement.type == SELECTABLE_ELEMENTS.card;

    const onCardClick = () => {
        selectCard(cardData.id);
    };

    const selectCard = (cardId) => {
        /* select card if none or other is selected, unselect when try select
        that same card once again */
        if (
            selectedElement.type != SELECTABLE_ELEMENTS.card ||
            selectedElement.id != cardId
        ) {
            setSelectedElement({
                type: SELECTABLE_ELEMENTS.card,
                id: cardId,
            });
        } else {
            // clear selection
            setSelectedElement(SELECTED_ELEMENT_TEMPLATE);
        }
    };

    return (
        <Slide direction="up" in>
            <Box
                maxWidth={showFull ? "10rem" : maxCardWidth - CARD_MARGIN_X * 2}
                mx={CARD_MARGIN_X * 100 + "%"}
                onMouseOver={() => setShowFull(true)}
                onMouseOut={() => setShowFull(false)}
            >
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
                        <Box
                            width={1}
                            mt={0.5}
                            display="flex"
                            justifyContent="center"
                        >
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
                        <AttackParam
                            value={cardData.attack}
                            isFull={showFull}
                        />
                        <Box px={0.5} flex="1">
                            <TypeParam value={cardData.category} />
                            <Collapse in={showFull}>
                                <RarityParam value={cardData.rarity} />
                            </Collapse>
                        </Box>
                        <HpParam value={cardData.hp} isFull={showFull} />
                    </Box>
                </Box>
            </Box>
        </Slide>
    );
};

export default GameCard;
