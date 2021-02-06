import React from "react";
import { Container, Box, Grid, Typography } from "@material-ui/core";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

export const PlayerInfoMatchBlock = (props) => {
    return (
        <Container>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={3}
            >
                <Grid container>
                    <Grid item>
                        <AccountCircleIcon color="primary" size="large" />
                    </Grid>
                    <Grid item>
                        <ThemeProvider theme={theme}>
                            <Typography variant={'h5'}>
                                {props.player}
                            </Typography>
                        </ThemeProvider>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default PlayerInfoMatchBlock;
