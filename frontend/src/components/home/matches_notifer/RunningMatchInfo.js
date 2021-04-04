import React from "react";
import { Button, Paper, Typography, Box } from "@material-ui/core";
import {
    createMuiTheme,
    responsiveFontSizes,
    ThemeProvider,
} from "@material-ui/core/styles";

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

export const RunningMatchInfo = ({ matchInfo, goToMatchCallback }) => {
    return (
        <ThemeProvider theme={theme}>
            <Box width={{ xs: "10rem", sm: "20rem", md: "25rem" }}>
                <Paper elevation={3}>
                    <Box
                        width={1}
                        p={1}
                        display="flex"
                        justifyContent="flex-end"
                        flexDirection="column"
                    >
                        <Typography variant="subtitle1" align="center">
                            Running match...
                        </Typography>
                        <Typography
                            variant="h4"
                            color="primary"
                            align="center"
                            noWrap="false"
                        >
                            {matchInfo.players[0].username} vs{" "}
                            {matchInfo.players[1].username}
                        </Typography>
                        <Box mt={1} display="flex" justifyContent="flex-end">
                            <Button
                                onClick={() => {
                                    goToMatchCallback(matchInfo.id);
                                }}
                                variant="outlined"
                                color="secondary"
                                align="right"
                                size="small"
                            >
                                Reconnect
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default RunningMatchInfo;
