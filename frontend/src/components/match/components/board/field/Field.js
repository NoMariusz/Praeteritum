import React, { useContext } from "react";
import { Box } from "@material-ui/core";
import UnitInMatch from "../unit/UnitInMatch";
import {
    BOARD_COLUMNS,
    BOARD_ROWS,
    HIGHLIGHT_UNIT_ATTACK_COLOR,
} from "../constants";
import { SELECTABLE_ELEMENTS, HIGHLIGHT_COLOR } from "../../../constants";
import {
    PlayerIndexContext,
    SelectedElementContext,
} from "../../../matchContexts";
import FieldAnimator from "../animations/field/FieldAnimator";

export const Field = ({
    fieldData,
    selectedUnitField,
    selectedUnit,
    handleClickOnField,
    handleClickOnEnemyUnit,
    units,
    turn,
}) => {
    const playerIndex = useContext(PlayerIndexContext);
    const { selectedElement, _ } = useContext(SelectedElementContext);

    const unitInField = units.find(
        (unit) => unit.field_id == fieldData.id && unit.is_live
    );

    const fieldClick = () => {
        // disable clicks on field if is unit on it
        if (unitInField != undefined) {
            return false;
        }

        handleClickOnField(fieldData.id);
    };

    // utlis

    const calculateDistance = (otherField) => {
        // calculate distance between actual field and otherField
        const distance =
            Math.abs(otherField.column - fieldData.column) +
            Math.abs(otherField.row - fieldData.row);
        return distance;
    };

    // rendering helpers

    const getIfFieldIsHighlighted = () => {
        // if player has no turn then can not do any actions on board
        if (turn != playerIndex) {
            return false;
        }
        // not active when field is occupied by other unit
        if (unitInField != undefined) {
            return false;
        }
        const selectedElementType = selectedElement.type;
        // active when player select card and field is part of player base
        if (
            selectedElementType == SELECTABLE_ELEMENTS.card &&
            fieldData.is_base &&
            fieldData.in_player_half
        ) {
            return true;
        }
        // active when player select unit that can move there
        if (selectedUnitField != null) {
            const unitDistanceToField = calculateDistance(selectedUnitField);
            if (unitDistanceToField <= selectedUnit.energy) {
                return true;
            }
        }
        return false;
    };

    const getUnitHighlight = () => {
        // if unit is selected
        if (selectedUnit != null && selectedUnit == unitInField) {
            return HIGHLIGHT_COLOR;
        }
        // if is not player turn then other highlight not work
        if (turn != playerIndex) {
            return null;
        }
        // if selected unit can attack enemy unit at field
        if (
            selectedUnit != null &&
            unitInField.owner != playerIndex &&
            selectedUnit.energy > 0
        ) {
            const unitDistanceToField = calculateDistance(selectedUnitField);
            if (unitDistanceToField <= selectedUnit.attack_range) {
                return HIGHLIGHT_UNIT_ATTACK_COLOR;
            }
        }
        return null;
    };

    const unitBlock =
        unitInField != undefined ? (
            <UnitInMatch
                unitData={unitInField}
                handleClickOnEnemyUnit={handleClickOnEnemyUnit}
                highlight={getUnitHighlight()}
            />
        ) : null;

    return (
        <Box
            width={1 / BOARD_COLUMNS}
            height={1 / BOARD_ROWS}
            bgcolor={fieldData.is_base ? "#CCCCCC" : ""}
            color="text.primary"
            border={1}
            borderColor={
                getIfFieldIsHighlighted() ? HIGHLIGHT_COLOR : "text.primary"
            }
            onClick={fieldClick}
        >
            <FieldAnimator unitData={unitInField} units={units}>
                {unitBlock}
            </FieldAnimator>
        </Box>
    );
};

export default Field;
