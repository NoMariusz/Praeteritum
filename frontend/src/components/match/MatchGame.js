import React, { useState, useEffect } from "react";
import { Grid, Box } from "@material-ui/core";

import MatchLoading from "./MatchLoading.js";
import { PLAYER_INFO_POSITIONS, SELECTABLE_ELEMENTS } from "./constants.js";
import PlayerInfoMatchBlock from "./components/PlayerInfoMatchBlock.js";
import TurnsBlock from "./components/TurnsBlock.js";
import Board from "./components/board/Board.js";
import DecksBlock from "./components/deck/DecksBlock.js";
import HandBlock from "./components/hands/HandBlock.js";
import OptionsBlock from "./components/OptionsBlock.js";
import InfoSnackbar from "./components/InfoSnackbar.js";

export const MatchGame = ({ matchSocket }) => {
    const [matchLoaded, setMatchLoaded] = useState(false);
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
    const [playerIndex, setPlayerIndex] = useState(-1);
    const [turn, setTurn] = useState(-1);
    const [turnProgress, setTurnProgress] = useState(0);
    const [fields, setFields] = useState([]);
    const [units, setUnits] = useState([]);

    // selectedElement can represent card or unit
    const selectedELementTemplate = { type: -1, id: -1 };
    const [selectedElement, setSelectedElement] = useState(
        selectedELementTemplate
    );

    // snackbar values
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("Error");

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

    // selecting elements

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

    const selectUnit = (unitId) => {
        // select unit if none or other is selected, unselect when try select
        // that seame unit once again
        if (
            selectedElement.type != SELECTABLE_ELEMENTS.unit ||
            selectedElement.id != unitId
        ) {
            setSelectedElement({
                type: SELECTABLE_ELEMENTS.unit,
                id: unitId,
            });
        } else {
            clearSelection();
        }
    };

    const handleClickOnField = (fieldId) => {
        // try play card at field
        if (selectedElement.type == SELECTABLE_ELEMENTS.card) {
            playCard(selectedElement.id, fieldId);
        }
        // try move unit to field
        if (selectedElement.type == SELECTABLE_ELEMENTS.unit) {
            moveUnit(selectedElement.id, fieldId);
        }
    };

    // playing a cards

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

    // operating on units

    const moveUnit = (unitId, fieldId) => {
        // send message to socket to move unit
        matchSocket.send(
            JSON.stringify({
                message: "move-unit",
                data: { unit_id: unitId, field_id: fieldId },
            })
        );
        clearSelection();
    };

    // socket connection

    // set onmessage
    matchSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(`websocket onmessage: ${data.message.name}`);

        const messageData = data.message.data;
        console.log("message data: ", data.message.data);
        switch (data.message.name) {
            case "get-initial-data":
                setPlayerData(messageData.players_data.player);
                setEnemyData(messageData.players_data.enemy);
                setTurn(messageData.turn);
                setFields(messageData.fields);
                setUnits(messageData.units);
                setMatchLoaded(true);
                break;
            case "get-player-index":
                setPlayerIndex(messageData.player_index);
                break;
            case "turn-changed":
                setTurn(messageData.turn);
                break;
            case "turn-progress-changed":
                setTurnProgress(messageData.progress);
                break;
            case "deck-cards-count-changed":
                const setThatPlayerData =
                    messageData.for_player_at_index == playerIndex
                        ? setPlayerData
                        : setEnemyData;
                const newCount = messageData.new_count;
                setThatPlayerData((prevState) => ({
                    ...prevState,
                    deck_cards_count: newCount,
                }));
                break;
            case "hand-cards-changed":
                console.log('pl', playerIndex);
                if (messageData.for_player_at_index == playerIndex) {
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
                if (messageData.result == false) {
                    showSnackbar("A card cannot be played !");
                }
                break;
            case "units-changed":
                setUnits(messageData.units);
                break;
            case "move-unit":
                if (messageData.result == false) {
                    showSnackbar("Cannot move unit !");
                }
                break;
            default:
                break;
        }
    };

    // useEffect with [] as second argument trigger the callback only after
    // the first render
    useEffect(() => {
        // to know which player is client
        matchSocket.send(JSON.stringify({ message: "get-player-index" }));
        // to get start data about match
        matchSocket.send(JSON.stringify({ message: "get-initial-data" }));
    }, []);

    // rendering

    const mainComponent = () => (
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
                            turn={turn}
                            playerIndex={playerIndex}
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
                        fieldProps={{
                            units: units,
                            selectedElement: selectedElement,
                            handleClickOnField: handleClickOnField,
                            turn: turn,
                            unitProps: {
                                playerIndex: playerIndex,
                                selectUnit: selectUnit,
                                selectedElement: selectedElement,
                            },
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
                cardProps={{
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

    // render match if fully loads
    return matchLoaded ? mainComponent() : <MatchLoading />;
};

export default MatchGame;
