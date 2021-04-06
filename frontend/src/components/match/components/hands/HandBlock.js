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
        >
            <Box
                display="flex"
                alignItems={forMainPlayer ? "flex-end" : "flex-start"}
                justifyContent="center"
                width="80%"
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

export default HandBlock;
