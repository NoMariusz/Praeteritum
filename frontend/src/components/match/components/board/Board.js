import React from "react";
import { Box } from "@material-ui/core";
import Field from "./Field.js";
import { MATCH_BOARD_SIZE } from "./constants.js";
import { SELECTABLE_ELEMENTS } from "../../constants.js";

export const Board = ({ fields, fieldProps }) => {

    // get selected unit to fields can hightlight proper
    const getSelectedUnit = () => {
        if (fieldProps.selectedElement.type != SELECTABLE_ELEMENTS.unit) {
            return null;
        }
        // units are always sorted by id
        const unit = fieldProps.units[fieldProps.selectedElement.id];
        return unit;
    };

    // get selected unit field, to fields can hightlight proper
    const getSelectedUnitField = () => {
        const unit = getSelectedUnit();
        if (unit == null) {
            return null;
        }
        const unitField = fields.find(field => field.id == unit.field_id);
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
                    fieldProps={fieldProps}
                />
            ))}
        </Box>
    );
};

export default Board;
