import React, { useContext, useState } from "react";
import { Box } from "@material-ui/core";
import Field from "./field/Field";
import {
    SELECTABLE_ELEMENTS,
    SELECTED_ELEMENT_TEMPLATE,
} from "../../constants";
import { SelectedElementContext } from "../../matchContexts";
import SizeChanger from "./SizeChanger";

export const Board = ({ matchSocket, fields, units, turn }) => {
    /* represents Board object in backend and is responsible for rendering
    fields and units on itself and communicating with socket to perform
    actions related with board */

    const { selectedElement, setSelectedElement } = useContext(
        SelectedElementContext
    );

    const [boardSize, setBoardSize] = useState(40);

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

    // operating on units

    const handleClickOnEnemyUnit = (unitId) => {
        // try attack enemy unit
        if (selectedElement.type == SELECTABLE_ELEMENTS.unit) {
            attackUnit(selectedElement.id, unitId);
        }
    };

    const attackUnit = (attacker_id, defender_id) => {
        // send message to socket to attack unit
        matchSocket.send(
            JSON.stringify({
                message: "attack-unit",
                data: { attacker_id: attacker_id, defender_id: defender_id },
            })
        );
        clearSelection();
    };

    // rendering field helpers

    const getSelectedUnit = () => {
        /* get selected unit to fields can hightlight self proper and not have
        to find by itself */
        if (selectedElement.type != SELECTABLE_ELEMENTS.unit) {
            return null;
        }
        // find unit
        const unit = units.find((e) => e.id == selectedElement.id);
        return unit;
    };

    const getSelectedUnitField = () => {
        /* get selected unit field to fields can hightlight proper and not have
        to find by itself */
        const unit = getSelectedUnit();
        if (unit == null) {
            return null;
        }
        const unitField = fields.find((field) => field.id == unit.field_id);
        return unitField;
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height={1}
        >
            <Box
                width={boardSize + "rem"}
                mx="auto" // to center Board in parent
                height={boardSize + "rem"}
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
                        handleClickOnEnemyUnit={handleClickOnEnemyUnit}
                        units={units}
                        turn={turn}
                        key={field.id}
                        rootSize={boardSize}
                    />
                ))}
            </Box>
            <SizeChanger size={boardSize} setSize={setBoardSize} />
        </Box>
    );
};

export default Board;
