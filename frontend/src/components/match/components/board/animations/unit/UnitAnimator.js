import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";

import { usePrevious } from "src/utils.js";
import UnitAnimPlayer from "../AnimationPlayer";
import { UNIT_ANIMS, UNIT_ANIMS_STYLES } from "./UnitAnimsData";
import StatAnimation from "../statistic_animation/StatAnimation";
import StatAnimManager from "../statistic_animation/StatAnimManager";

export const UnitAnimator = ({ unitData, children }) => {
    /* Wrapper watching at unitData and playing animations in response of data
    change */

    const prevUnitData = usePrevious(unitData);
    const [actualAnim, setActualAnim] = useState(null);

    const [statAnimMgr] = useState(() => new StatAnimManager());

    useEffect(() => {
        // play animations in result of state changes
        if (prevUnitData) {
            // play anims only if prev state is loaded
            ["attack", "energy"].forEach((name) => {
                playOtherChangesAnims(name);
            });
            playHpChangeAnims();
        }
    }, [unitData]);

    const playHpChangeAnims = () => {
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
        } else if (hpChange > 0) {
            setActualAnim(UNIT_ANIMS.buff.name);
        }

        // run statistic animation showing damage taken
        statAnimMgr.playAnim({
            attributeName: "hp",
            value: hpChange,
        });

        return true;
    };

    const playOtherChangesAnims = (attributeName) => {
        // calc change
        const attributeChange =
            unitData[attributeName] - prevUnitData[attributeName];
        if (attributeChange == 0) {
            return false;
        }

        // play if change is not 0

        if (attributeChange > 0) {
            setActualAnim(UNIT_ANIMS.buff.name);
        } else {
            setActualAnim(UNIT_ANIMS.debuff.name);
        }

        statAnimMgr.playAnim({
            attributeName: attributeName,
            value: attributeChange,
        });

        return true;
    };

    return (
        <Box width={1} height={1} position="relative">
            <UnitAnimPlayer
                animName={actualAnim}
                animState={actualAnim}
                setAnimState={setActualAnim}
                animationsData={UNIT_ANIMS}
                animationsStylesData={UNIT_ANIMS_STYLES}
            >
                <>{children}</>
            </UnitAnimPlayer>
            <StatAnimation statAnimManager={statAnimMgr} />
        </Box>
    );
};

export default UnitAnimator;
