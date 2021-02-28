import React from "react";
import { Box, DialogTitle, DialogContent, Typography } from "@material-ui/core";
import MoodBadIcon from "@material-ui/icons/MoodBad";

export const DefeatContent = ({ playerName }) => (
    <>
        <DialogTitle>
            <Typography variant="h5" color="secondary" align="center">
                Defeat!
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
                    <MoodBadIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6">
                    This time you failed, maybe another time it will be better{" "}
                    {playerName}
                </Typography>
            </Box>
        </DialogContent>
    </>
);

export default DefeatContent;
