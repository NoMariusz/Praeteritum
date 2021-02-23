import React from "react";
import { Box } from "@material-ui/core";
import GameCard from "./GameCard.js";
import CoveredCard from "./CoveredCard.js";

export const HandBlock = ({ forMainPlayer, playerData, toCard }) => {
    const cards = forMainPlayer
        ? playerData.hand_cards
        : Array(playerData.hand_cards_count).fill(undefined);
    return (
        <Box
            position="absolute"
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
                maxWidth="80%"
            >
                {cards.map((card) =>
                    forMainPlayer ? (
                        <GameCard
                            cardData={card}
                            // set card width relative to cards count
                            maxWidth={Math.min(1 / cards.length, 0.3)}
                            toCard={toCard}
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
