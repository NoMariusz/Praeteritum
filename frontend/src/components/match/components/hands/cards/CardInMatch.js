import React, { useContext, useState } from "react";
import { Box, Slide } from "@material-ui/core";

import Card_ from "components/card/Card_.js";
import {
    SELECTABLE_ELEMENTS,
    SELECTED_ELEMENT_TEMPLATE,
} from "../../../constants.js";
import { SelectedElementContext } from "../../../matchContexts.js";
import FullCardWrapper from "./FullCardWrapper.js";

export const CardInMatch = ({ cardData, cardsCount }) => {
    /* adapt Card_ to work with match, handle card hover effect and selecting card */

    const { selectedElement, setSelectedElement } = useContext(
        SelectedElementContext
    );
    const [showFull, setShowFull] = useState(false);

    // to set card width relative to cards count in hand
    const minimizedCardWidth = `${Math.min(100 / cardsCount, 15)}%`;

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

    const hoverableCard = (
        <Box
            onMouseOver={() => setShowFull(true)}
            onMouseOut={() => setShowFull(false)}
            mx="3%"
        >
            <Card_
                cardData={cardData}
                showFull={showFull}
                isSelected={isSelected}
                clickCallback={selectCard}
            />
        </Box>
    );

    return (
        <Slide direction="up" in>
            {/* conditionally wrap card in proper size wrapper */}
            {showFull ? (
                <FullCardWrapper minimizedCardWidth={minimizedCardWidth}>
                    {hoverableCard}
                </FullCardWrapper>
            ) : (
                <Box width={minimizedCardWidth}>{hoverableCard}</Box>
            )}
        </Slide>
    );
};

export default CardInMatch;
