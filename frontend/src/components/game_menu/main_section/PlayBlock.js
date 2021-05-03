import React from "react";
import { Link } from "react-router-dom";
import { Box, Paper, Button } from "@material-ui/core";

export const PlayBlock = () => {
    /* block redirecting to finding match section */

    return (
        <Box maxWidth="25rem">
            <Paper elevation={1}>
                <Box p={1}>
                    <Button
                        component={Link}
                        to="/menu/search"
                        underline="none"
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        Play now
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default PlayBlock;
