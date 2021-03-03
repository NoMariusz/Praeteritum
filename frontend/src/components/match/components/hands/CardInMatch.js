import React, { useContext, useState } from "react";
import { Box, Slide } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { FULL_CARD_WIDTH } from "./constants.js";
import Card_ from "./Card_.js";
import {
    SELECTABLE_ELEMENTS,
    SELECTED_ELEMENT_TEMPLATE,
} from "../../constants.js";
import { SelectedElementContext } from "../../matchContexts.js";

// to make custom css styles
const useStyles = makeStyles({
    cardMinimized: {
        width: (props) => props.minimizedCardWidth,
    },
    cardFull: {
        width: FULL_CARD_WIDTH,
        margin: (props) => `0 ${props.fullCardXMargin}`,
        zIndex: "2",
    },
});

export const CardInMatch = ({ cardData, cardsCount }) => {
    /* adapt Card_ to work with match, handle card hover effect and selecting card */

    const { selectedElement, setSelectedElement } = useContext(
        SelectedElementContext
    );
    const [showFull, setShowFull] = useState(false);

    // to set card width relative to cards count in hand
    const minimizedCardWidth = `${Math.min(100 / cardsCount, 15)}%`;
    // to not affect positions of other cards while card is full
    const fullCardXMargin = `calc((${minimizedCardWidth} - ${FULL_CARD_WIDTH}) /2)`;

    const styleClasses = useStyles({
        minimizedCardWidth,
        fullCardXMargin,
    });

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
        <Slide direction="up" in>
            <Box
                onMouseOver={() => setShowFull(true)}
                onMouseOut={() => setShowFull(false)}
                classes={
                    showFull
                        ? { root: styleClasses.cardFull }
                        : { root: styleClasses.cardMinimized }
                }
            >
                {/* to provide margin between cards */}
                <Box mx="3%">
                    <Card_
                        cardData={cardData}
                        showFull={showFull}
                        isSelected={isSelected}
                        clickCallback={selectCard}
                    />
                </Box>
            </Box>
        </Slide>
    );
};

export default CardInMatch;
