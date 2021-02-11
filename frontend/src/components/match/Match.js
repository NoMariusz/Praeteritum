import React, { useState, useEffect } from "react";
import { Container, Grid, Box } from "@material-ui/core";

import {
    MATCH_CONNECTION_STATUSES,
    PLAYER_INFO_POSITIONS,
} from "../constants.js";
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

    const [matchSocket, setMatchSocket] = useState(null);
    const [connectStatus, setConnectStatus] = useState(
        MATCH_CONNECTION_STATUSES.connecting
    );

    const [playerData, setPlayerData] = useState({ username: "" });
    const [enemyData, setEnemyData] = useState({ username: "" });
    const [hasTurn, setHasTurn] = useState(false);
    const [turnProgress, setTurnProgress] = useState(0);

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
            console.log(`websocket onmessage: ${data.message.name}`);

            const messageData = data.message.data;
            console.log("message data: ", data.message.data);
            switch (data.message.name) {
                case "get-initial-data":
                    setPlayerData(messageData.players_data.player);
                    setEnemyData(messageData.players_data.enemy);
                    setHasTurn(messageData.has_turn);
                    break;
                case "client-connect":
                    console.log(
                        `Client connect to socket: ${data.message.player}`
                    );
                    break;
                case "turn_changed":
                    setHasTurn(messageData.has_turn);
                    break;
                case "turn_progress_changed":
                    setTurnProgress(messageData.progress);
                    break;
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
                        <PlayerInfoMatchBlock
                            playerData={enemyData}
                            positionInBox={PLAYER_INFO_POSITIONS.top}
                        />
                        <TurnsBlock
                            hasTurn={hasTurn}
                            turnProgress={turnProgress}
                        />
                        <PlayerInfoMatchBlock
                            playerData={playerData}
                            positionInBox={PLAYER_INFO_POSITIONS.bottom}
                        />
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
