import React from "react";
import { Box, Grid, Button, Radio, CircularProgress } from "@material-ui/core";

export const TurnsBlock = ({ hasTurn, turnProgress }) => {
    const handleEndTurnClick = () => {
        console.log("Player try end turn");
    };

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
                            onClick={handleEndTurnClick}
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
