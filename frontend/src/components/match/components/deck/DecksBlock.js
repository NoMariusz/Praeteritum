import React from "react";
import { Box } from "@material-ui/core";
import Deck from "./Deck.js";

export const DecksBlock = ({playerData, enemyData}) => {
    return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                m={"3%"}
            >
                <Deck playerData={enemyData}/>
                <Deck playerData={playerData}/>
            </Box>
    );
};

export default DecksBlock;
