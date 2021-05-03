import React from "react";
import {
    Box,
    Paper,
    Typography,
} from "@material-ui/core";

export const HelloBlock = () => {
    /* simple greeting block */

    return (
        <Box maxWidth="25rem">
            <Paper elevation={1}>
                <Box p={1}>
                    <Typography variant="h4" align="center">
                        Welcome
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default HelloBlock;
