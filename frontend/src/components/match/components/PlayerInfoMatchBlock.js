import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import {PLAYER_INFO_POSITIONS} from "../constants.js";
import  { formatIfTooLong } from "../../../utils.js";

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

export const PlayerInfoMatchBlock = ({playerData, positionInBox}) => {
    let playerCard = <Grid container>
        <Grid item>
            <AccountCircleIcon color="primary" size="large" />
        </Grid>
        <Grid item>
            <ThemeProvider theme={theme}>
                <Typography variant={'h6'}>
                    {formatIfTooLong(playerData.username, 15)}
                </Typography>
            </ThemeProvider>
        </Grid>
    </Grid>

    let playerPoints = <Grid container alignItems="center" justify="flex-end">
        <ThemeProvider theme={theme}>
            <Grid item>
                <Typography variant={'h6'}>
                    BP:
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant={'h4'}>
                    {playerData.base_points}
                </Typography>
            </Grid>
        </ThemeProvider>
    </Grid>

    return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                p={"5%"}
            >
                {(positionInBox == PLAYER_INFO_POSITIONS.top) ? playerCard : playerPoints}
                {/* to make margin, without force centering block */}
                <Box mt={{xs: 0, sm: 3, md: 6}} width={1}>
                    {(positionInBox == PLAYER_INFO_POSITIONS.top) ? playerPoints : playerCard}
                </Box>
            </Box>
    );
};

export default PlayerInfoMatchBlock;
