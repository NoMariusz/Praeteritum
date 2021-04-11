import React from "react";
import { Box } from "@material-ui/core";
import CardInMatch from "./cards/CardInMatch.js";
import CoveredCard from "./cards/CoveredCard.js";

export const HandBlock = ({ forMainPlayer, playerData }) => {
    const cards = forMainPlayer
        ? playerData.hand_cards
        : Array(playerData.hand_cards_count).fill(undefined);
    return (
        <Box
            position="fixed"
            bottom={forMainPlayer ? "0px" : ""}
            top={forMainPlayer ? "" : "0px"}
            display="flex"
            justifyContent="center"
            width="1"
            height={0}
        >
            <Box
                display="flex"
                alignItems={forMainPlayer ? "flex-end" : "flex-start"}
                justifyContent="center"
                width="80%"
                height={0}
            >
                {cards.map((card) =>
                    forMainPlayer ? (
                        <CardInMatch
                            cardData={card}
                            cardsCount={cards.length}
                            key={card.id}
                        />
                    ) : (
                        <CoveredCard />
                    )
                )}
            </Box>
        </Box>
    );
};

const compareFunction = (prevProps, nextProps) => {
    /* return true if props are equal */

    if (prevProps.forMainPlayer != nextProps.forMainPlayer) {
        return false;
    }

    // if props for enemy
    if (!nextProps.forMainPlayer) {
        if (
            nextProps.playerData.hand_cards_count !=
            prevProps.playerData.hand_cards_count
        ) {
            return false;
        }
    }
    // if props for main player
    else {
        if (
            nextProps.playerData.hand_cards.length !=
            prevProps.playerData.hand_cards.length
        ) {
            return false;
        }
        if (
            !nextProps.playerData.hand_cards.every((newCard) =>
                prevProps.playerData.hand_cards.some(
                    (oldCard) => newCard.id == oldCard.id
                )
            )
        ) {
            return false;
        }
    }

    return true;
};

export default React.memo(HandBlock, compareFunction);
