import React, { useContext, useState } from "react";
import { Box, Typography, Collapse } from "@material-ui/core";

import { CARD_MARGIN_X } from "./constants.js";
import {
    SELECTABLE_ELEMENTS,
    CARD_IMAGES_PATH,
    SELECTED_ELEMENT_TEMPLATE,
} from "../../constants.js";
import { SelectedElementContext } from "../../matchContexts.js";
import AttackParam from "./cards_elements/AttackParam.js";
import HpParam from "./cards_elements/HpParam.js";
import TypeParam from "./cards_elements/TypeParam.js";
import RarityParam from "./cards_elements/RarityParam.js";

export const GameCard = ({ cardData, maxWidth }) => {
    const { selectedElement, setSelectedElement } = useContext(
        SelectedElementContext
    );
    const [showFull, setShowFull] = useState(false);

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
        <Box
            maxWidth={showFull ? "1" : maxWidth - CARD_MARGIN_X * 2}
            mx={CARD_MARGIN_X * 100 + "%"}
            onMouseOver={() => setShowFull(true)}
            onMouseOut={() => setShowFull(false)}
        >
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                width="1"
                border={2}
                borderRadius={8}
                borderColor={isSelected ? "warning.main" : "primary.main"}
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
                        <Box width={0.8} borderRadius={8} overflow="hidden">
                            <img
                                src={CARD_IMAGES_PATH + cardData.image}
                                title="Card image"
                                width="100%"
                                height="100%"
                            />
                        </Box>
                    </Box>
                </Collapse>
                {/* Block displaying statistics */}
                <Box
                    mt={0.5}
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    width="1"
                >
                    <AttackParam value={cardData.attack} isFull={showFull} />
                    <Box width={0.5} px={1}>
                        <TypeParam value={cardData.category} />
                        <Collapse in={showFull}>
                            <RarityParam value={cardData.rarity} />
                        </Collapse>
                    </Box>
                    <HpParam value={cardData.hp} isFull={showFull} />
                </Box>
            </Box>
        </Box>
    );
};

export default GameCard;
