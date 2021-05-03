import React, { useContext } from "react";
import { Box, Zoom } from "@material-ui/core";
import {
    SELECTABLE_ELEMENTS,
    SELECTED_ELEMENT_TEMPLATE,
} from "../../../constants.js";
import {
    PlayerIndexContext,
    SelectedElementContext,
} from "../../../matchContexts.js";
import Unit from "./Unit.js";

export const UnitInMatch = ({
    unitData,
    handleClickOnEnemyUnit,
    highlight,
}) => {
    // contexts
    const playerIndex = useContext(PlayerIndexContext);
    const { selectedElement, setSelectedElement } = useContext(
        SelectedElementContext
    );

    const belongsToPlayer = unitData.owner == playerIndex;

    const handleClick = () => {
        if (belongsToPlayer) {
            // select unit when belongs to player
            selectUnit(unitData.id);
        } else {
            // delegete parrent to handle click on emeny unit
            handleClickOnEnemyUnit(unitData.id);
        }
    };

    const selectUnit = (unitId) => {
        /* select unit if none or other is selected, unselect when try select
        that same unit once again */
        if (
            selectedElement.type != SELECTABLE_ELEMENTS.unit ||
            selectedElement.id != unitId
        ) {
            setSelectedElement({
                type: SELECTABLE_ELEMENTS.unit,
                id: unitId,
            });
        } else {
            // clear selection
            setSelectedElement(SELECTED_ELEMENT_TEMPLATE);
        }
    };

    return (
        <Zoom in>
            <Box width={1} height={1}>
                <Unit
                    clickCallback={handleClick}
                    unitData={unitData}
                    highlight={highlight}
                    belongsToPlayer={belongsToPlayer}
                />
            </Box>
        </Zoom>
    );
};

export default UnitInMatch;
