import React, { useState, useEffect } from "react";
import { Container, Grid, Box } from "@material-ui/core";

import { MATCH_CONNECTION_STATUSES } from "../constants.js";
import MatchLoading from "./MatchLoading.js";
import MatchConnectError from "./MatchConnectError.js";
import ChangeOrientationInfo from "./ChangeOrientationInfol.js";
import PlayerInfoMatchBlock from "./components/PlayerInfoMatchBlock.js";
import TurnsBlock from "./components/TurnsBlock.js";
import Board from "./components/Board.js";
import DecksCards from "./components/DecksCards.js";
import EnemyHand from "./components/EnemyHand.js";
import PlayerHand from "./components/PlayerHand.js";
import OptionsBlock from "./components/OptionsBlock.js";

export const Match = (props) => {
    let matchId = props.match.params.matchId;
    const [player, setPlayer] = useState("");
    const [enemy, setEnemy] = useState("");
    const [matchSocket, setMatchSocket] = useState(null);
    const [connectStatus, setConnectStatus] = useState(
        MATCH_CONNECTION_STATUSES.connecting
    );
    const [isLandscape, setIsLandscape] = useState(false);

    const checkScreenOrientation = () => {
        let isLanscapeMediaMatch = window.matchMedia("(orientation: landscape)")
            .matches;
        setIsLandscape(isLanscapeMediaMatch);
    };

    const renderBaseGame = () => {
        return isLandscape ? mainMatchComponent : <ChangeOrientationInfo />;
    };

    // socket connection
    if (matchSocket == null) {
        setMatchSocket(
            new WebSocket(`ws://${window.location.host}/match-api/${matchId}/`)
        );
    } else {
        matchSocket.onopen = (e) => {
            matchSocket.send(JSON.stringify({ message: "get-initial-data" }));
            matchSocket.send(JSON.stringify({ message: "client-connect" }));
            setConnectStatus(MATCH_CONNECTION_STATUSES.connected);
        };

        matchSocket.onclose = (e) => {
            console.warn("Match socket closed unexpectedly");
            setConnectStatus(MATCH_CONNECTION_STATUSES.canNotConnect);
        };

        matchSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(`websocket onmessage: ${data.message}`);
            switch (data.message.name) {
                case "get-initial-data":
                    setPlayer(data.message.data.players.player);
                    setEnemy(data.message.data.players.enemy);
                    break;
                case "client-connect":
                    console.log(`Client connect to socket: ${data.message.player}`);
            }
        };
    }

    // page orientation
    window.addEventListener("resize", checkScreenOrientation);
    useEffect(() => {
        checkScreenOrientation();
    });

    // rendering
    let mainMatchComponent = (
        <Box height="100vh" width="100vw">
            <Grid container>
                {/* Block at left frem board with player info, and round
                related stuff */}
                <Grid item xs>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        height="100vh"
                    >
                        <PlayerInfoMatchBlock player={enemy} />
                        <TurnsBlock />
                        <PlayerInfoMatchBlock player={player} />
                    </Box>
                </Grid>
                {/* Middle block with board */}
                <Grid item xs>
                    <Board />
                </Grid>
                {/* Right block with deck cards counter */}
                <Grid item xs>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                        justifyContent="center"
                        height="100%"
                    >
                        <DecksCards />
                    </Box>
                </Grid>
            </Grid>
            {/* Elements with absolute positions */}
            <EnemyHand />
            <PlayerHand />
            <OptionsBlock />
        </Box>
    );

    switch (connectStatus) {
        case MATCH_CONNECTION_STATUSES.connecting:
            return <MatchLoading />;
        case MATCH_CONNECTION_STATUSES.connected:
            return renderBaseGame();
        case MATCH_CONNECTION_STATUSES.canNotConnect:
            return <MatchConnectError />;
        default:
            return <MatchLoading />;
    }
};

export default Match;
