import React from "react";
import { Box } from "@material-ui/core";
import { BOARD_COLUMNS, BOARD_ROWS } from "./constants.js";
import { SELECTABLE_ELEMENTS } from "../../constants.js";

export const Field = ({ fieldData, toField }) => {
    const isActive =
        // Active when player select card and field is part of player base
        toField.selectedElement.type == SELECTABLE_ELEMENTS.card &&
        fieldData.is_base &&
        fieldData.in_player_half;

    const fieldClick = () => {
        toField.handleClickOnField(fieldData.id)
    }

    return (
        <Box
            width={1 / BOARD_COLUMNS}
            height={1 / BOARD_ROWS}
            bgcolor={fieldData.is_base ? "#CCCCCC" : ""}
            color="text.primary"
            border={1}
            borderColor={isActive ? "warning.main" : "text.primary"}
            onClick={fieldClick}
        />
    );
};

export default Field;
