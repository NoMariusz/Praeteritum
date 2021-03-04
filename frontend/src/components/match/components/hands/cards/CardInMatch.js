import React, { useContext, useState } from "react";
import { Box, Slide } from "@material-ui/core";

import Card_ from "components/card/Card_.js";
import {
    SELECTABLE_ELEMENTS,
    SELECTED_ELEMENT_TEMPLATE,
} from "../../../constants.js";
import { SelectedElementContext } from "../../../matchContexts.js";
import CardSizeWrapper from "./CardSizeWrapper.js";

export const CardInMatch = ({ cardData, cardsCount }) => {
    /* adapt Card_ to work with match, handle card hover effect and selecting card */

    const { selectedElement, setSelectedElement } = useContext(
        SelectedElementContext
    );
    const [showFull, setShowFull] = useState(false);

    // to set card width relative to cards count in hand
    const minimizedCardWidth = `${Math.min(100 / cardsCount, 15)}%`;

    // selecting card stuff

    const isSelected =
        selectedElement.id == cardData.id &&
        selectedElement.type == SELECTABLE_ELEMENTS.card;

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
        // to change card size on hover
        <CardSizeWrapper
            showFull={showFull}
            minimizedCardWidth={minimizedCardWidth}
        >
            {/* to provide slide when new card is inserted */}
            <Slide direction="up" in>
                {/* to provide hover and margin between cards */}
                <Box
                    onMouseEnter={() => setShowFull(true)}
                    onMouseLeave={() => setShowFull(false)}
                    mx="3%"
                >
                    <Card_
                        cardData={cardData}
                        showFull={showFull}
                        isSelected={isSelected}
                        clickCallback={selectCard}
                    />
                </Box>
            </Slide>
        </CardSizeWrapper>
    );
};

export default CardInMatch;
