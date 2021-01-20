import React, { useState } from "react";
import { Container, Grid, Box } from "@material-ui/core";

export const Game = (props) => {
    let matchId = props.match.params.matchId;

    return (
        <p>game: {matchId}</p>
    );
};

export default Game;
