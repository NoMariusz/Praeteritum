import React, { useState, useEffect } from "react";
import { Grid, Box } from "@material-ui/core";

import {
    MATCH_CONNECTION_STATUSES,
    PLAYER_INFO_POSITIONS,
    SELECTABLE_ELEMENTS,
} from "./constants.js";
import MatchLoading from "./MatchLoading.js";
import MatchConnectError from "./MatchConnectError.js";
import ChangeOrientationInfo from "./ChangeOrientationInfol.js";
import PlayerInfoMatchBlock from "./components/PlayerInfoMatchBlock.js";
import TurnsBlock from "./components/TurnsBlock.js";
import Board from "./components/board/Board.js";
import DecksBlock from "./components/deck/DecksBlock.js";
import HandBlock from "./components/hands/HandBlock.js";
import OptionsBlock from "./components/OptionsBlock.js";
import InfoSnackbar from "./components/InfoSnackbar.js";

export const Match = (props) => {
    // sockets values
    let matchId = props.match.params.matchId;
    const [matchSocket, setMatchSocket] = useState(null);
    const [connectStatus, setConnectStatus] = useState(
        MATCH_CONNECTION_STATUSES.connecting
    );

    // game related values
    const playersDataTemplate = {
        username: "",
        base_points: 0,
        deck_cards_count: 0,
    };
    const playerDataTemplate = { ...playersDataTemplate, hand_cards: [] };
    const enemyDataTemplate = { ...playersDataTemplate, hand_cards_count: 0 };
    const [playerData, setPlayerData] = useState(playerDataTemplate);
    const [enemyData, setEnemyData] = useState(enemyDataTemplate);
    const [hasTurn, setHasTurn] = useState(false);
    const [turnProgress, setTurnProgress] = useState(0);
    const [fields, setFields] = useState([]);
    // selectedElement can represent card or unit
    const selectedELementTemplate = { type: -1, id: -1 };
    const [selectedElement, setSelectedElement] = useState(
        selectedELementTemplate
    );

    // snackbar values
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("Error");

    // rendering values
    const [isLandscape, setIsLandscape] = useState(false);

    // turns

    const endTurnCallback = () => {
        matchSocket.send(JSON.stringify({ message: "end-turn" }));
    };

    // snackbar

    const showSnackbar = (msg) => {
        setSnackbarMessage(msg);
        setSnackbarVisible(true);
    };

    const closeSnackbar = () => {
        setSnackbarVisible(false);
    };

    // playing a cards, selecting elements

    const clearSelection = () => {
        setSelectedElement(selectedELementTemplate);
    };

    const selectCard = (cardId) => {
        // select card if none or other is selected, unselect when try select
        // that seame card once again
        if (
            selectedElement.type != SELECTABLE_ELEMENTS.card ||
            selectedElement.id != cardId
        ) {
            setSelectedElement({
                type: SELECTABLE_ELEMENTS.card,
                id: cardId,
            });
        } else {
            clearSelection();
        }
    };

    const handleClickOnField = (fieldId) => {
        // play card if can
        if (selectedElement.type == SELECTABLE_ELEMENTS.card) {
            playCard(selectedElement.id, fieldId);
        }
    };

    const playCard = (cardId, fieldId) => {
        // send message to socket to play a card
        matchSocket.send(
            JSON.stringify({
                message: "play-a-card",
                data: { card_id: cardId, field_id: fieldId },
            })
        );
        clearSelection();
    };

    // rendering helpers

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
                    setFields(messageData.fields);
                    break;
                case "client-connect":
                    console.log(
                        `Client connect to socket: ${data.message.player}`
                    );
                    break;
                case "turn-changed":
                    setHasTurn(messageData.has_turn);
                    break;
                case "turn-progress-changed":
                    setTurnProgress(messageData.progress);
                    break;
                case "deck-cards-count-changed":
                    const setThatPlayerData = messageData.for_player
                        ? setPlayerData
                        : setEnemyData;
                    const newCount = messageData.new_count;
                    setThatPlayerData((prevState) => ({
                        ...prevState,
                        deck_cards_count: newCount,
                    }));
                    break;
                case "hand-cards-changed":
                    if (messageData.for_player) {
                        setPlayerData((prevState) => ({
                            ...prevState,
                            hand_cards: messageData.new_cards,
                        }));
                    } else {
                        setEnemyData((prevState) => ({
                            ...prevState,
                            hand_cards_count: messageData.new_count,
                        }));
                    }
                    break;
                case "play-a-card":
                    console.log("res", messageData.result);
                    if (messageData.result == false) {
                        showSnackbar("A card cannot be played  !");
                    }
                    break;
                default:
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

    const mainMatchComponent = (
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
                            endTurnCallback={endTurnCallback}
                        />
                        <PlayerInfoMatchBlock
                            playerData={playerData}
                            positionInBox={PLAYER_INFO_POSITIONS.bottom}
                        />
                    </Box>
                </Grid>
                {/* Middle block with board */}
                <Grid item xs>
                    <Board
                        fields={fields}
                        toField={{
                            selectedElement: selectedElement,
                            handleClickOnField: handleClickOnField,
                        }}
                    />
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
                        <DecksBlock
                            playerData={playerData}
                            enemyData={enemyData}
                        />
                    </Box>
                </Grid>
            </Grid>
            {/* Elements with absolute positions */}
            <HandBlock
                forMainPlayer={true}
                playerData={playerData}
                // data passed straight to card
                toCard={{
                    selectedElement: selectedElement,
                    selectCard: selectCard,
                }}
            />
            <HandBlock forMainPlayer={false} playerData={enemyData} />
            <OptionsBlock />
            <InfoSnackbar
                snackbarVisible={snackbarVisible}
                snackbarMessage={snackbarMessage}
                closeSnackbar={closeSnackbar}
            />
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
