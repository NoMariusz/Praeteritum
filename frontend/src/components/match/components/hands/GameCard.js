import React, { useState } from "react";
import { Box, Typography, Card, Collapse } from "@material-ui/core";
import AttackParam from "./cards_elements/AttackParam.js";
import HpParam from "./cards_elements/HpParam.js";
import TypeParam from "./cards_elements/TypeParam.js";
import RarityParam from "./cards_elements/RarityParam.js";
import { CARD_MARGIN_X, CARD_IMAGES_PATH } from "../../../constants.js";

export const GameCard = ({ cardData, maxWidth }) => {
    const [showFull, setShowFull] = useState(false);
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
                border={1}
                borderRadius={8}
                borderColor="primary.main"
                overflow="hidden"
                bgcolor="white"
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
