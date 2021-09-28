import React, { useState, useEffect, useRef } from "react";
import { Box } from "@material-ui/core";

import MatchLoading from "./MatchLoading";
import { PLAYER_INFO_POSITIONS, SELECTED_ELEMENT_TEMPLATE } from "./constants";
import { PlayerIndexContext, SelectedElementContext } from "./matchContexts";
import PlayerInfoMatchBlock from "./components/PlayerInfoMatchBlock";
import TurnsBlock from "./components/TurnsBlock";
import Board from "./components/board/Board";
import DecksBlock from "./components/deck/DecksBlock";
import HandBlock from "./components/hands/HandBlock";
import EndGameBlock from "./components/end_game_info/EndGameBlock";
import InfoSnackbar from "./components/InfoSnackbar";
import OptionsMenu from "./components/OptionsMenu";
import SurrenderOption from "./components/menu_options/SurrenderOption";
import ChangeModeOption from "./components/menu_options/ChangeModeOption";

export const MatchGame = ({ matchSocket }) => {
    /* represents Match object from backend and enable to play a match by store
    states with match data and manage components responsible for specific
    parts of play */

    const [matchLoaded, setMatchLoaded] = useState(false);

    // object templates for data related to specific players in match
    const playersDataTemplate = {
        username: "",
        base_points: 0,
        deck_cards_count: 0,
    };
    const playerDataTemplate = { ...playersDataTemplate, hand_cards: [] };
    const enemyDataTemplate = { ...playersDataTemplate, hand_cards_count: 0 };

    // game related states
    const [playerData, setPlayerData] = useState(playerDataTemplate);
    const [enemyData, setEnemyData] = useState(enemyDataTemplate);
    const [playerIndex, setPlayerIndex] = useState(-1);
    const [turn, setTurn] = useState(-1);
    const [fields, setFields] = useState([]);
    const [units, setUnits] = useState([]);
    const [winnerIndex, setWinnerIndex] = useState(-1);

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

    // ref for portals to options menu content
    const menuContainer = useRef(null);

    // make handler for socket messages
    const matchSocketMessageHandler = (e) => {
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
                setWinnerIndex(messageData.winner_index);
                setPlayerIndex(messageData.player_index);
                break;
            case "turn-changed":
                setTurn(messageData.turn);
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
            case "attack-unit":
                if (messageData.result == false) {
                    showSnackbar("Cannot attack unit !");
                }
                break;
            case "base-points-changed":
                const modifyThatPlayerData =
                    messageData.for_player_at_index == playerIndex
                        ? setPlayerData
                        : setEnemyData;
                modifyThatPlayerData((prevState) => ({
                    ...prevState,
                    base_points: messageData.new_points,
                }));
                break;
            case "player-win":
                setWinnerIndex(messageData.winner_index);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        // to get start data about match
        matchSocket.send(JSON.stringify({ message: "get-initial-data" }));
    }, []);

    useEffect(() => {
        // connect to websocket messages
        matchSocket.addEventListener("message", matchSocketMessageHandler);

        return () => {
            // to delete listener for deleted components
            matchSocket.removeEventListener(
                "message",
                matchSocketMessageHandler
            );
        };
    });

    // rendering

    const mainComponent = () => (
        <Box
            height={1}
            width={1}
            my="5rem" // to cards not overlap on board and other elements
            display="flex"
            alignItems="center"
        >
            {/* Block at left frem board with player info, and round
                related stuff */}
            <Box
                flex="1 0 10rem"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height={1}
                width={1}
            >
                <PlayerInfoMatchBlock
                    playerData={enemyData}
                    positionInBox={PLAYER_INFO_POSITIONS.top}
                />
                <TurnsBlock matchSocket={matchSocket} turn={turn} />
                <PlayerInfoMatchBlock
                    playerData={playerData}
                    positionInBox={PLAYER_INFO_POSITIONS.bottom}
                />
            </Box>

            {/* Middle block with board */}
            <Board
                matchSocket={matchSocket}
                fields={fields}
                units={units}
                turn={turn}
                menuContainer={menuContainer}
            />

            {/* Right block with deck cards counter */}
            <Box
                flex="1 0 10rem"
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="center"
                height={1}
                width={1}
            >
                <DecksBlock playerData={playerData} enemyData={enemyData} />
            </Box>

            {/* Elements with absolute positions */}
            <HandBlock forMainPlayer={true} playerData={playerData} />
            <HandBlock forMainPlayer={false} playerData={enemyData} />

            <InfoSnackbar
                snackbarVisible={snackbarVisible}
                snackbarMessage={snackbarMessage}
                closeSnackbar={closeSnackbar}
            />

            <OptionsMenu menuContainer={menuContainer} />
            {/* main options for OptionsMenu */}
            <ChangeModeOption menuContainer={menuContainer}/>
            <SurrenderOption
                matchSocket={matchSocket}
                menuContainer={menuContainer}
            />

            <EndGameBlock
                winnerIndex={winnerIndex}
                playerName={playerData.username}
            />
        </Box>
    );

    // render match if data from backend is loaded
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
