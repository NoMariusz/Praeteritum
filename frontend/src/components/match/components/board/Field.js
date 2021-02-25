import React, { useContext } from "react";
import { Box } from "@material-ui/core";
import Unit from "./Unit.js";
import { BOARD_COLUMNS, BOARD_ROWS } from "./constants.js";
import { SELECTABLE_ELEMENTS } from "../../constants.js";
import {
    PlayerIndexContext,
    SelectedElementContext,
} from "../../matchContexts.js";

export const Field = ({
    fieldData,
    selectedUnitField,
    selectedUnit,
    handleClickOnField,
    units,
    turn,
}) => {
    const playerIndex = useContext(PlayerIndexContext);
    const { selectedElement, _ } = useContext(SelectedElementContext);

    const unitInField = units.find((unit) => unit.field_id == fieldData.id);

    const fieldClick = () => {
        // disable clicks on field if is unit on it
        if (unitInField != undefined) {
            return false;
        }

        handleClickOnField(fieldData.id);
    };

    const calculateDistance = (otherField) => {
        // calculate distance between actual field and otherField
        const distance =
            Math.abs(otherField.column - fieldData.column) +
            Math.abs(otherField.row - fieldData.row);
        return distance;
    };

    const getIfFieldIsHighlighted = () => {
        // if player has no turn then can not do any actions on board
        if (turn != playerIndex) {
            return false;
        }
        const selectedElementType = selectedElement.type;
        // Active when player select card and field is part of player base
        if (
            selectedElementType == SELECTABLE_ELEMENTS.card &&
            fieldData.is_base &&
            fieldData.in_player_half
        ) {
            return true;
        }
        // Active when player select unit that can move there
        if (selectedUnitField != null) {
            const unitDistanceToField = calculateDistance(selectedUnitField);
            if (unitDistanceToField <= selectedUnit.move_points) {
                return true;
            }
        }
        return false;
    };

    const isHighlighted = getIfFieldIsHighlighted();

    const unitBlock =
        unitInField != undefined ? <Unit unitData={unitInField} /> : null;

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
