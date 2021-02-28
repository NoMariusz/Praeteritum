import React from "react";
import { Box, DialogTitle, DialogContent, Typography } from "@material-ui/core";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";

export const DrawContent = ({ playerName }) => (
    <>
        <DialogTitle>
            <Typography variant="h5" color="secondary" align="center">
                Draw!
            </Typography>
        </DialogTitle>
        <DialogContent dividers>
            <Box
                display="flex"
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Box m={2}>
                    <SentimentSatisfiedIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6">
                    This time the battle remained unresolved {playerName}
                </Typography>
            </Box>
        </DialogContent>
    </>
);

export default DrawContent;
