import React from "react";
import { Box, Typography } from "@material-ui/core";

export const PlayerHand = () => {
    return (
        <Box position="absolute" bottom="0px" display="flex" justifyContent="center" width="1">
            <Box bgcolor="lightgray" p={3}>
                <Typography>PlayerHand</Typography>
            </Box>
        </Box>
    );
};

export default PlayerHand;
