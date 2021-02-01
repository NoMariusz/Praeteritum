import React from "react";
import { Container, Box, Paper, Typography } from "@material-ui/core";
import StayPrimaryLandscapeIcon from "@material-ui/icons/StayPrimaryLandscape";

export const ChangeOrientationInfo = () => {
    return (
        <Container>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={3}
            >
                <Paper>
                    <Box m={4} align="center">
                        <StayPrimaryLandscapeIcon fontSize="large" />
                        <Typography variant="h5" align="center" color="primary">
                            Please, change your orientation to landscape
                        </Typography>
                        <Typography variant="subtitle1" align="center">
                            We can not display match correctly at portrair mode
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default ChangeOrientationInfo;
