import React, { useContext, useState, useEffect } from "react";
import { Box, Grid, Button, Radio, CircularProgress } from "@material-ui/core";
import { PlayerIndexContext } from "../matchContexts.js";

export const TurnsBlock = ({ matchSocket, turn }) => {
    // context values
    const playerIndex = useContext(PlayerIndexContext);
    // states
    const [turnProgress, setTurnProgress] = useState(0);

    const hasTurn = turn == playerIndex;

    const endTurn = () => {
        matchSocket.send(JSON.stringify({ message: "end-turn" }));
    }

    // handle websocket event to change turn progress
    const matchSocketMessageHandler = (e) => {
        const data = JSON.parse(e.data);
        const messageData = data.message.data;

        switch (data.message.name) {
            case "turn-progress-changed":
                setTurnProgress(messageData.progress);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        // connect to socket messages
        matchSocket.addEventListener("message", matchSocketMessageHandler);
        return () => {
            // to delete listener for deleted components
            matchSocket.removeEventListener("message", matchSocketMessageHandler);
        }
    })

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
