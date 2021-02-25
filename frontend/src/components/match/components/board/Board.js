import React, { useContext } from "react";
import { Box } from "@material-ui/core";
import Field from "./Field.js";
import { MATCH_BOARD_SIZE } from "./constants.js";
import {
    SELECTABLE_ELEMENTS,
    SELECTED_ELEMENT_TEMPLATE,
} from "../../constants.js";
import { SelectedElementContext } from "../../matchContexts.js";

export const Board = ({ matchSocket, fields, units, turn }) => {
    const { selectedElement, setSelectedElement } = useContext(
        SelectedElementContext
    );

    // operating on fields

    const handleClickOnField = (fieldId) => {
        // try play card at field
        if (selectedElement.type == SELECTABLE_ELEMENTS.card) {
            playCard(selectedElement.id, fieldId);
        }
        // try move unit to field
        if (selectedElement.type == SELECTABLE_ELEMENTS.unit) {
            moveUnit(selectedElement.id, fieldId);
        }
    };

    const playCard = (cardId, fieldId) => {
        // send message to socket to play a card
        matchSocket.send(
            JSON.stringify({
                message: "play-a-card",
                data: { card_id: cardId, field_id: fieldId },
            })
        );
        clearSelection();
    };

    const moveUnit = (unitId, fieldId) => {
        // send message to socket to move unit
        matchSocket.send(
            JSON.stringify({
                message: "move-unit",
                data: { unit_id: unitId, field_id: fieldId },
            })
        );
        clearSelection();
    };

    const clearSelection = () => {
        setSelectedElement(SELECTED_ELEMENT_TEMPLATE);
    };

    // rendering field helpers

    const getSelectedUnit = () => {
        /* get selected unit to fields can hightlight proper */
        if (selectedElement.type != SELECTABLE_ELEMENTS.unit) {
            return null;
        }
        // units are always sorted by id
        const unit = units[selectedElement.id];
        return unit;
    };

    const getSelectedUnitField = () => {
        /* get selected unit field, to fields can hightlight proper */
        const unit = getSelectedUnit();
        if (unit == null) {
            return null;
        }
        const unitField = fields.find((field) => field.id == unit.field_id);
        return unitField;
    };

    return (
        <Box
            width={MATCH_BOARD_SIZE}
            my={`calc((100vh - ${MATCH_BOARD_SIZE}) / 2)`}
            height={MATCH_BOARD_SIZE}
            display="flex"
            // to turn the board towards the player
            flexWrap="wrap-reverse"
        >
            {fields.map((field) => (
                <Field
                    fieldData={field}
                    selectedUnitField={getSelectedUnitField()}
                    selectedUnit={getSelectedUnit()}
                    handleClickOnField={handleClickOnField}
                    units={units}
                    turn={turn}
                />
            ))}
        </Box>
    );
};

export default Board;
