import React from "react";
import { Container, Box, Typography } from "@material-ui/core";

export const PlayerMatchBlock = () => {
    return (
        <Container>
            <Box
                bgcolor="lightgray"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={3}
            >
                <Typography>
                    PlayerMatchInfo
                </Typography>
            </Box>
        </Container>
    );
};

export default PlayerMatchBlock;
