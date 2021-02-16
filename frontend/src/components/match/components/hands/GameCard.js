import React, { useState } from "react";
import { Box, Typography, Card } from "@material-ui/core";
import AttackParam from "./cards_elements/AttackParam.js";
import HpParam from "./cards_elements/HpParam.js";
import TypeParam from "./cards_elements/TypeParam.js";
import RarityParam from "./cards_elements/RarityParam.js";

export const GameCard = ({ cardData, maxWidth }) => {
    const [showFull, setShowFull] = useState(true);
    return (
        <Box width={maxWidth}>
            <Card variant="outlined">
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    width="1"
                >
                    <Card variatn="outlined">
                        <Typography variant="h6" noWrap>
                            {cardData.name}
                        </Typography>
                    </Card>
                    {/* Block displaying statistics */}
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="flex-end"
                        width="1"
                    >
                        <AttackParam value={cardData.attack}/>
                        <Box>
                            <TypeParam value={cardData.category}/>
                            {/* <RarityParam value={cardData.rarity}/> */}
                        </Box>
                        <HpParam value={cardData.hp}/>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};

export default GameCard;
