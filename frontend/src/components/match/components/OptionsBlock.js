import React from "react";
import { Box, Typography } from "@material-ui/core";

export const OptionsBlock = () => {
    return (
        <Box position="absolute" top="0px" right="0px" display="flex" justify="center">
            <Box bgcolor="lightgray" p={3}>
                <Typography>OptionsBlock</Typography>
            </Box>
        </Box>
    );
};

export default OptionsBlock;
