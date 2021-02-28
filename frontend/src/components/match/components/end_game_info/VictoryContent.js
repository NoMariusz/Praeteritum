import React from "react";
import { Box, DialogTitle, DialogContent, Typography } from "@material-ui/core";
import MoodIcon from "@material-ui/icons/Mood";

export const VictoryContent = ({ playerName }) => (
    <>
        <DialogTitle>
            <Typography variant="h5" color="secondary" align="center">
                Victory!
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
                    <MoodIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6">
                    Congratulations {playerName}, you did it
                </Typography>
            </Box>
        </DialogContent>
    </>
);

export default VictoryContent;
