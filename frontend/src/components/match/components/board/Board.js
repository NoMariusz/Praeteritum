import React from "react";
import { Box, Typography } from "@material-ui/core";
import { MATCH_BOARD_SIZE } from "./constants.js";

export const Board = ({fields}) => {
    return (
        <Box
            width={MATCH_BOARD_SIZE}
            my={`calc((100vh - ${MATCH_BOARD_SIZE}) / 2)`}
            height={MATCH_BOARD_SIZE}
            bgcolor="lightgray"
        >
            <Typography variant="h1">Board, fields count {fields.length}</Typography>
        </Box>
    );
};

export default Board;
