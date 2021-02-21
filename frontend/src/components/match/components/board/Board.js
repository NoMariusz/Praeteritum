import React from "react";
import { Box } from "@material-ui/core";
import Field from "./Field.js";
import { MATCH_BOARD_SIZE } from "./constants.js";

export const Board = ({ fields }) => {
    return (
        <Box
            width={MATCH_BOARD_SIZE}
            my={`calc((100vh - ${MATCH_BOARD_SIZE}) / 2)`}
            height={MATCH_BOARD_SIZE}
            bgcolor="lightgray"
            display="flex"
            // to turn the board towards the player 
            flexWrap="wrap-reverse"
        >
            {fields.map((field) => (
                <Field fieldData={field} />
            ))}
        </Box>
    );
};

export default Board;
