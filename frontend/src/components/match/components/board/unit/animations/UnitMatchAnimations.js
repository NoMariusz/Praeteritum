import React, { useEffect, useState, useRef } from "react";
import { Box } from "@material-ui/core";

import { usePrevious } from "src/utils.js";
import UnitAnimPlayer from "./UnitAnimPlayer";
import { UNIT_ANIMS } from "./UnitAnimsData";
import StatAnimation from "./statistic_animation/StatAnimation";
import StatAnimManager from "./statistic_animation/StatAnimManager";

export const UnitMatchAnimations = ({ unitData, children }) => {
    /* Wrapper watching at unitData and playing animations in response of data
    change */

    const prevUnitData = usePrevious(unitData);
    const [actualAnim, setActualAnim] = useState(null);

    const [statAnimMgr] = useState(()=>new StatAnimManager());

    useEffect(() => {
        // play animations in result of state changes
        playHpChangeAnims();
    }, [unitData]);

    const playHpChangeAnims = () => {
        // play anims only if prev state is loaded
        if (!prevUnitData) {
            return false;
        }
        // calc hp change
        const hpChange = unitData.hp - prevUnitData.hp;
        if (hpChange == 0) {
            return false;
        }
        // decide which anim play
        if (hpChange < 0 && hpChange > -5) {
            setActualAnim(UNIT_ANIMS.hpLight.name);
        } else if (hpChange <= -5 && hpChange >= -10) {
            setActualAnim(UNIT_ANIMS.hpStandard.name);
        } else if (hpChange < -10) {
            setActualAnim(UNIT_ANIMS.hpHeavy.name);
        }

        // run statistic animation showing damage taken
        statAnimMgr.playAnim({
            statisticName: "hp",
            value: hpChange,
        });

        return true;
    };

    return (
        <Box width={1} height={1} position="relative">
            <UnitAnimPlayer
                animName={actualAnim}
                animState={actualAnim}
                setAnimState={setActualAnim}
            >
                <>{children}</>
            </UnitAnimPlayer>
            <StatAnimation statAnimManager={statAnimMgr} />
        </Box>
    );
};

export default UnitMatchAnimations;
