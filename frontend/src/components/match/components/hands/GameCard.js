import React, { useState } from "react";
import { Box, Typography, Card } from "@material-ui/core";
import AttackParam from "./cards_elements/AttackParam.js";
import HpParam from "./cards_elements/HpParam.js";
import TypeParam from "./cards_elements/TypeParam.js";
import RarityParam from "./cards_elements/RarityParam.js";
import { CARD_MARGIN_X } from "../../../constants.js";

export const GameCard = ({ cardData, maxWidth }) => {
    const [showFull, setShowFull] = useState(true);
    return (
        <Box
            width={maxWidth - CARD_MARGIN_X * 2}
            mx={CARD_MARGIN_X * 100 + "%"}
        >
            <Card variant="outlined">
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    width="1"
                    border={1}
                    borderRadius={8}
                    borderColor="primary.main"
                    overflow="hidden"
                >
                    {/* Displaying card name */}
                    <Box
                        mb={1}
                        border={1}
                        borderRadius={8}
                        borderColor="primary.main"
                        bgcolor="primary.main"
                        color="primary.contrastText"
                    >
                        <Typography variant="body1" align="center" noWrap>
                            {cardData.name}
                        </Typography>
                    </Box>
                    {/* Block displaying statistics */}
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="flex-end"
                        width="1"
                    >
                        <AttackParam value={cardData.attack} />
                        <Box width={0.5} px={1}>
                            <TypeParam value={cardData.category} />
                            {/* <RarityParam value={cardData.rarity}/> */}
                        </Box>
                        <HpParam value={cardData.hp} />
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};

export default GameCard;
