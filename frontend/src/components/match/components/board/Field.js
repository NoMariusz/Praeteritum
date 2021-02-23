import React from "react";
import { Box } from "@material-ui/core";
import Unit from "./Unit.js";
import { BOARD_COLUMNS, BOARD_ROWS } from "./constants.js";
import { SELECTABLE_ELEMENTS } from "../../constants.js";

export const Field = ({ fieldData, toField }) => {
    const getIfFieldIsHighlighted = () => {
        // if player has no turn then can not do any actions on board
        if (!toField.hasTurn) {
            return false;
        }
        // Active when player select card and field is part of player base
        if (
            toField.selectedElement.type == SELECTABLE_ELEMENTS.card &&
            fieldData.is_base &&
            fieldData.in_player_half
        ) {
            return true;
        }
    };

    const isHighlighted = getIfFieldIsHighlighted();

    const fieldClick = () => {
        toField.handleClickOnField(fieldData.id);
    };

    const unitInField = toField.units.find(
        (unit) => unit.field_id == fieldData.id
    );

    const unitBlock =
        unitInField != undefined ? (
            <Unit unitData={unitInField} playerIndex={toField.playerIndex} />
        ) : null;

    return (
        <Box
            width={1 / BOARD_COLUMNS}
            height={1 / BOARD_ROWS}
            bgcolor={fieldData.is_base ? "#CCCCCC" : ""}
            color="text.primary"
            border={1}
            borderColor={isHighlighted ? "warning.main" : "text.primary"}
            onClick={fieldClick}
        >
            {unitBlock}
        </Box>
    );
};

export default Field;
