import React, { useContext } from "react";
import { Box, Zoom } from "@material-ui/core";
import {
    SELECTABLE_ELEMENTS,
    SELECTED_ELEMENT_TEMPLATE,
} from "../../../constants";
import {
    PlayerIndexContext,
    SelectedElementContext,
} from "../../../matchContexts";
import Unit from "./Unit";
import UnitMatchAnimations from "../animations/unit/UnitAnimator";

export const UnitInMatch = ({
    unitData,
    handleClickOnEnemyUnit,
    highlight,
    showSmall
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

    const makeTooltipContent = () => {
        return (
            <Box p={1}>
                {unitData.name}
                <ul>
                    <li>Health: {unitData.hp}/{unitData.max_hp}</li>
                    <li>Attack: {unitData.attack}/{unitData.max_attack}</li>
                    <li>Energy: {unitData.energy}/{unitData.max_energy}</li>
                    <li>Attack range: {unitData.attack_range}/{unitData.max_attack_range}</li>
                </ul>
            </Box>
        );
    };

    return (
        <Zoom in>
            <Box width={1} height={1}>
                <UnitMatchAnimations unitData={unitData}>
                    <Unit
                        clickCallback={handleClick}
                        unitData={unitData}
                        highlight={highlight}
                        belongsToPlayer={belongsToPlayer}
                        tooltipContent={makeTooltipContent()}
                        showSmall={showSmall}
                    />
                </UnitMatchAnimations>
            </Box>
        </Zoom>
    );
};

export default UnitInMatch;
