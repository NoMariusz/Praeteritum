import React from "react";
import { Box, Typography, Card } from "@material-ui/core";

export const Deck = ({ playerData }) => {
    return (
        <Box width={1} height={1} m={{ xs: 0, sm: 1 }}>
            <Card variant="outlined">
                <Box
                    bgcolor="primary.main"
                    color="primary.contrastText"
                    p={{ xs: 0, sm: 2, md: 3 }}
                >
                    <Typography variant="h6">Cards left:</Typography>
                    <Typography variant="h4">
                        {playerData.deck_cards_count}
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
};

export default Deck;
