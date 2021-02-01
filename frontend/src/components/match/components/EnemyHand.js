import React from "react";
import { Box, Typography } from "@material-ui/core";

export const EnemyHand = () => {
    return (
        <Box position="absolute" top="0px" display="flex" justifyContent="center" width="1">
            <Box bgcolor="lightgray" p={3}>
                <Typography>EnemyHand</Typography>
            </Box>
        </Box>
    );
};

export default EnemyHand;
