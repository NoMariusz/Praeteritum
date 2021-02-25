import React, { useContext } from "react";
import { Box, Grid, Button, Radio, CircularProgress } from "@material-ui/core";
import { PlayerIndexContext } from "../matchContexts.js";

export const TurnsBlock = ({ matchSocket, turn, turnProgress }) => {
    // context values
    const playerIndex = useContext(PlayerIndexContext);

    const hasTurn = turn == playerIndex;

    const endTurn = () => {
        matchSocket.send(JSON.stringify({ message: "end-turn" }));
    }

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            m={"3%"}
        >
            <Grid
                container
                direction="column"
                alignItems="flex-end"
                justify="space-between"
            >
                <Grid item>
                    <Radio checked={!hasTurn} />
                </Grid>
                <Grid item>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <CircularProgress
                            variant="determinate"
                            value={turnProgress}
                        />
                        <Button
                            onClick={endTurn}
                            disabled={!hasTurn}
                            variant="outlined"
                            color="primary"
                        >
                            End turn
                        </Button>
                    </Box>
                </Grid>
                <Grid item>
                    <Radio checked={hasTurn} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default TurnsBlock;
