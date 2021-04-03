import React from "react";
import { Button, Paper, Typography, Box } from "@material-ui/core";

export const RunningMatchInfo = ({ matchInfo, goToMatchCallback }) => {
    return (
        <Paper>
            <Box
                p={1}
                display="flex"
                justifyContent="flex-end"
                flexDirection="column"
            >
                <Typography variant="subtitle1" align="center">
                    Running match...
                </Typography>
                <Typography variant="h4" color="primary" align="center">
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
    );
};

export default RunningMatchInfo;
