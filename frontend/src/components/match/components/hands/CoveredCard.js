import React from "react";
import { Box, Typography, Card } from "@material-ui/core";

export const CoveredCard = () => {
    return (
        <Card variant="outlined">
            <Box
                display="flex"
                justifyContent="center"
                width="1"
            >
                <Box px={3} py={1}>
                    <Typography variant="h3" color="primary">?</Typography>
                </Box>
            </Box>
        </Card>
    );
};

export default  CoveredCard;
