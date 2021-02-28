import React, { useContext } from "react";
import { PlayerIndexContext } from "../../matchContexts.js";
import EndGameDialog from "./EndGameDialog.js";
import VictoryContent from "./VictoryContent.js";
import DefeatContent from "./DefeatContent.js";
import DrawContent from "./DrawContent.js";

export const EndGameBlock = ({ winnerIndex, playerName }) => {
    const playerIndex = useContext(PlayerIndexContext);

    // when nobody win
    if (winnerIndex == -1) {
        return null;
    }

    // return content to dialog deppending on the winnerIndex
    const getProperContent = () => {
        switch (winnerIndex) {
            case -2:
                return <DrawContent playerName={playerName} />;
            case playerIndex:
                return <VictoryContent playerName={playerName} />;
            default:
                return <DefeatContent playerName={playerName} />;
        }
    };

    // when somebody win or draw show dialog
    return <EndGameDialog>{getProperContent()}</EndGameDialog>;
};

export default EndGameBlock;
