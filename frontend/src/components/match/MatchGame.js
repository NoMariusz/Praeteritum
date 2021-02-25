import React, { useState, useEffect } from "react";
import { Grid, Box } from "@material-ui/core";

import MatchLoading from "./MatchLoading.js";
import {
    PLAYER_INFO_POSITIONS,
    SELECTED_ELEMENT_TEMPLATE,
} from "./constants.js";
import { PlayerIndexContext, SelectedElementContext } from "./matchContexts.js";
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
    const [selectedElement, setSelectedElement] = useState(
        SELECTED_ELEMENT_TEMPLATE
    );

    // snackbar values
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("Error");

    // snackbar

    const showSnackbar = (msg) => {
        setSnackbarMessage(msg);
        setSnackbarVisible(true);
    };

    const closeSnackbar = () => {
        setSnackbarVisible(false);
    };

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
                            matchSocket={matchSocket}
                            turn={turn}
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
                    <Board
                        matchSocket={matchSocket}
                        fields={fields}
                        units={units}
                        turn={turn}
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
            <HandBlock forMainPlayer={true} playerData={playerData} />
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
    return matchLoaded ? (
        <PlayerIndexContext.Provider value={playerIndex}>
            <SelectedElementContext.Provider
                value={{
                    selectedElement: selectedElement,
                    setSelectedElement: setSelectedElement,
                }}
            >
                {mainComponent()}
            </SelectedElementContext.Provider>
        </PlayerIndexContext.Provider>
    ) : (
        <MatchLoading />
    );
};

export default MatchGame;
