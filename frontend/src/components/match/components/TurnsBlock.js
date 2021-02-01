import React from "react";
import { Container, Box, Typography } from "@material-ui/core";

export const TurnsBlock = () => {
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
                    TurnsBlock
                </Typography>
            </Box>
        </Container>
    );
};

export default TurnsBlock;
